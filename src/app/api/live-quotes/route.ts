import type { LiveQuotePayload } from "@/lib/live-quotes";
import {
  protectSameOriginBrowserApiRoute,
  withApiProtectionHeaders,
} from "@/lib/api-protection";
import { subscribeToLiveQuotes } from "@/lib/live-quotes-broker";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HEARTBEAT_INTERVAL_MS = 15000;

function formatSse(event: string, data: string) {
  return `event: ${event}\ndata: ${data}\n\n`;
}

export async function GET(request: Request) {
  const blockedResponse = protectSameOriginBrowserApiRoute(request);

  if (blockedResponse) {
    return blockedResponse;
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
      let isClosed = false;
      let unsubscribe: (() => void) | null = null;
      const send = (event: string, data: unknown) => {
        if (isClosed) {
          return;
        }

        try {
          controller.enqueue(
            encoder.encode(formatSse(event, JSON.stringify(data))),
          );
        } catch {
          closeStream();
        }
      };

      const cleanup = () => {
        if (heartbeatTimer) {
          clearInterval(heartbeatTimer);
          heartbeatTimer = null;
        }

        unsubscribe?.();
        unsubscribe = null;
      };

      const closeStream = () => {
        if (isClosed) {
          return;
        }

        isClosed = true;
        cleanup();

        try {
          controller.close();
        } catch {}
      };

      heartbeatTimer = setInterval(() => {
        send("heartbeat", { at: Date.now() });
      }, HEARTBEAT_INTERVAL_MS);

      unsubscribe = subscribeToLiveQuotes((event, data) => {
        if (event === "quote") {
          const payload = data as LiveQuotePayload;

          if (
            !payload ||
            typeof payload !== "object" ||
            Array.isArray(payload)
          ) {
            return;
          }
        }

        send(event, data);
      });

      request.signal.addEventListener("abort", closeStream, { once: true });
    },
  });

  return withApiProtectionHeaders(
    new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    }),
  );
}
