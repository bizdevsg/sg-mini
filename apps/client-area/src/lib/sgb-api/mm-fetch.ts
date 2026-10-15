import "server-only";

import { endSession, getSession, rotateToken } from "@/lib/client-area-auth";
import { SGB_FLAVOR, SGB_REQUEST_TIMEOUT_MS } from "@/lib/env";

import { assertAllowedSgbRequest, type SgbMethod } from "./allowlist";
import { SgbApiError } from "./client";
import { parseSgbEnvelope } from "./envelope";
import { resolveSgbHost, type SgbHostKind } from "./hosts";
import { extractRotatedSgbToken } from "./token-rotation";

export class SessionExpiredError extends Error {
  constructor() {
    super("MiniMicro session expired");
    this.name = "SessionExpiredError";
  }
}

export type MmFetchInit = Omit<RequestInit, "cache" | "mode"> & {
  host?: SgbHostKind;
  mode?: "real" | "demo";
  timeoutMs?: number;
};

type MmFetchDependencies = {
  fetch: typeof fetch;
  getSession: typeof getSession;
  rotateToken: typeof rotateToken;
  endSession: typeof endSession;
};

const defaultDependencies: MmFetchDependencies = {
  fetch,
  getSession,
  rotateToken,
  endSession,
};

/**
 * Creates the authenticated MiniMicro fetcher. Exported for isolated tests.
 *
 * IMPORTANT: call the resulting function only from a Route Handler or Server
 * Action. Token rotation writes cookies, which Server Components cannot do.
 */
export function createMmFetch(dependencies: MmFetchDependencies) {
  return async function fetchFromMiniMicro<T>(
    path: string,
    init: MmFetchInit = {},
  ): Promise<T> {
    const session = await dependencies.getSession();

    if (!session) {
      await dependencies.endSession();
      throw new SessionExpiredError();
    }

    const method = (init.method ?? "GET").toUpperCase() as SgbMethod;
    const host = init.host ?? "trading";
    const requestedMode = init.mode ?? (session.isDemo ? "demo" : "real");
    const baseUrl = resolveSgbHost(
      host,
      SGB_FLAVOR,
      requestedMode === "demo" ? "demo" : "normal",
    );
    const url = new URL(path, baseUrl);
    assertAllowedSgbRequest(method, host, url.pathname);
    const headers = new Headers(init.headers);
    headers.set("Authorization", `Bearer ${session.token}`);

    const {
      host: _host,
      mode: _accountMode,
      timeoutMs,
      ...requestInit
    } = init;
    let response: Response;

    try {
      response = await dependencies.fetch(url, {
        ...requestInit,
        method,
        headers,
        cache: "no-store",
        signal:
          requestInit.signal ??
          AbortSignal.timeout(timeoutMs ?? SGB_REQUEST_TIMEOUT_MS),
      });
    } catch (error) {
      if (error instanceof Error && error.name === "TimeoutError") {
        throw new SgbApiError(
          "timeout",
          `Timeout calling ${method} ${host}:${path}`,
          "Koneksi ke server bermasalah. Coba lagi.",
        );
      }

      throw new SgbApiError(
        "network",
        error instanceof Error ? error.message : "Unknown network error",
        "Tidak ada koneksi ke server. Periksa jaringan Anda.",
      );
    }

    const rawBody = await response.text();
    const rotatedToken = extractRotatedSgbToken(response.headers);

    if (rotatedToken && rotatedToken !== session.token) {
      await dependencies.rotateToken(rotatedToken);
    }

    if (
      response.status === 401 ||
      /session\s+has\s+been\s+expired/i.test(rawBody)
    ) {
      await dependencies.endSession();
      throw new SessionExpiredError();
    }

    let payload: unknown = null;
    if (rawBody) {
      try {
        payload = JSON.parse(rawBody);
      } catch {
        throw new SgbApiError(
          "invalid_response",
          `Non-JSON response from ${host}:${path}`,
          "Terjadi kesalahan pada server. Coba lagi nanti.",
        );
      }
    }

    const envelope = parseSgbEnvelope(response.status, payload);

    if (!envelope.ok) {
      if (envelope.sessionExpired) {
        await dependencies.endSession();
        throw new SessionExpiredError();
      }

      throw new SgbApiError(
        "business",
        envelope.message ?? `MiniMicro request failed: ${method} ${host}:${path}`,
        envelope.customMessage && envelope.message
          ? envelope.message
          : "Terjadi kesalahan. Coba lagi nanti.",
        envelope.errorType,
      );
    }

    return envelope.data as T;
  };
}

export const mmFetch = createMmFetch(defaultDependencies);
