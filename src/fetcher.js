// recreation.gov fetcher. Pulls metadata + availability for each permit
// across a window of months and normalizes into a flat list of available slots.

import { PERMITS, NO_QUOTA_THRESHOLD } from "./permits.js";

const REC_BASE = "https://www.recreation.gov";
// Fetch 4 calendar months to cover any 90-day window from today.
const MONTHS_AHEAD = 4;
const WINDOW_DAYS = 90;

function pad(n) {
  return String(n).padStart(2, "0");
}

// Today in America/Los_Angeles as a YYYY-MM-DD string.
function todayLA() {
  const now = new Date();
  // Intl with en-CA gives ISO-like YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

function addDaysISO(iso, days) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(
    dt.getUTCDate()
  )}`;
}

function monthStartsAhead(fromISO, count) {
  const [y, m] = fromISO.split("-").map(Number);
  const out = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(Date.UTC(y, m - 1 + i, 1));
    out.push(
      `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(
        d.getUTCDate()
      )}`
    );
  }
  return out;
}

function lastDayOfMonthISO(monthStartISO) {
  const [y, m] = monthStartISO.split("-").map(Number);
  const d = new Date(Date.UTC(y, m, 0));
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(
    d.getUTCDate()
  )}`;
}

async function getJson(url, userAgent) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": userAgent || "PermitTracker/1.0",
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "en-US,en;q=0.9",
    },
    cf: { cacheTtl: 60, cacheEverything: true },
  });
  if (!res.ok) {
    throw new Error(`rec.gov ${url} → ${res.status}`);
  }
  return res.json();
}

async function fetchMeta(permit, userAgent) {
  const url = `${REC_BASE}/api/${permit.metaApi}/${permit.id}`;
  const d = await getJson(url, userAgent);
  const divisions = d?.payload?.divisions || {};
  const names = {};
  for (const [k, v] of Object.entries(divisions)) {
    names[k] = v.name || `Division ${k}`;
  }
  return { name: d?.payload?.name || permit.fullName, divisions: names };
}

// Yosemite-style: permitinyo returns { date: { divId: {total, remaining, is_walkup} } }
async function fetchYosemiteMonth(permit, monthStart, userAgent) {
  const end = lastDayOfMonthISO(monthStart);
  const url = `${REC_BASE}/api/permitinyo/${permit.id}/availability?start_date=${monthStart}&end_date=${end}`;
  const d = await getJson(url, userAgent);
  const payload = d?.payload || {};
  const out = [];
  for (const [date, divs] of Object.entries(payload)) {
    for (const [divId, info] of Object.entries(divs)) {
      out.push({
        date,
        divisionId: divId,
        total: info.total ?? 0,
        remaining: info.remaining ?? 0,
        isWalkup: !!info.is_walkup,
      });
    }
  }
  return out;
}

// Whitney / Desolation style: permits returns { availability: { divId: { date_availability: { "date T00:00:00Z": {...} } } } }
async function fetchPermitsMonth(permit, monthStart, userAgent) {
  const url = `${REC_BASE}/api/permits/${permit.id}/availability/month?start_date=${monthStart}T00%3A00%3A00.000Z&commercial_acct=false`;
  const d = await getJson(url, userAgent);
  const avail = d?.payload?.availability || {};
  const out = [];
  for (const [divId, div] of Object.entries(avail)) {
    const dates = div.date_availability || {};
    for (const [dateKey, info] of Object.entries(dates)) {
      const date = dateKey.slice(0, 10);
      out.push({
        date,
        divisionId: divId,
        total: info.total ?? 0,
        remaining: info.remaining ?? 0,
        isWalkup: !!info.show_walkup,
      });
    }
  }
  return out;
}

