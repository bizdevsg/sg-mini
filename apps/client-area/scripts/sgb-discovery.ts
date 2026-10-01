/**
 * Fase 1 discovery script — see prompt_integrasi_api_client_area-new.md.
 *
 * Logs into the third-party SGB API with a real test account, calls every
 * allowlisted endpoint once, and saves PII-masked response samples to
 * docs/api/samples/*.json so Fase 2 can build zod schemas from real data
 * instead of guessing field names.
 *
 * Usage (from apps/client-area/):
 *   1. Put SGB_TEST_EMAIL / SGB_TEST_PASSWORD / SGB_PASSWORD_PASSPHRASE in
 *      .env.local (never commit — .env* is already gitignored).
 *   2. npx tsx scripts/sgb-discovery.ts
 *
 * Safety:
 *   - Refuses to run against SGB_FLAVOR=prod unless SGB_ALLOW_PROD=true is
 *     also set — this is a deliberate extra step, never set it without
 *     explicit sign-off from the team.
 *   - Never bypasses captcha or guesses credentials. If login fails, the
 *     script stops and prints the (masked) response so a human can decide
 *     what to do next.
 *   - PII masking below is best-effort (key-name + value-pattern heuristics).
 *     Always eyeball docs/api/samples/*.json yourself before sharing them —
 *     the files are gitignored, but "gitignored" isn't "safe to paste anywhere".
 */
import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(SCRIPT_DIR, "..");
const REPO_ROOT = path.resolve(APP_ROOT, "..", "..");
const SAMPLES_DIR = path.join(REPO_ROOT, "docs", "api", "samples");

function loadEnvFile(filePath: string) {
  if (!existsSync(filePath)) {
    return;
  }

  const content = readFileSync(filePath, "utf8");

  for (const line of content.split(/\r?\n/)) {
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

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

// Load env BEFORE importing anything that reads process.env at module scope
// (lib/env.ts). Dynamic imports below run after this, so they see these values.
loadEnvFile(path.join(APP_ROOT, ".env.local"));
loadEnvFile(path.join(APP_ROOT, ".env"));
loadEnvFile(path.join(REPO_ROOT, ".env"));

// --- PII masking -----------------------------------------------------------

const SENSITIVE_KEY_PATTERN =
  /(name|nama|email|phone|hp|telp|mobile|ktp|npwp|nik|address|alamat|rekening|bank_?account|token|csrf|password|otp)/i;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const JWT_LIKE_PATTERN = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
const LONG_ID_NUMBER_PATTERN = /^\d{13,20}$/;
const ID_PHONE_PATTERN = /^(\+?62|0)8\d{8,11}$/;

function redact(value: string): string {
  return `***REDACTED(${value.length} chars)***`;
}

function maskPii(value: unknown, keyHint = ""): unknown {
  if (typeof value === "string") {
    if (
      SENSITIVE_KEY_PATTERN.test(keyHint) ||
      EMAIL_PATTERN.test(value) ||
      JWT_LIKE_PATTERN.test(value) ||
      LONG_ID_NUMBER_PATTERN.test(value) ||
      ID_PHONE_PATTERN.test(value)
    ) {
      return redact(value);
    }

    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => maskPii(item, keyHint));
  }

  if (value && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      result[key] = maskPii(val, key);
    }
    return result;
  }

  return value;
}

function saveSample(fileName: string, payload: unknown) {
  mkdirSync(SAMPLES_DIR, { recursive: true });
  const filePath = path.join(SAMPLES_DIR, fileName);
  writeFileSync(filePath, `${JSON.stringify(maskPii(payload), null, 2)}\n`, "utf8");
  console.log(`  → saved (masked) to docs/api/samples/${fileName}`);
}

function getOrCreateDiscoveryDeviceUuid(): string {
  const uuidFile = path.join(SAMPLES_DIR, ".device-uuid");

  if (existsSync(uuidFile)) {
    return readFileSync(uuidFile, "utf8").trim();
  }

  const uuid = randomUUID();
  mkdirSync(SAMPLES_DIR, { recursive: true });
  writeFileSync(uuidFile, uuid, "utf8");
  return uuid;
}

// --- Main --------------------------------------------------------------

