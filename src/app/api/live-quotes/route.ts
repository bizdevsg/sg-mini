import type { LiveQuotePayload } from "@/lib/live-quotes";
import { LIVE_QUOTE_SOCKET_URL } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RECONNECT_DELAY_MS = 3000;
const HEARTBEAT_INTERVAL_MS = 15000;

function formatSse(event: string, data: string) {
  return `event: ${event}\ndata: ${data}\n\n`;
}

export async function GET(request: Request) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      let socket: WebSocket | null = null;
      let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
      let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
      let isClosed = false;

      const send = (event: string, data: unknown) => {
        if (isClosed) {
          return;
        }

        controller.enqueue(
          encoder.encode(formatSse(event, JSON.stringify(data))),
        );
      };

      const cleanup = () => {
        if (reconnectTimer) {
          clearTimeout(reconnectTimer);
          reconnectTimer = null;
        }

        if (heartbeatTimer) {
          clearInterval(heartbeatTimer);
          heartbeatTimer = null;
        }

        socket?.close();
        socket = null;
      };

      const closeStream = () => {
        if (isClosed) {
          return;
        }

        isClosed = true;
        cleanup();
        controller.close();
      };

      const scheduleReconnect = () => {
        if (isClosed) {
          return;
        }

        send("status", { status: "reconnecting" });
        reconnectTimer = setTimeout(() => {
          connect();
        }, RECONNECT_DELAY_MS);
      };

      const connect = () => {
        if (isClosed) {
          return;
        }

        cleanup();
        send("status", { status: "connecting" });

        socket = new WebSocket(LIVE_QUOTE_SOCKET_URL);
        const currentSocket = socket;

        heartbeatTimer = setInterval(() => {
          if (!isClosed) {
            controller.enqueue(encoder.encode(": ping\n\n"));
          }
        }, HEARTBEAT_INTERVAL_MS);

        currentSocket.onopen = () => {
          if (isClosed || socket !== currentSocket) {
            currentSocket.close();
            return;
          }

          send("status", { status: "live" });
        };

        currentSocket.onmessage = (event) => {
          if (isClosed || socket !== currentSocket) {
            return;
          }

          try {
            const payload = JSON.parse(event.data as string) as LiveQuotePayload;

            if (
              !payload ||
              typeof payload !== "object" ||
              Array.isArray(payload)
            ) {
              return;
            }

            send("quote", payload);
          } catch {
            send("status", { status: "error" });
          }
        };

        currentSocket.onerror = () => {
          if (isClosed || socket !== currentSocket) {
            return;
          }

          send("status", { status: "error" });
        };

        currentSocket.onclose = () => {
          if (isClosed || socket !== currentSocket) {
            return;
          }

          scheduleReconnect();
        };
      };

      request.signal.addEventListener("abort", closeStream);
      connect();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