async function fetchPermitAvailability(permit, userAgent) {
  const today = todayLA();
  const months = monthStartsAhead(today, MONTHS_AHEAD);
  const fetcher = permit.api === "permitinyo" ? fetchYosemiteMonth : fetchPermitsMonth;
  const batches = await Promise.all(
    months.map((m) => fetcher(permit, m, userAgent).catch((e) => ({ __error: e.message })))
  );
  const slots = [];
  const errors = [];
  for (const b of batches) {
    if (b && b.__error) errors.push(b.__error);
    else slots.push(...b);
  }
  return { slots, errors };
}

// Aggregate: one row per (area, divisionId). Each row lists the available dates.
// This makes the dashboard scannable — 60 rows instead of 4000+.
export async function fetchAll(userAgent) {
  const today = todayLA();
  const maxDate = addDaysISO(today, WINDOW_DAYS);
  const groups = new Map();
  const errors = [];

  for (const permit of PERMITS) {
    try {
      const meta = await fetchMeta(permit, userAgent);
      const { slots, errors: e2 } = await fetchPermitAvailability(permit, userAgent);
      errors.push(...e2.map((m) => `${permit.area}: ${m}`));
      for (const s of slots) {
        if (s.date < today || s.date > maxDate) continue;
        if (s.remaining <= 0) continue;
        if (s.total >= NO_QUOTA_THRESHOLD) continue;
        const divisionName = meta.divisions[s.divisionId] || `Division ${s.divisionId}`;
        const category = permit.divisionCategory
          ? permit.divisionCategory(s.divisionId)
          : permit.defaultCategory;
        const bookingType = permit.divisionBookingType
          ? permit.divisionBookingType(s.divisionId)
          : permit.bookingType;
        const key = `${permit.id}:${s.divisionId}`;
        let g = groups.get(key);
        if (!g) {
          g = {
            permitId: permit.id,
            area: permit.area,
            areaFull: permit.fullName,
            division: divisionName,
            divisionId: s.divisionId,
            category,
            bookingType,
            dates: [],
            minTotal: s.total,
            maxTotal: s.total,
          };
          groups.set(key, g);
        }
        g.dates.push({ date: s.date, remaining: s.remaining, total: s.total });
        if (s.total < g.minTotal) g.minTotal = s.total;
        if (s.total > g.maxTotal) g.maxTotal = s.total;
      }
    } catch (e) {
      errors.push(`${permit.area}: ${e.message}`);
    }
  }

  const rows = [];
  for (const g of groups.values()) {
    g.dates.sort((a, b) => a.date.localeCompare(b.date));
    const first = g.dates[0];
    const bookUrl = `${REC_BASE}/permits/${g.permitId}/registration/detailed-availability?date=${first.date}&type=${g.bookingType}`;
    // "scarcity" = how filled the typical slot is. Lower = more in-demand trailhead.
    const avgFillRatio =
      g.dates.reduce((acc, d) => acc + (d.total - d.remaining) / d.total, 0) / g.dates.length;
    rows.push({
      area: g.area,
      areaFull: g.areaFull,
      division: g.division,
      divisionId: g.divisionId,
      permitId: g.permitId,
      category: g.category,
      firstDate: first.date,
      numDates: g.dates.length,
      dates: g.dates, // all available date entries
      bookUrl,
      typicalTotal: g.maxTotal,
      scarcity: avgFillRatio, // 0 = totally empty quota, 1 = totally booked
    });
  }

  // Sort: earliest first, then high-scarcity (popular) trailheads first, then name.
  rows.sort((a, b) => {
    if (a.firstDate !== b.firstDate) return a.firstDate.localeCompare(b.firstDate);
    if (a.scarcity !== b.scarcity) return b.scarcity - a.scarcity;
    if (a.area !== b.area) return a.area.localeCompare(b.area);
    return a.division.localeCompare(b.division);
  });

  return {
    generated: new Date().toISOString(),
    windowStart: today,
    windowEnd: maxDate,
    totalRows: rows.length,
    totalDateSlots: rows.reduce((n, r) => n + r.numDates, 0),
    errors,
    rows,
  };
}
