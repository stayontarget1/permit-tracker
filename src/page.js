// Static HTML/CSS/JS served by the worker. Hacker-mountain aesthetic:
// dark, monospace, system fonts, no third-party assets, sub-20KB over the wire.

export const HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="color-scheme" content="dark">
<meta name="theme-color" content="#0a0c0a">
<meta name="robots" content="noindex,nofollow">
<title>Permit Tracker</title>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%230a0c0a'/%3E%3Ccircle cx='16' cy='16' r='5' fill='%2350f090'/%3E%3C/svg%3E">
<link rel="apple-touch-icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 180 180'%3E%3Crect width='180' height='180' rx='40' fill='%230a0c0a'/%3E%3Ccircle cx='90' cy='90' r='28' fill='%2350f090'/%3E%3Ccircle cx='90' cy='90' r='44' fill='none' stroke='%2350f090' stroke-width='3' opacity='0.4'/%3E%3C/svg%3E">
<link rel="manifest" href="/manifest.webmanifest">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Permits">
<style>
:root {
  --bg: #0a0c0a;
  --bg-2: #10130f;
  --fg: #e6ecdf;
  --muted: #7a8578;
  --line: #1d2219;
  --line-2: #2a3125;
  --accent: #50f090;
  --accent-dim: #2f7a54;
  --day: #ffc857;
  --overnight: #8fd3ff;
  --mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
}
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; background: var(--bg); color: var(--fg); }
body {
  font-family: var(--mono);
  font-size: 14px;
  line-height: 1.45;
  min-height: 100vh;
  padding: max(env(safe-area-inset-top), 16px) max(env(safe-area-inset-right), 16px) max(env(safe-area-inset-bottom), 24px) max(env(safe-area-inset-left), 16px);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
.wrap { max-width: 880px; margin: 0 auto; }
header { border-bottom: 1px solid var(--line); padding: 8px 0 18px; margin-bottom: 18px; }
h1 {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin: 0 0 4px;
  display: flex; align-items: center; gap: 10px;
}
h1 .dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--accent); box-shadow: 0 0 8px var(--accent);
  animation: pulse 2.2s ease-in-out infinite;
}
.sub { color: var(--muted); font-size: 12px; }
.meta { color: var(--muted); font-size: 11px; margin-top: 4px; display: flex; flex-wrap: wrap; gap: 10px; }
.meta span b { color: var(--fg); font-weight: 500; }
.filters { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 14px; }
.filters button {
  font: inherit; font-size: 11px;
  color: var(--muted);
  background: transparent;
  border: 1px solid var(--line);
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: border-color .15s, color .15s, background .15s;
}
.filters button:hover { border-color: var(--line-2); color: var(--fg); }
.filters button.active {
  color: var(--accent);
  border-color: var(--accent-dim);
  background: rgba(80, 240, 144, 0.06);
}
.areas { margin-top: 6px; }
.areas button.active {
  color: var(--fg);
  border-color: var(--line-2);
  background: rgba(255, 255, 255, 0.03);
}
.areas button:not(.active) { opacity: 0.5; }
h2.new-head .tag.new {
  background: var(--accent); color: var(--bg);
  animation: pulse 2.2s ease-in-out infinite;
}
.slot .date-pill.opened {
  background: rgba(80, 240, 144, 0.18);
  color: #d6fce1;
  border-color: rgba(80, 240, 144, 0.45);
  box-shadow: 0 0 6px rgba(80, 240, 144, 0.25);
}
.slot .new-badge {
  display: inline-block;
  font-size: 9px;
  letter-spacing: 0.14em;
  padding: 1px 5px;
  margin-right: 6px;
  border-radius: 2px;
  background: var(--accent); color: var(--bg);
  font-weight: 600;
  vertical-align: 1px;
}
section { margin-bottom: 26px; }
h2 {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
  margin: 0 0 10px;
  display: flex; align-items: center; gap: 10px;
}
h2 .tag {
  font-size: 10px;
  color: var(--bg);
  padding: 2px 6px;
  border-radius: 2px;
  letter-spacing: 0.1em;
}
h2 .tag.day { background: var(--day); }
h2 .tag.overnight { background: var(--overnight); }
h2 .count { color: var(--muted); font-weight: 400; letter-spacing: 0.1em; }
ul.slots { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
.slot {
  display: grid;
  grid-template-columns: 14px 1fr auto;
  align-items: start;
  gap: 12px;
  padding: 12px 14px;
  background: var(--bg-2);
  border: 1px solid var(--line);
  border-radius: 6px;
  text-decoration: none;
  color: var(--fg);
  transition: border-color .15s, transform .15s;
}
.slot:hover, .slot:focus { border-color: var(--line-2); transform: translateY(-1px); outline: none; }
.slot:focus-visible { border-color: var(--accent-dim); }
.slot .orb {
  width: 10px; height: 10px; border-radius: 50%;
  margin-top: 5px;
  background: var(--accent);
  box-shadow: 0 0 6px var(--accent), 0 0 14px var(--accent-dim);
  animation: pulse 2.2s ease-in-out infinite;
}
.slot .body { min-width: 0; }
.slot .title {
  color: var(--fg);
  font-weight: 500;
  font-size: 14px;
  line-height: 1.3;
  word-break: break-word;
  overflow-wrap: anywhere;
}
.slot .area { color: var(--muted); margin-right: 8px; font-weight: 400; }
.slot .dates {
  margin-top: 6px;
  display: flex; flex-wrap: wrap; gap: 4px;
  font-variant-numeric: tabular-nums;
  font-size: 11px;
}
.slot .date-pill {
  padding: 2px 6px;
  border-radius: 3px;
  background: rgba(80, 240, 144, 0.08);
  color: #b8e8c8;
  border: 1px solid rgba(80, 240, 144, 0.12);
}
.slot .date-pill .dow { color: var(--muted); margin-right: 3px; }
.slot .date-pill.more { background: transparent; color: var(--muted); border-color: var(--line-2); }
.slot .count {
  color: var(--muted);
  font-size: 11px;
  white-space: nowrap;
  text-align: right;
  line-height: 1.3;
}
.slot .count .n { color: var(--accent); font-weight: 600; font-size: 13px; }
.slot .count .lbl { display: block; letter-spacing: 0.08em; text-transform: uppercase; font-size: 10px; }
.empty {
  padding: 14px;
  border: 1px dashed var(--line-2);
  border-radius: 6px;
  color: var(--muted);
  text-align: center;
  font-size: 12px;
}
.error {
  padding: 10px 12px; margin-bottom: 14px;
  border: 1px solid #4a2a2a; background: #1a0e0e;
  color: #e8b4b4; font-size: 12px; border-radius: 4px;
}
footer { color: var(--muted); font-size: 11px; border-top: 1px solid var(--line); padding-top: 14px; margin-top: 28px; display: flex; flex-wrap: wrap; gap: 14px; justify-content: space-between; }
footer a { color: var(--muted); }
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.55; }
}
@media (max-width: 520px) {
  body { font-size: 13px; padding-left: max(env(safe-area-inset-left), 12px); padding-right: max(env(safe-area-inset-right), 12px); }
  .slot { grid-template-columns: 12px 1fr auto; gap: 10px; padding: 11px 12px; }
  .slot .title { white-space: normal; font-size: 13px; }
  .slot .count .lbl { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .slot .orb, h1 .dot { animation: none; }
  .slot { transition: none; }
}
</style>
</head>
<body>
<div class="wrap">
  <header>
    <h1><span class="dot" aria-hidden="true"></span>Permit Tracker</h1>
    <div class="sub">California wilderness permits — live availability, next 90 days.</div>
    <div class="meta" id="meta"></div>
    <nav class="filters" id="filters" aria-label="Date filter">
      <button data-f="any" class="active">Any date</button>
      <button data-f="weekend">Weekend</button>
      <button data-f="14">Next 14d</button>
      <button data-f="30">Next 30d</button>
    </nav>
    <nav class="filters areas" id="areas" aria-label="Area filter"></nav>
  </header>
  <main id="main">
    <div class="empty" id="loading">Loading availability…</div>
  </main>
  <footer>
    <div>Data: recreation.gov · updates every 15 min</div>
    <div id="sources">Yosemite · Mt. Whitney · Desolation</div>
  </footer>
</div>
<script>
const CAT_ORDER = ["day", "overnight"];
const CAT_LABEL = { day: "Day Hike", overnight: "Backpacking" };

const fmtDate = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  const dow = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][dt.getUTCDay()];
  const mon = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][dt.getUTCMonth()];
  return { dow, short: mon + " " + String(dt.getUTCDate()).padStart(2,"0") };
};

