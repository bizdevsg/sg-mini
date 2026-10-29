import "server-only";

import { NextResponse } from "next/server";

import {
  protectSameOriginBrowserApiRoute,
  withApiProtectionHeaders,
} from "@/lib/api-protection";
import { getTradePilotAccessContext } from "@/lib/trade-pilot/trade-pilot-access";
import { TradePilotApiError } from "@/lib/trade-pilot/trade-pilot-api";
import { consumeTradePilotRateLimit } from "@/lib/trade-pilot/trade-pilot-rate-limit";
import type {
  TradePilotMode,
  TradePilotRequestContext,
} from "@/lib/trade-pilot/trade-pilot.types";

const NO_STORE = { cacheControl: "private, no-store, max-age=0" };

export function tradePilotJson(body: unknown, status = 200) {
  return withApiProtectionHeaders(NextResponse.json(body, { status }), NO_STORE);
}

/** Bahasa untuk Accept-Language ke backend: `en` atau `id` (default). */
export function tradePilotLanguage(request: Request): "id" | "en" {
  const explicit = new URL(request.url).searchParams.get("lang");
  if (explicit === "en" || explicit === "id") return explicit;
  const header = request.headers.get("accept-language")?.trim().toLowerCase() ?? "";
  return header.startsWith("en") ? "en" : "id";
}

type TradePilotRouteAuthorization =
  | { context: null; response: Response }
  | { context: TradePilotRequestContext; response: null };

export async function authorizeTradePilotRoute(
  request: Request,
  mode?: TradePilotMode,
): Promise<TradePilotRouteAuthorization> {
  const blocked = protectSameOriginBrowserApiRoute(request);
  if (blocked) return { context: null, response: blocked };

  const access = await getTradePilotAccessContext();
  if (!access.authenticated || !access.userId) {
    return { context: null, response: tradePilotJson({ error: "SESSION_EXPIRED" }, 401) };
  }
  if (!access.allowed || (mode && !access.availableModes.includes(mode))) {
    return { context: null, response: tradePilotJson({ error: "access_denied" }, 403) };
  }

  return {
    context: {
      allowedModes: access.availableModes,
      language: tradePilotLanguage(request),
      userId: access.userId,
    },
    response: null,
  };
}

export function tradePilotRouteError(error: unknown) {
  if (error instanceof TradePilotApiError) {
    // 401 dari backend = API key salah (masalah ops), bukan sesi user habis.
    const status =
      error.httpStatus === 401
        ? 502
        : error.httpStatus >= 400 && error.httpStatus <= 599
          ? error.httpStatus
          : 502;
    const response = tradePilotJson(
      {
        error: error.code,
        message: error.message,
        requestId: error.requestId,
        ...(error.retryAfterSeconds ? { retryAfterSeconds: error.retryAfterSeconds } : {}),
      },
      status,
    );
    if (error.retryAfterSeconds) {
      response.headers.set("Retry-After", String(error.retryAfterSeconds));
    }
    return response;
  }

  return tradePilotJson({ error: "upstream_unavailable" }, 503);
}

export function rateLimitTradePilotRoute(
  context: TradePilotRequestContext,
  action: string,
  limit = 60,
) {
  return consumeTradePilotRateLimit(context.userId, action, limit)
    ? null
    : tradePilotJson({ error: "rate_limited" }, 429);
}
