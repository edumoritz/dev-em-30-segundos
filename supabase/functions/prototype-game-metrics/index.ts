import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const DASHBOARD_TOKEN_SHA256 = "d0567b7a142cb890d89f5875009c24be35658643d0302203c669bf9273167060";
const ALLOWED_ORIGINS = new Set([
  "https://e-so-pedir-pra-ia.pages.dev",
  "http://localhost:8000",
  "http://127.0.0.1:8000"
]);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PATHS = new Set(["/", "/index.html", "/entrega.html"]);
const TYPES = new Set(["page_view", "game_start", "game_finish", "heartbeat"]);
const GAMES = new Set(["original", "delivery"]);

function response(body: unknown, status: number, origin: string | null) {
  const headers = new Headers({
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "authorization, apikey, x-client-info, content-type, x-dashboard-token");
    headers.set("Vary", "Origin");
  }
  return new Response(status === 204 ? null : JSON.stringify(body), { status, headers });
}

async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest)).map(byte => byte.toString(16).padStart(2, "0")).join("");
}

async function rpc(name: string, payload: Record<string, unknown>) {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) throw new Error("Metrics backend is not configured.");
  const result = await fetch(`${url}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: {
      "apikey": key,
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  if (!result.ok) {
    console.error("Metrics RPC failed:", name, result.status);
    throw new Error("Metrics storage is unavailable.");
  }
  return result;
}

Deno.serve(async request => {
  const origin = request.headers.get("Origin");
  if (origin && !ALLOWED_ORIGINS.has(origin)) return response({ error: "Origin not allowed." }, 403, null);
  if (request.method === "OPTIONS") return response({}, 204, origin);
  if (request.method !== "POST") return response({ error: "Method not allowed." }, 405, origin);
  if (Number(request.headers.get("Content-Length") || 0) > 4096) return response({ error: "Request too large." }, 413, origin);

  let input: Record<string, unknown>;
  try { input = await request.json(); } catch { return response({ error: "Invalid request." }, 400, origin); }

  if (input.action === "collect") {
    const { type, visitorId, sessionId, page, path } = input as Record<string, string>;
    const game = (input.game as string | undefined) || page;
    const playId = input.playId as string | undefined;
    if (!TYPES.has(type) || !GAMES.has(game) || !GAMES.has(page) || !PATHS.has(path) ||
        !UUID.test(visitorId || "") || !UUID.test(sessionId || "") ||
        (type !== "heartbeat" && game !== page) ||
        ((type === "game_start" || type === "game_finish") && !UUID.test(playId || ""))) {
      return response({ error: "Invalid metrics event." }, 400, origin);
    }
    const eventId = type === "page_view"
      ? `page:${visitorId}:${sessionId}:${path}`
      : type === "heartbeat"
        ? `heartbeat:${visitorId}:${sessionId}`
        : `${visitorId}:${game}:${type}:${playId}`;
    try {
      await rpc("prototype_metrics_record_game_event", {
        p_event_id: eventId,
        p_visitor_id: visitorId,
        p_session_id: sessionId,
        p_game: game,
        p_event_type: type,
        p_play_id: playId || null,
        p_path: path
      });
      return response({ ok: true }, 202, origin);
    } catch {
      return response({ error: "Metrics event could not be saved." }, 503, origin);
    }
  }

  if (input.action === "report") {
    const token = request.headers.get("x-dashboard-token") || "";
    if (!token || await sha256(token) !== DASHBOARD_TOKEN_SHA256) {
      return response({ error: "Unauthorized." }, 401, origin);
    }
    const days = Number(input.days ?? 30);
    if (![0, 7, 30, 90].includes(days)) return response({ error: "Invalid period." }, 400, origin);
    try {
      const result = await rpc("prototype_metrics_game_report", { p_days: days });
      return new Response(await result.text(), {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "private, no-store",
          ...(origin && ALLOWED_ORIGINS.has(origin) ? { "Access-Control-Allow-Origin": origin, "Vary": "Origin" } : {})
        }
      });
    } catch {
      return response({ error: "Metrics unavailable." }, 503, origin);
    }
  }

  return response({ error: "Invalid action." }, 400, origin);
});