const fmtRelTime = (iso) => {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return Math.floor(diff/60) + "m ago";
  if (diff < 86400) return Math.floor(diff/3600) + "h ago";
  return Math.floor(diff/86400) + "d ago";
};

const MAX_DATE_PILLS = 6;
const ALL_AREAS = ["Yosemite", "Mt. Whitney", "Half Dome", "Desolation", "Inyo NF", "Sequoia-Kings", "Hoover"];
const FILTER_KEY = "pt.filter";
const AREA_KEY = "pt.areas";
const NEW_WINDOW_MS = 24 * 60 * 60 * 1000;
let activeFilter = localStorage.getItem(FILTER_KEY) || "any";
let activeAreas;
try {
  const stored = JSON.parse(localStorage.getItem(AREA_KEY) || "null");
  activeAreas = new Set(Array.isArray(stored) ? stored : ALL_AREAS);
} catch {
  activeAreas = new Set(ALL_AREAS);
}
let lastData = null;

function dateMatchesFilter(iso, filter) {
  if (filter === "any") return true;
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (filter === "weekend") {
    const dow = dt.getUTCDay(); // 0=Sun, 5=Fri, 6=Sat
    return dow === 5 || dow === 6 || dow === 0;
  }
  const days = parseInt(filter, 10);
  if (!Number.isFinite(days)) return true;
  const now = new Date();
  const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const diff = (dt.getTime() - todayUTC) / 86400000;
  return diff >= 0 && diff <= days;
}

