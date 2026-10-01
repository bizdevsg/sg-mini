/**
 * Discovery for the Account Summary integration (tahap 1).
 *
 * Logs into the SGB SSO (UAT) with the test account, completes the OTP step,
 * then calls list-account and GET /etrade/accountsummary on BOTH Trading hosts
 * (Real and Demo) with the SAME token — to prove whether one SSO token works on
 * both — and saves PII-masked samples to docs/api/samples/.
 *
 * Usage (from apps/client-area/):
 *   SGB_TEST_EMAIL / SGB_TEST_PASSWORD in .env.local (never commit), then:
 *   npx tsx scripts/sgb-discovery-account-summary.ts
 *
 * OTP: the script sends the OTP and asks for the code on the terminal. For a
 * non-interactive run set SGB_OTP_FILE=<path>; the script then polls that file
 * for the 6 digits instead.
 *
 * Safety: refuses SGB_FLAVOR=prod. Makes exactly ONE verify-otp attempt — a
 * wrong code counts toward the server's lockout, so it stops instead of retrying.
 */
import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import Module from "node:module";
import path from "node:path";
import readline from "node:readline/promises";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(SCRIPT_DIR, "..");
const REPO_ROOT = path.resolve(APP_ROOT, "..", "..");
const SAMPLES_DIR = path.join(REPO_ROOT, "docs", "api", "samples");

// `server-only` is resolved by Next.js, not by Node — point it at a no-op stub.
const STUB_PATH = path.join(SCRIPT_DIR, "stubs", "server-only.cjs");
const moduleInternals = Module as unknown as {
  _resolveFilename: (request: string, ...rest: unknown[]) => string;
};
const originalResolveFilename = moduleInternals._resolveFilename;
moduleInternals._resolveFilename = function (request, ...rest) {
  return request === "server-only"
    ? STUB_PATH
    : originalResolveFilename.call(this, request, ...rest);
};

function loadEnvFile(filePath: string) {
  if (!existsSync(filePath)) {
    return;
  }

  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();

    if (/^(['"]).*\1$/.test(value)) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

// Must run BEFORE anything that reads process.env at module scope (lib/env.ts).
loadEnvFile(path.join(APP_ROOT, ".env.local"));
loadEnvFile(path.join(APP_ROOT, ".env"));
loadEnvFile(path.join(REPO_ROOT, ".env"));

// --- PII masking (best effort — eyeball the samples before sharing them) -----

const SENSITIVE_KEY_PATTERN =
  /(name|nama|email|phone|hp|telp|mobile|ktp|npwp|nik|address|alamat|rekening|bank_?account|token|csrf|password|otp)/i;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const JWT_LIKE_PATTERN = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
const LONG_ID_NUMBER_PATTERN = /^\d{13,20}$/;
const ID_PHONE_PATTERN = /^(\+?62|0)8\d{8,11}$/;

function maskPii(value: unknown, keyHint = ""): unknown {
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
    return value.map((item) => maskPii(item, keyHint));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, val]) => [
        key,
        maskPii(val, key),
      ]),
    );
  }

  return value;
}

function saveSample(fileName: string, payload: unknown) {
  mkdirSync(SAMPLES_DIR, { recursive: true });
  writeFileSync(
    path.join(SAMPLES_DIR, fileName),
    `${JSON.stringify(maskPii(payload), null, 2)}\n`,
    "utf8",
  );
  console.log(`  -> saved (masked) docs/api/samples/${fileName}`);
}

function maskEmail(email: string) {
  const [local = "", domain = ""] = email.split("@");
  return `${local.slice(0, 2)}***@${domain}`;
}

async function readOtpCode(): Promise<string> {
  const otpFile = process.env.SGB_OTP_FILE;

  if (otpFile) {
    console.log(`Waiting for the OTP code in ${otpFile} ...`);
    for (let i = 0; i < 150; i++) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      if (existsSync(otpFile)) {
        const code = readFileSync(otpFile, "utf8").trim();
        if (code) {
          return code;
        }
      }
    }
    return "";
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const code = (await rl.question("Masukkan kode OTP dari email: ")).trim();
  rl.close();
  return code;
}

