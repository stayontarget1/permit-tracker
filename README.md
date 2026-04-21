# Permit Tracker

Live dashboard for California wilderness permit availability — Yosemite, Mt. Whitney, Half Dome, Desolation, Inyo NF, Sequoia–Kings Canyon, Hoover — over the next 90 days.

Built as a single Cloudflare Worker with a 15-minute cron that pulls recreation.gov's internal API into KV. The frontend is ~12 KB of HTML/CSS/JS, no dependencies, no tracking, installable as a PWA on iOS.

## Deploy

```
wrangler kv namespace create permit_tracker_cache
# paste the returned id into wrangler.jsonc
wrangler deploy
```

## Layout

- `src/worker.js` — fetch + scheduled handlers, KV read/write, routes (`/`, `/data`, `/refresh`, `/manifest.webmanifest`)
- `src/fetcher.js` — recreation.gov calls, aggregation by trailhead, 90-day window
- `src/permits.js` — permit configuration (IDs, categories, booking types)
- `src/page.js` — embedded HTML/CSS/JS with date filter (Any / Weekend / 14d / 30d)

## Custom domain

To serve at something like `permits.dylanschmidt.com`:

1. Add the domain zone to Cloudflare (free plan is fine). Update nameservers at Porkbun to Cloudflare's.
2. In the Cloudflare dashboard → Workers & Pages → `permit-tracker` → Settings → Triggers → Custom Domains, add `permits.dylanschmidt.com`. Cloudflare provisions the cert and DNS record automatically.

Alternatively, keep DNS at Porkbun and use a CNAME to `permit-tracker.large-lake4645.workers.dev` — this works but does not get Cloudflare's custom-domain features.

## Notes on the data source

Two availability endpoints exist upstream and we pick per permit:

- **permitinyo** (newer): `/api/permitinyo/{id}/availability?start_date=&end_date=` — used by Yosemite (445859), Whitney (445860), Inyo (233262), Sequoia–Kings (445857), Hoover (445856).
- **permits** (legacy): `/api/permits/{id}/availability/month?start_date=` — used by Desolation (233261) and Half Dome (234652).

Division names come from `/api/permitcontent/{id}` for both systems.
