import "server-only";

/**
 * Parses the two response envelope shapes documented in
 * docs/api/Dokumentasi_API_Postman.md (C2.1 "Format Respons"):
 *
 *   New format:    { headers: { statusCode, message, errorType, customMessage }, data }
 *   Legacy format: { success, data } (mostly the Registrasi host)
 *
 * Success = HTTP 200 AND (statusCode === 200 | success === true).
 * `message` is only safe to show verbatim to the customer when the server
 * marked it `customMessage: true`; otherwise callers must show a generic
 * message instead.
 */
export type SgbEnvelopeSuccess = {
  ok: true;
  data: unknown;
  message?: string;
  customMessage: boolean;
};

export type SgbEnvelopeFailure = {
  ok: false;
  sessionExpired: boolean;
  message?: string;
  customMessage: boolean;
  errorType?: unknown;
  /** `headers.statusCode` from the body — the server answers HTTP 200 even on failure. */
  statusCode?: unknown;
};

export type SgbEnvelopeResult = SgbEnvelopeSuccess | SgbEnvelopeFailure;

const SESSION_EXPIRED_PATTERNS = [
  /\bsession\b.*\bexpir(?:ed|y)\b/i,
  /\btoken\b.*\b(?:expired|invalid)\b/i,
  /\b(?:expired|invalid)\b.*\btoken\b/i,
  /\bjwt\b.*\bexpired\b/i,
  /\bunauthori[sz]ed\b/i,
];

function isAuthenticationStatus(value: unknown): boolean {
  const status = typeof value === "string" ? Number(value) : value;

  return status === 401 || status === 403;
}

function looksLikeSessionExpired(message: string | undefined): boolean {
  if (!message) {
    return false;
  }

  return SESSION_EXPIRED_PATTERNS.some((pattern) => pattern.test(message));
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return null;
}

export function parseSgbEnvelope(
  httpStatus: number,
  payload: unknown,
): SgbEnvelopeResult {
  if (isAuthenticationStatus(httpStatus)) {
    return { ok: false, sessionExpired: true, customMessage: false };
  }

  const record = asRecord(payload);
  const headersRecord = record ? asRecord(record.headers) : null;

  if (record && headersRecord) {
    const message =
      typeof headersRecord.message === "string" ? headersRecord.message : undefined;
    const customMessage = headersRecord.customMessage === true;
    const isSuccess = httpStatus === 200 && headersRecord.statusCode === 200;

    if (!isSuccess) {
      return {
        ok: false,
        sessionExpired:
          isAuthenticationStatus(headersRecord.statusCode) ||
          looksLikeSessionExpired(message),
        customMessage,
        message,
        errorType: headersRecord.errorType,
        statusCode: headersRecord.statusCode,
      };
    }

    return { ok: true, data: record.data, message, customMessage };
  }

  if (record && "success" in record) {
    const message = typeof record.message === "string" ? record.message : undefined;
    const isSuccess = httpStatus === 200 && record.success === true;

    if (!isSuccess) {
      return {
        ok: false,
        sessionExpired: looksLikeSessionExpired(message),
        customMessage: false,
        message,
      };
    }

    return { ok: true, data: record.data, message, customMessage: false };
  }

  // Response didn't match either documented envelope shape.
  if (httpStatus === 200) {
    return { ok: true, data: payload, customMessage: false };
  }

  return { ok: false, sessionExpired: false, customMessage: false };
}
