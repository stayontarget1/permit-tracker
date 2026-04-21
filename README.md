# Permit Tracker

Live dashboard for California wilderness permit availability — Yosemite, Mt. Whitney, Desolation — over the next 90 days.

Built as a single Cloudflare Worker with a 15-minute cron that pulls recreation.gov's internal API into KV. The frontend is ~10 KB of HTML/CSS/JS, no dependencies, no tracking.

## Deploy

```
wrangler kv namespace create permit_tracker_cache
# paste the returned id into wrangler.jsonc
wrangler deploy
```

## Layout

- `src/worker.js` — fetch + scheduled handlers, KV read/write, routes (`/`, `/data`, `/refresh`)
- `src/fetcher.js` — recreation.gov calls, aggregation by trailhead, 90-day window
- `src/permits.js` — permit configuration (IDs, categories, booking types)
- `src/page.js` — embedded HTML/CSS/JS

## Notes

Uses recreation.gov's unofficial internal API. Mt. Whitney's `/api/permits/{id}/availability/month` endpoint returns empty payloads — appears to have migrated to an auth'd `permitinyo/availabilityv2` route. The UI flags this as "no data" when it happens.
