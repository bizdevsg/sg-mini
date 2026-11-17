import "server-only";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { APP_ENV } from "../env";

/**
 * Dev-only helper: saves a PII-masked copy of a real SGB API response to
 * docs/api/samples/ so response schemas can be written from real field names
 * instead of guesses. Does nothing outside `APP_ENV=dev` / non-production builds,
 * and never throws — capturing a sample must not break the request it observes.
 */
const SAMPLES_DIR = path.resolve(process.cwd(), "..", "..", "docs", "api", "samples");

const SENSITIVE_KEY_PATTERN =
  /(name|nama|email|phone|hp|telp|mobile|ktp|npwp|nik|address|alamat|rekening|bank_?account|token|csrf|password|otp)/i;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const JWT_LIKE_PATTERN = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
const LONG_ID_NUMBER_PATTERN = /^\d{13,20}$/;
const ID_PHONE_PATTERN = /^(\+?62|0)8\d{8,11}$/;

export function maskSamplePii(value: unknown, keyHint = ""): unknown {
  if (typeof value === "string") {
    if (
      SENSITIVE_KEY_PATTERN.test(keyHint) ||
      EMAIL_PATTERN.test(value) ||
      JWT_LIKE_PATTERN.test(value) ||
      LONG_ID_NUMBER_PATTERN.test(value) ||
      ID_PHONE_PATTERN.test(value)
    ) {
      return `***REDACTED(${value.length} chars)***`;
    }

    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => maskSamplePii(item, keyHint));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, val]) => [
        key,
        maskSamplePii(val, key),
      ]),
    );
  }

  return value;
}

/**
 * Dev-only: `?raw=1` on a BFF route returns the (PII-masked) upstream payload so
 * a developer can see the real response shape straight from the browser. Always
 * false outside `APP_ENV=dev` / non-production builds.
 */
export function wantsDevRaw(request: Request): boolean {
  return (
    APP_ENV === "dev" &&
    process.env.NODE_ENV !== "production" &&
    new URL(request.url).searchParams.get("raw") === "1"
  );
}

export async function captureDevSample(fileName: string, payload: unknown) {
  if (APP_ENV !== "dev" || process.env.NODE_ENV === "production") {
    return;
  }

  try {
    await mkdir(SAMPLES_DIR, { recursive: true });
    await writeFile(
      path.join(SAMPLES_DIR, fileName),
      `${JSON.stringify(maskSamplePii(payload), null, 2)}\n`,
      "utf8",
    );
  } catch (error) {
    console.warn("[sgb-sample-capture] could not write sample", fileName, error);
  }
}