function filterRow(row, filter) {
  if (filter === "any") return row;
  const dates = row.dates.filter(d => dateMatchesFilter(d.date, filter));
  if (!dates.length) return null;
  return { ...row, dates, numDates: dates.length, firstDate: dates[0].date };
}

function isOpenedRecent(openedAt, nowMs) {
  if (!openedAt) return false;
  const t = Date.parse(openedAt);
  return Number.isFinite(t) && nowMs - t < NEW_WINDOW_MS;
}

function render(data) {
  lastData = data;
  const main = document.getElementById("main");
  const meta = document.getElementById("meta");
  const nowMs = Date.now();

  const filtered = (data.rows || [])
    .filter(r => activeAreas.has(r.area))
    .map(r => filterRow(r, activeFilter))
    .filter(Boolean);
  const filteredDates = filtered.reduce((n, r) => n + r.numDates, 0);

  // Build "Just Opened" — rows whose filtered dates include a recent openedAt.
  const justOpened = [];
  for (const r of filtered) {
    const recentDates = r.dates.filter(d => isOpenedRecent(d.openedAt, nowMs));
    if (recentDates.length) {
      justOpened.push({ ...r, dates: recentDates, numDates: recentDates.length });
    }
  }
  // Most recently opened first (max openedAt per row).
  justOpened.sort((a, b) => {
    const am = Math.max(...a.dates.map(d => Date.parse(d.openedAt)));
    const bm = Math.max(...b.dates.map(d => Date.parse(d.openedAt)));
    return bm - am;
  });

  meta.innerHTML = [
    '<span>Updated <b>' + fmtRelTime(data.generated) + '</b></span>',
    '<span>Window <b>' + data.windowStart + ' → ' + data.windowEnd + '</b></span>',
    '<span>Trailheads <b>' + filtered.length + '</b></span>',
    '<span>Open dates <b>' + filteredDates + '</b></span>'
  ].join("");
  main.innerHTML = "";

  if (data.errors && data.errors.length) {
    const e = document.createElement("div");
    e.className = "error";
    e.textContent = "Some feeds failed: " + data.errors.join("; ");
    main.appendChild(e);
  }

  if (justOpened.length) {
    main.appendChild(renderSection("new", justOpened, {
      heading: "Just Opened",
      tagClass: "new",
      emptyNote: null,
      headClass: "new-head",
    }));
  }

  const byCat = {};
  for (const r of filtered) {
    (byCat[r.category] ||= []).push(r);
  }
  // Annotate footer with which areas returned no data this cycle (pre-filter).
  const availableAreas = new Set((data.rows || []).map(r => r.area));
  const sourceLine = ALL_AREAS.map(a => availableAreas.has(a) ? a : a + " (no data)").join(" · ");
  const srcEl = document.getElementById("sources");
  if (srcEl) srcEl.textContent = sourceLine;

  for (const cat of CAT_ORDER) {
    const list = byCat[cat] || [];
    main.appendChild(renderSection(cat, list, {
      heading: CAT_LABEL[cat],
      tagClass: cat,
      emptyNote: cat === "day"
        ? "No day-hike permits currently open."
        : "No backpacking permits currently open.",
    }));
  }
}

