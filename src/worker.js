import { fetchAll } from "./fetcher.js";
import { HTML } from "./page.js";

const KV_KEY = "snapshot:v1";
const MAX_STALE_MS = 60 * 60 * 1000; // serve cached up to 1 hour past last refresh

async function refresh(env, ctx) {
  const prev = await getCached(env);
  const data = await fetchAll(env.USER_AGENT, prev);
  await env.CACHE.put(KV_KEY, JSON.stringify(data));
  return data;
}

async function getCached(env) {
  const raw = await env.CACHE.get(KV_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/" || url.pathname === "/index.html") {
      return new Response(HTML, {
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "public, max-age=300",
          "x-content-type-options": "nosniff",
          "referrer-policy": "no-referrer",
        },
      });
    }

    if (url.pathname === "/manifest.webmanifest") {
      const manifest = {
        name: "Permit Tracker",
        short_name: "Permits",
        description: "Live California wilderness permit availability",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#0a0c0a",
        theme_color: "#0a0c0a",
        icons: [
          {
            src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Crect width='512' height='512' rx='112' fill='%230a0c0a'/%3E%3Ccircle cx='256' cy='256' r='80' fill='%2350f090'/%3E%3Ccircle cx='256' cy='256' r='128' fill='none' stroke='%2350f090' stroke-width='8' opacity='0.4'/%3E%3C/svg%3E",
            type: "image/svg+xml",
            sizes: "any",
            purpose: "any",
          },
        ],
      };
      return new Response(JSON.stringify(manifest), {
        headers: {
          "content-type": "application/manifest+json; charset=utf-8",
          "cache-control": "public, max-age=86400",
        },
      });
    }

    if (url.pathname === "/data") {
      let data = await getCached(env);
      const now = Date.now();
      const stale = !data || now - Date.parse(data.generated) > MAX_STALE_MS;
      if (stale) {
        try {
          data = await refresh(env, ctx);
        } catch (e) {
          if (!data) {
            return new Response(
              JSON.stringify({ error: e.message }),
              { status: 502, headers: { "content-type": "application/json" } }
            );
          }
          // serve stale on failure
        }
      }
      return new Response(JSON.stringify(data), {
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "public, max-age=60",
        },
      });
    }

    if (url.pathname === "/refresh") {
      const data = await refresh(env, ctx);
      return new Response(
        JSON.stringify({ ok: true, count: data.count, generated: data.generated }),
        { headers: { "content-type": "application/json" } }
      );
    }

    return new Response("Not found", { status: 404 });
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(refresh(env, ctx));
  },
};
