import "server-only";

import { SGB_REQUEST_TIMEOUT_MS } from "../env";
import type { SgbFlavor } from "../env";
import { assertAllowedSgbRequest, type SgbMethod } from "./allowlist";
import { parseSgbEnvelope } from "./envelope";
import { resolveSgbHost, type SgbApiMode, type SgbHostKind } from "./hosts";

export type SgbApiErrorKind =
  | "network"
  | "timeout"
  | "invalid_response"
  | "session_expired"
  | "business";

/**
 * `message` is the raw diagnostic detail (safe for server logs only).
 * `safeMessage` is what may be shown to the customer — see
 * docs/api/Dokumentasi_API_Postman.md C2.4 "Penanganan Error".
 */
export class SgbApiError extends Error {
  readonly kind: SgbApiErrorKind;
  readonly safeMessage: string;
  readonly errorType?: unknown;

  constructor(
    kind: SgbApiErrorKind,
    message: string,
    safeMessage: string,
    errorType?: unknown,
  ) {
    super(message);
    this.name = "SgbApiError";
    this.kind = kind;
    this.safeMessage = safeMessage;
    this.errorType = errorType;
  }
}

/**
 * The SSO host answers a login session that is no longer usable (e.g. the OTP
 * step outlived its login) with "This account is blocked. Please contact
 * administrator." — the account is NOT actually blocked (confirmed with the API
 * owner); the customer just has to start a fresh login. Callers use this to
 * send the customer back to login instead of showing a misleading message.
 */
export function isSgbSessionRestartError(error: unknown): boolean {
  return error instanceof SgbApiError && /\bblocked\b/i.test(error.message);
}

export type SgbApiCallOptions = {
  method: SgbMethod;
  host: SgbHostKind;
  path: string;
  flavor: SgbFlavor;
  mode: SgbApiMode;
  token?: string;
  deviceHeaders: Record<string, string>;
  searchParams?: Record<string, string | undefined>;
  jsonBody?: unknown;
  timeoutMs?: number;
};

export type SgbApiCallResult<T = unknown> = {
  data: T;
  /** Message from a successful API envelope, used for flow decisions such as OTP. */
  message?: string;
  /** New token from the `csrf` response header, if the server rotated it. */
  newToken?: string;
};

function buildUrl(
  baseUrl: string,
  path: string,
  searchParams?: Record<string, string | undefined>,
): URL {
  const url = new URL(path, baseUrl);

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined) {
        url.searchParams.set(key, value);
      }
    }
  }

  return url;
}

/**
 * Mirrors the collection's token auto-refresh test script: a `csrf` response
 * header (case-insensitive) that looks like a JWT becomes the new token.
 */
function extractRotatedToken(headers: Headers): string | undefined {
  let csrf: string | undefined;

  headers.forEach((value, key) => {
    if (key.toLowerCase() === "csrf") {
      csrf = value;
    }
  });

  const trimmed = csrf?.trim();

  if (!trimmed || trimmed.split(".").length !== 3) {
    return undefined;
  }

  return trimmed;
}

async function sendSgbRequest(options: SgbApiCallOptions): Promise<Response> {
  assertAllowedSgbRequest(options.method, options.host, options.path);

  const baseUrl = resolveSgbHost(options.host, options.flavor, options.mode);
  const url = buildUrl(baseUrl, options.path, options.searchParams);

  const headers = new Headers(options.deviceHeaders);
  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }
  if (options.jsonBody !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  try {
    return await fetch(url, {
      method: options.method,
      headers,
      body: options.jsonBody !== undefined ? JSON.stringify(options.jsonBody) : undefined,
      signal: AbortSignal.timeout(options.timeoutMs ?? SGB_REQUEST_TIMEOUT_MS),
      cache: "no-store",
    });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new SgbApiError(
        "timeout",
        `Timeout calling ${options.method} ${options.host}:${options.path}`,
        "Koneksi ke server bermasalah. Coba lagi.",
      );
    }

    throw new SgbApiError(
      "network",
      error instanceof Error ? error.message : "Unknown network error",
      "Tidak ada koneksi ke server. Periksa jaringan Anda.",
    );
  }
}

/** For JSON endpoints (everything in the allowlist except the photo proxy). */
export async function callSgbApi<T = unknown>(
  options: SgbApiCallOptions,
): Promise<SgbApiCallResult<T>> {
  const response = await sendSgbRequest(options);
  const newToken = extractRotatedToken(response.headers);
  const rawBody = await response.text();

  let payload: unknown = null;
  if (rawBody) {
    try {
      payload = JSON.parse(rawBody);
    } catch {
      throw new SgbApiError(
        "invalid_response",
        `Non-JSON response from ${options.host}:${options.path}: ${rawBody.slice(0, 200)}`,
        "Terjadi kesalahan pada server. Coba lagi nanti.",
      );
    }
  }

  const envelope = parseSgbEnvelope(response.status, payload);

  if (!envelope.ok) {
    if (envelope.sessionExpired) {
      throw new SgbApiError(
        "session_expired",
        envelope.message ?? "Session has been expired",
        "Sesi Anda telah berakhir. Silakan login kembali.",
      );
    }

    throw new SgbApiError(
      "business",
      envelope.message ??
        `SGB API business error from ${options.host}:${options.path} (statusCode=${String(envelope.statusCode)}, errorType=${String(envelope.errorType)})`,
      envelope.customMessage && envelope.message
        ? envelope.message
        : "Terjadi kesalahan. Coba lagi nanti.",
      envelope.errorType,
    );
  }

  return {
    data: envelope.data as T,
    message: envelope.message,
    newToken,
  };
}

export type SgbApiRawResult = {
  body: ArrayBuffer;
  contentType: string;
  newToken?: string;
};

/** For binary endpoints (currently only the profile photo proxy). */
export async function callSgbApiRaw(
  options: SgbApiCallOptions,
): Promise<SgbApiRawResult> {
  const response = await sendSgbRequest(options);
  const newToken = extractRotatedToken(response.headers);
  const contentType = response.headers.get("content-type") ?? "application/octet-stream";

  if (!response.ok) {
    throw new SgbApiError(
      "invalid_response",
      `HTTP ${response.status} from ${options.host}:${options.path}`,
      "Gagal memuat data.",
    );
  }

  // Read as bytes directly — never via .text(), which would corrupt binary
  // image data by decoding/re-encoding it as UTF-8.
  const body = await response.arrayBuffer();

  return { body, contentType, newToken };
}