function renderSection(key, list, opts) {
  const section = document.createElement("section");
  const h2 = document.createElement("h2");
  if (opts.headClass) h2.className = opts.headClass;
  const countLabel = key === "new"
    ? list.length + " opening" + (list.length === 1 ? "" : "s") + " in last 24h"
    : list.length + " trailhead" + (list.length === 1 ? "" : "s") + " w/ openings";
  h2.innerHTML =
    '<span class="tag ' + opts.tagClass + '">' + opts.heading + '</span>' +
    '<span class="count">' + countLabel + '</span>';
  section.appendChild(h2);

  if (!list.length) {
    if (opts.emptyNote) {
      const empty = document.createElement("div");
      empty.className = "empty";
      empty.textContent = opts.emptyNote;
      section.appendChild(empty);
    }
    return section;
  }

  const ul = document.createElement("ul");
  ul.className = "slots";
  for (const r of list) {
    const a = document.createElement("a");
    a.className = "slot";
    // Deep-link to the earliest date in this (possibly filtered) view.
    const firstDate = r.dates[0] && r.dates[0].date;
    const targetUrl = firstDate
      ? r.bookUrl.replace(/date=\d{4}-\d{2}-\d{2}/, "date=" + firstDate)
      : r.bookUrl;
    a.href = targetUrl;
    a.target = "_blank";
    a.rel = "noopener";
    a.setAttribute("aria-label",
      opts.heading + " — " + r.area + " " + r.division + ", " +
      r.numDates + " open date" + (r.numDates === 1 ? "" : "s") + ". Opens recreation.gov.");

    const pills = r.dates.slice(0, MAX_DATE_PILLS).map(d => {
      const { dow, short } = fmtDate(d.date);
      const cls = "date-pill" + (d.openedAt ? " opened" : "");
      return '<span class="' + cls + '"><span class="dow">' + dow + '</span>' + short + '</span>';
    }).join("");
    const extra = r.dates.length > MAX_DATE_PILLS
      ? '<span class="date-pill more">+' + (r.dates.length - MAX_DATE_PILLS) + '</span>'
      : '';
    // Mark the row title with a small NEW badge only in the category sections (not the dedicated "Just Opened" one).
    const hasNew = key !== "new" && r.dates.some(d => d.openedAt);
    const newBadge = hasNew ? '<span class="new-badge">NEW</span>' : "";

    a.innerHTML =
      '<span class="orb" aria-hidden="true"></span>' +
      '<span class="body">' +
        '<span class="title">' + newBadge +
          '<span class="area">' + escapeHtml(r.area) + '</span>' + escapeHtml(r.division) +
        '</span>' +
        '<span class="dates">' + pills + extra + '</span>' +
      '</span>' +
      '<span class="count"><span class="n">' + r.numDates + '</span><span class="lbl">open</span></span>';
    ul.appendChild(a);
  }
  section.appendChild(ul);
  return section;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  })[c]);
}

async function load() {
  try {
    const r = await fetch("/data", { cache: "no-store" });
    if (!r.ok) throw new Error("Status " + r.status);
    const data = await r.json();
    render(data);
  } catch (e) {
    document.getElementById("main").innerHTML =
      '<div class="error">Could not load data: ' + escapeHtml(e.message) + '</div>';
  }
}

// Date-filter pill clicks: update state, persist, re-render from cached data.
document.getElementById("filters").addEventListener("click", (ev) => {
  const btn = ev.target.closest("button[data-f]");
  if (!btn) return;
  activeFilter = btn.dataset.f;
  localStorage.setItem(FILTER_KEY, activeFilter);
  for (const b of document.querySelectorAll("#filters button")) {
    b.classList.toggle("active", b.dataset.f === activeFilter);
  }
  if (lastData) render(lastData);
});
// Restore active date filter from localStorage on load.
for (const b of document.querySelectorAll("#filters button")) {
  b.classList.toggle("active", b.dataset.f === activeFilter);
}

// Area pills: build on page init, toggle on click.
const areasNav = document.getElementById("areas");
for (const area of ALL_AREAS) {
  const btn = document.createElement("button");
  btn.dataset.area = area;
  btn.textContent = area;
  if (activeAreas.has(area)) btn.classList.add("active");
  areasNav.appendChild(btn);
}
areasNav.addEventListener("click", (ev) => {
  const btn = ev.target.closest("button[data-area]");
  if (!btn) return;
  const area = btn.dataset.area;
  if (activeAreas.has(area)) activeAreas.delete(area);
  else activeAreas.add(area);
  // Don't allow all-off — re-enable if user toggled the last one off.
  if (activeAreas.size === 0) for (const a of ALL_AREAS) activeAreas.add(a);
  localStorage.setItem(AREA_KEY, JSON.stringify([...activeAreas]));
  for (const b of areasNav.querySelectorAll("button")) {
    b.classList.toggle("active", activeAreas.has(b.dataset.area));
  }
  if (lastData) render(lastData);
});

load();
// auto-refresh every 5 minutes while tab is open
setInterval(() => { if (!document.hidden) load(); }, 5 * 60 * 1000);
document.addEventListener("visibilitychange", () => { if (!document.hidden) load(); });
</script>
</body>
</html>`;
