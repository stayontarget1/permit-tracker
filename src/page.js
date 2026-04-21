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

function render(data) {
  const main = document.getElementById("main");
  const meta = document.getElementById("meta");
  meta.innerHTML = [
    '<span>Updated <b>' + fmtRelTime(data.generated) + '</b></span>',
    '<span>Window <b>' + data.windowStart + ' → ' + data.windowEnd + '</b></span>',
    '<span>Trailheads <b>' + data.totalRows + '</b></span>',
    '<span>Open dates <b>' + data.totalDateSlots + '</b></span>'
  ].join("");
  main.innerHTML = "";

  if (data.errors && data.errors.length) {
    const e = document.createElement("div");
    e.className = "error";
    e.textContent = "Some feeds failed: " + data.errors.join("; ");
    main.appendChild(e);
  }

  const byCat = {};
  const areas = new Set();
  for (const r of (data.rows || [])) {
    (byCat[r.category] ||= []).push(r);
    areas.add(r.area);
  }
  // Annotate footer sources with which feeds returned no data this cycle.
  const allAreas = ["Yosemite", "Mt. Whitney", "Desolation"];
  const sourceLine = allAreas.map(a => areas.has(a) ? a : a + " (no data)").join(" · ");
  const srcEl = document.getElementById("sources");
  if (srcEl) srcEl.textContent = sourceLine;

  for (const cat of CAT_ORDER) {
    const list = byCat[cat] || [];
    const section = document.createElement("section");
    const h2 = document.createElement("h2");
    h2.innerHTML =
      '<span class="tag ' + cat + '">' + CAT_LABEL[cat] + '</span>' +
      '<span class="count">' + list.length + ' trailhead' + (list.length === 1 ? '' : 's') + ' w/ openings</span>';
    section.appendChild(h2);

    if (!list.length) {
      const empty = document.createElement("div");
      empty.className = "empty";
      empty.textContent = cat === "day"
        ? "No day-hike permits currently open."
        : "No backpacking permits currently open.";
      section.appendChild(empty);
    } else {
      const ul = document.createElement("ul");
      ul.className = "slots";
      for (const r of list) {
        const a = document.createElement("a");
        a.className = "slot";
        a.href = r.bookUrl;
        a.target = "_blank";
        a.rel = "noopener";
        a.setAttribute("aria-label",
          CAT_LABEL[cat] + " — " + r.area + " " + r.division + ", " + r.numDates + " open date" + (r.numDates === 1 ? "" : "s") + ". Opens recreation.gov.");

        const pills = r.dates.slice(0, MAX_DATE_PILLS).map(d => {
          const { dow, short } = fmtDate(d.date);
          return '<span class="date-pill"><span class="dow">' + dow + '</span>' + short + '</span>';
        }).join("");
        const extra = r.dates.length > MAX_DATE_PILLS
          ? '<span class="date-pill more">+' + (r.dates.length - MAX_DATE_PILLS) + '</span>'
          : '';

        a.innerHTML =
          '<span class="orb" aria-hidden="true"></span>' +
          '<span class="body">' +
            '<span class="title"><span class="area">' + escapeHtml(r.area) + '</span>' + escapeHtml(r.division) + '</span>' +
            '<span class="dates">' + pills + extra + '</span>' +
          '</span>' +
          '<span class="count"><span class="n">' + r.numDates + '</span><span class="lbl">open</span></span>';
        ul.appendChild(a);
      }
      section.appendChild(ul);
    }
    main.appendChild(section);
  }
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

load();
// auto-refresh every 5 minutes while tab is open
setInterval(() => { if (!document.hidden) load(); }, 5 * 60 * 1000);
document.addEventListener("visibilitychange", () => { if (!document.hidden) load(); });
</script>
</body>
</html>`;