async function main() {
  const { SGB_FLAVOR, SGB_TEST_EMAIL, SGB_TEST_PASSWORD, SGB_PASSWORD_PASSPHRASE } =
    await import("../src/lib/env");
  const { callSgbApi, callSgbApiRaw, SgbApiError } = await import(
    "../src/lib/sgb-api/client"
  );
  const { buildSgbDeviceHeaders, buildSgbDeviceBodyFields } = await import(
    "../src/lib/sgb-api/device"
  );
  const { encryptSgbPassword } = await import("../src/lib/sgb-api/crypto");

  console.log(`SGB discovery — flavor=${SGB_FLAVOR}`);

  if (SGB_FLAVOR === "prod" && process.env.SGB_ALLOW_PROD !== "true") {
    console.error(
      "Refusing to run discovery against SGB_FLAVOR=prod. Set SGB_ALLOW_PROD=true " +
        "only if you have explicit sign-off to hit production — this should almost never happen.",
    );
    process.exit(1);
  }

  if (!SGB_TEST_EMAIL || !SGB_TEST_PASSWORD) {
    console.error(
      "SGB_TEST_EMAIL / SGB_TEST_PASSWORD are not set. Put a real test account in " +
        "apps/client-area/.env.local (never commit it) and re-run. Stopping — not " +
        "guessing credentials or bypassing captcha.",
    );
    process.exit(1);
  }

  if (!SGB_PASSWORD_PASSPHRASE) {
    console.error(
      "SGB_PASSWORD_PASSPHRASE is not set. See docs/api/Dokumentasi_API_Postman.md B2.5.",
    );
    process.exit(1);
  }

  const uuid = getOrCreateDiscoveryDeviceUuid();
  const deviceHeaders = buildSgbDeviceHeaders(uuid);
  const deviceBodyFields = buildSgbDeviceBodyFields(uuid);

  const findings: string[] = [];

  console.log("\n[1/8] Login (SSO)...");
  let token: string | undefined;
  try {
    const loginResult = await callSgbApi<{ token?: string }>({
      method: "POST",
      host: "sso",
      path: "/sso/login/v1",
      flavor: SGB_FLAVOR,
      mode: "normal",
      deviceHeaders,
      jsonBody: {
        email: SGB_TEST_EMAIL,
        password: encryptSgbPassword(SGB_TEST_PASSWORD),
        token_captcha: "",
        ...deviceBodyFields,
      },
    });
    saveSample("login.json", loginResult.data);
    token = loginResult.data?.token;

    if (token) {
      findings.push("Login berhasil TANPA captcha (token_captcha kosong diterima).");
      findings.push("data.token ada di response login — konfirmasi field ini di login.json.");
    } else {
      findings.push(
        "Login sukses (tidak ada error) tapi data.token TIDAK ditemukan di response — " +
          "kemungkinan akun ini butuh verifikasi OTP sebelum token final diberikan. " +
          "Periksa login.json secara manual untuk field yang mengindikasikan itu.",
      );
    }
  } catch (error) {
    if (error instanceof SgbApiError) {
      console.error(`Login failed: [${error.kind}] ${error.message}`);
      if (/captcha/i.test(error.message)) {
        findings.push("Login GAGAL dengan indikasi captcha wajib di environment ini.");
      }
    } else {
      console.error("Login failed with an unexpected error:", error);
    }

    console.error(
      "\nStopping — login did not return a usable token. Not attempting to bypass " +
        "captcha or retry with different credentials. Report this and the findings " +
        "above back to the team.",
    );
    printFindings(findings);
    process.exit(1);
  }

  console.log("\n[2/8] List akun (SSO)...");
  try {
    const listAccountResult = await callSgbApi({
      method: "GET",
      host: "sso",
      path: "/sso/list-account/v1",
      flavor: SGB_FLAVOR,
      mode: "normal",
      token,
      deviceHeaders,
    });
    saveSample("list-account.json", listAccountResult.data);
  } catch (error) {
    logStepError("List akun", error);
  }

  console.log("\n[3/8] Ringkasan akun — mode normal (Real)...");
  try {
    const summaryNormal = await callSgbApi({
      method: "GET",
      host: "trading",
      path: "/etrade/accountsummary",
      flavor: SGB_FLAVOR,
      mode: "normal",
      token,
      deviceHeaders,
    });
    saveSample("accountsummary.normal.json", summaryNormal.data);
    findings.push("Ringkasan akun mode normal (Real) berhasil dengan token yang sama dari login.");
  } catch (error) {
    logStepError("Ringkasan akun (normal)", error);
  }

  console.log("\n[4/8] Ringkasan akun — mode demo (cross-host token check)...");
  try {
    const summaryDemo = await callSgbApi({
      method: "GET",
      host: "trading",
      path: "/etrade/accountsummary",
      flavor: SGB_FLAVOR,
      mode: "demo",
      token,
      deviceHeaders,
    });
    saveSample("accountsummary.demo.json", summaryDemo.data);
    findings.push(
      "PENTING: token SSO yang SAMA berhasil dipakai di host Trading demo maupun normal " +
        "— satu login berlaku untuk kedua mode.",
    );
  } catch (error) {
    findings.push(
      "PENTING: token SSO yang sama GAGAL dipakai di host Trading demo (lihat log error " +
        "di bawah) — kemungkinan perlu login/verifikasi ulang per mode Demo/Real.",
    );
    logStepError("Ringkasan akun (demo)", error);
  }

  console.log("\n[5/8] Posisi terbuka (GET /etrade/newmarket)...");
  try {
    const positions = await callSgbApi({
      method: "GET",
      host: "trading",
      path: "/etrade/newmarket",
      flavor: SGB_FLAVOR,
      mode: "normal",
      token,
      deviceHeaders,
    });
    saveSample("newmarket.json", positions.data);
  } catch (error) {
    logStepError("Posisi terbuka", error);
  }

  console.log("\n[6/8] Riwayat trading (limit=10, page=0)...");
  try {
    const tradeHistory = await callSgbApi({
      method: "GET",
      host: "trading",
      path: "/etrade/tradehistory/10/0",
      flavor: SGB_FLAVOR,
      mode: "normal",
      token,
      deviceHeaders,
    });
    saveSample("tradehistory.json", tradeHistory.data);
  } catch (error) {
    logStepError("Riwayat trading", error);
  }

  console.log("\n[7/8] Daily statement...");
  try {
    const dailyStatement = await callSgbApi({
      method: "GET",
      host: "trading",
      path: "/etrade/dailystatement",
      flavor: SGB_FLAVOR,
      mode: "normal",
      token,
      deviceHeaders,
    });
    saveSample("dailystatement.json", dailyStatement.data);
  } catch (error) {
    logStepError("Daily statement", error);
  }

  console.log("\n[8/8] Profil nasabah (getcustomerfullinfo)...");
  const customerId = process.env.SGB_DISCOVERY_CUSTOMER_ID?.trim();
  if (!customerId) {
    console.log(
      "  Skipped — set SGB_DISCOVERY_CUSTOMER_ID (the trading account number, e.g. " +
        "from list-account.json) in .env.local and re-run to also fetch the profile.",
    );
  } else {
    try {
      const profile = await callSgbApi({
        method: "POST",
        host: "register",
        path: "/api/getcustomerfullinfo",
        flavor: SGB_FLAVOR,
        mode: "normal",
        token,
        deviceHeaders,
        jsonBody: { customer_id: customerId },
      });
      saveSample("getcustomerfullinfo.json", profile.data);
    } catch (error) {
      logStepError("Profil nasabah", error);
    }

    try {
      const photo = await callSgbApiRaw({
        method: "POST",
        host: "register",
        path: "/api/getcustomerphoto",
        flavor: SGB_FLAVOR,
        mode: "normal",
        token,
        deviceHeaders,
        jsonBody: { customer_id: customerId },
      });
      console.log(
        `  → photo response: content-type=${photo.contentType}, ${photo.body.byteLength} bytes ` +
          "(bytes NOT saved to disk — this is a real customer photo, not text PII we can mask).",
      );
    } catch (error) {
      logStepError("Foto profil", error);
    }
  }

  printFindings(findings);
  console.log(
    "\nDone. Review docs/api/samples/*.json yourself before sharing — masking is best-effort.",
  );
}

function logStepError(step: string, error: unknown) {
  if (error instanceof Error && "kind" in error) {
    const apiError = error as Error & { kind: string };
    console.error(`  ✗ ${step} failed: [${apiError.kind}] ${apiError.message}`);
    return;
  }

  console.error(`  ✗ ${step} failed with an unexpected error:`, error);
}

function printFindings(findings: string[]) {
  console.log("\n=== Discovery findings ===");
  if (findings.length === 0) {
    console.log("(none recorded)");
    return;
  }
  for (const finding of findings) {
    console.log(`- ${finding}`);
  }
}

main().catch((error) => {
  console.error("Discovery script crashed:", error);
  process.exit(1);
});
