import { protectSameOriginBrowserApiRoute, withApiProtectionHeaders } from "@/lib/api-protection";
import { getActiveSgbSession } from "@/lib/client-area-auth";
import { SGB_FLAVOR } from "@/lib/env";
import { resolveSgbAccountStreamUrl, toSgbApiMode } from "@/lib/sgb-api/hosts";
import { parseSaiPrices } from "@/lib/live-quotes";
import { accountIdsByMode, parseAccountSummary } from "@/types/account-summary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const blocked = protectSameOriginBrowserApiRoute(request);
  if (blocked) return blocked;

  const mode = new URL(request.url).searchParams.get("mode");
  if (mode !== "real" && mode !== "demo") return new Response(null, { status: 400 });
  const session = await getActiveSgbSession();
  if (!session) return new Response(null, { status: 401 });

  const expectedAccount = accountIdsByMode(session.accounts)[mode];
  if (!expectedAccount) return new Response(null, { status: 404 });

  let url: URL;
  try {
    const base = new URL(resolveSgbAccountStreamUrl(SGB_FLAVOR, toSgbApiMode(mode)));
    if (base.protocol !== "wss:" || base.username || base.password || base.search || base.hash) {
      return new Response(null, { status: 503 });
    }
    if (!/^\/admin-socket\/connect-admin-price(?:\/v2)?\/?$/.test(base.pathname)) {
      return new Response(null, { status: 503 });
    }
    url = base;
    url.searchParams.set("t", session.token);
  } catch {
    return new Response(null, { status: 503 });
  }

  const encoder = new TextEncoder();
  let cleanup = () => {};
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      let closed = false;
      let socket: WebSocket;
      let heartbeat: ReturnType<typeof setInterval> | undefined;
      let watchdog: ReturnType<typeof setTimeout> | undefined;
      const finish = () => {
        if (closed) return;
        closed = true;
        if (heartbeat) clearInterval(heartbeat);
        if (watchdog) clearTimeout(watchdog);
        request.signal.removeEventListener("abort", finish);
        if (socket && socket.readyState < WebSocket.CLOSING) socket.close();
        try { controller.close(); } catch { /* Stream already cancelled. */ }
      };
      cleanup = finish;
      const send = (event: string, data: unknown) => {
        if (!closed) controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };
      const armWatchdog = () => {
        if (watchdog) clearTimeout(watchdog);
        watchdog = setTimeout(finish, 20000);
      };
      try { socket = new WebSocket(url.toString()); } catch { finish(); return; }
      request.signal.addEventListener("abort", finish, { once: true });
      if (request.signal.aborted) { finish(); return; }
      armWatchdog();
      socket.onopen = () => {
        socket.send("2");
        heartbeat = setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) socket.send("2");
        }, 10000);
      };
      socket.onmessage = (event) => {
        armWatchdog();
        if (typeof event.data !== "string") return;
        if (event.data === "3") { send("alive", {}); return; }
        try {
          const payload: unknown = JSON.parse(event.data);
          if (!payload || typeof payload !== "object") return;
          const message = payload as { headers?: { statusCode?: number } };
          if (message.headers?.statusCode === 401) {
            console.warn("[sai-stream] upstream session expired");
            send("upstream-expired", {});
            finish();
            return;
          }
          const prices = parseSaiPrices(payload);
          if (prices) { send("prices", prices); return; }
          const account = parseAccountSummary({ data: payload });
          if (account && account.accountId === expectedAccount) send("account", account);
          else if (account) console.warn("[sai-stream] account does not match selected mode");
        } catch { /* Ignore malformed upstream messages. */ }
      };
      socket.onerror = () => {
        console.warn("[sai-stream] upstream connection failed");
        finish();
      };
      socket.onclose = finish;
    },
    cancel() { cleanup(); },
  });
  return withApiProtectionHeaders(new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "private, no-store, no-transform",
      "X-Accel-Buffering": "no",
    },
  }));
}