async function main() {
  const { SGB_FLAVOR, SGB_TEST_EMAIL, SGB_TEST_PASSWORD } = await import(
    "../src/lib/env"
  );
  const { callSgbApi, SgbApiError } = await import("../src/lib/sgb-api/client");
  const { buildSgbDeviceHeaders, buildSgbDeviceBodyFields } = await import(
    "../src/lib/sgb-api/device"
  );
  const { encryptSgbPassword } = await import("../src/lib/sgb-api/crypto");

  console.log(`SGB discovery (account summary) — flavor=${SGB_FLAVOR}`);

  if (SGB_FLAVOR === "prod") {
    console.error("Refusing to run against SGB_FLAVOR=prod.");
    process.exit(1);
  }

  if (!SGB_TEST_EMAIL || !SGB_TEST_PASSWORD) {
    console.error(
      "SGB_TEST_EMAIL / SGB_TEST_PASSWORD are not set (.env.local). Stopping — " +
        "not guessing credentials.",
    );
    process.exit(1);
  }

  const uuid = randomUUID();
  const deviceHeaders = buildSgbDeviceHeaders(uuid);
  const deviceBodyFields = buildSgbDeviceBodyFields(uuid);
  const call = <T>(options: {
    method: "GET" | "POST";
    host: "sso" | "trading";
    path: string;
    mode: "normal" | "demo";
    token?: string;
    jsonBody?: unknown;
  }) =>
    callSgbApi<T>({ flavor: SGB_FLAVOR, deviceHeaders, ...options });

  try {
    console.log(`\n[1/4] Login (${maskEmail(SGB_TEST_EMAIL)})...`);
    const login = await call<{ token?: string; otpRequired?: boolean }>({
      method: "POST",
      host: "sso",
      path: "/sso/login/v1",
      mode: "normal",
      jsonBody: {
        email: SGB_TEST_EMAIL,
        password: encryptSgbPassword(SGB_TEST_PASSWORD),
        token_captcha: "",
        ...deviceBodyFields,
      },
    });
    let token = login.data?.token ?? login.newToken;
    const needsOtp =
      login.data?.otpRequired === true ||
      /need\s+otp/i.test(login.message ?? "");

    if (!token) {
      throw new Error("Login returned no token.");
    }

    if (needsOtp) {
      console.log("\n      OTP required — sending the code...");
      await call({
        method: "POST",
        host: "sso",
        path: "/client/send-otp",
        mode: "normal",
        token,
        jsonBody: {},
      });

      // idOtp is re-issued on every send, so read it AFTER send-otp.
      const otpInfo = await call<{ idOtp?: string }>({
        method: "GET",
        host: "sso",
        path: "/client/account-otp",
        mode: "normal",
        token,
      });
      const idOtp = otpInfo.data?.idOtp;

      if (!idOtp) {
        throw new Error("account-otp returned no idOtp after send-otp.");
      }

      const code = await readOtpCode();
      if (!code) {
        throw new Error("No OTP code provided — stopping.");
      }

      // Field naming is counter-intuitive but confirmed: otp_code = idOtp,
      // otp_number = the digits the customer typed.
      const verify = await call<{ token?: string }>({
        method: "POST",
        host: "sso",
        path: "/client/verify-otp",
        mode: "normal",
        token,
        jsonBody: { otp_code: idOtp, otp_number: code, ...deviceBodyFields },
      });
      token = verify.data?.token ?? verify.newToken;

      if (!token) {
        throw new Error("verify-otp returned no final token.");
      }
      console.log("      OTP verified — final token received.");
    }

    console.log("\n[2/4] list-account...");
    const listAccount = await call({
      method: "GET",
      host: "sso",
      path: "/sso/list-account/v1",
      mode: "normal",
      token,
    });
    saveSample("list-account.json", listAccount.data);

    const outcomes: string[] = [];
    for (const [step, mode, fileName] of [
      ["[3/4] accountsummary — host Trading Real", "normal", "accountsummary-real.json"],
      ["[4/4] accountsummary — host Trading Demo (token yang sama)", "demo", "accountsummary-demo.json"],
    ] as const) {
      console.log(`\n${step}...`);
      try {
        const summary = await call({
          method: "GET",
          host: "trading",
          path: "/etrade/accountsummary",
          mode,
          token,
        });
        saveSample(fileName, summary.data);
        outcomes.push(`${mode}: OK`);
      } catch (error) {
        const detail =
          error instanceof SgbApiError ? `[${error.kind}] ${error.message}` : String(error);
        console.error(`  FAILED: ${detail}`);
        outcomes.push(`${mode}: FAILED — ${detail}`);
      }
    }

    console.log("\n=== Hasil ===");
    for (const outcome of outcomes) {
      console.log(`- accountsummary ${outcome}`);
    }
  } catch (error) {
    const detail =
      error instanceof SgbApiError ? `[${error.kind}] ${error.message}` : String(error);
    console.error(`\nStopped: ${detail}`);
    process.exit(1);
  }
}

void main();
