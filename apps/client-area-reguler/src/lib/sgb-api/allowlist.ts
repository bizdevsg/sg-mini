import "server-only";

import type { SgbHostKind } from "./hosts";

/**
 * Hard allowlist of third-party endpoints the Client Area BFF is permitted to
 * call. This mirrors the "Endpoint yang dipakai (allowlist)" table in
 * prompt_integrasi_api_client_area-new.md — nothing else may be requested,
 * because the SSO token has full account access (no read-only scope exists).
 *
 * Every request MUST go through assertAllowedSgbRequest() before it is sent.
 * Do not add entries here for transaction/mutation endpoints (buy/sell,
 * deposit/withdrawal submit, profile update, registration, eKYC, REGOL
 * Legacy, etc.) — those are explicitly out of scope for this view-only portal.
 */
export type SgbMethod = "GET" | "POST" | "PUT";

type AllowlistEntry = {
  method: SgbMethod;
  host: SgbHostKind;
  pattern: RegExp;
  description: string;
};

const ALLOWLIST: readonly AllowlistEntry[] = [
  {
    method: "POST",
    host: "sso",
    pattern: /^\/sso\/login\/v1$/,
    description: "Login (SSO)",
  },
  {
    method: "GET",
    host: "sso",
    pattern: /^\/client\/account-otp$/,
    description: "Ambil nomor akun tujuan OTP",
  },
  {
    method: "POST",
    host: "sso",
    pattern: /^\/client\/send-otp$/,
    description: "Kirim OTP",
  },
  {
    method: "POST",
    host: "sso",
    pattern: /^\/client\/verify-otp$/,
    description: "Verifikasi OTP",
  },
  {
    method: "POST",
    host: "sso",
    pattern: /^\/sso\/logout\/v1$/,
    description: "Logout (SSO)",
  },
  {
    method: "GET",
    host: "sso",
    pattern: /^\/sso\/list-account\/v1$/,
    description: "Daftar akun trading (Demo/Real)",
  },
  {
    method: "GET",
    host: "trading",
    pattern: /^\/etrade\/accountsummary$/,
    description: "Kartu akun (Beranda)",
  },
  {
    method: "GET",
    host: "trading",
    pattern: /^\/etrade\/newmarket$/,
    description:
      "Posisi terbuka — GET saja. POST ke path yang sama adalah endpoint transaksi dan TIDAK diizinkan.",
  },
  {
    method: "GET",
    host: "trading",
    pattern: /^\/etrade\/tradehistory\/\d+\/\d+$/,
    description: "Riwayat trading (paginated: /tradehistory/{limit}/{page})",
  },
  {
    method: "GET",
    host: "trading",
    pattern: /^\/etrade\/show_orderhistory$/,
    description: "Riwayat order (opsional, bila dibutuhkan)",
  },
  {
    method: "GET",
    host: "trading",
    pattern: /^\/etrade\/dailystatement$/,
    description: "Daily statement",
  },
  {
    method: "POST",
    host: "register",
    pattern: /^\/api\/getcustomerfullinfo$/,
    description: "Profil nasabah lengkap",
  },
  {
    method: "POST",
    host: "register",
    pattern: /^\/api\/getcustomerphoto$/,
    description: "Foto profil (raw image)",
  },
  // Read-only lookups added for the profile discovery (fase 5): they may reveal
  // basic customer data (e.g. the real name) for accounts whose registration is
  // unfinished, where getcustomerfullinfo is refused. Only reachable through
  // the dev-only `?raw=1&probe=` option of /api/client-area/profile.
  {
    method: "POST",
    host: "register",
    pattern: /^\/api\/getsteps$/,
    description: "Progress step registrasi (baca)",
  },
  {
    method: "POST",
    host: "register",
    pattern: /^\/api\/getcustomerinfo$/,
    description: "Info dasar nasabah, varian body JSON (baca)",
  },
  {
    method: "GET",
    host: "register",
    pattern: /^\/api\/getcustomerbasicinfo$/,
    description: "Info dasar nasabah (baca)",
  },
];

export class SgbAllowlistViolationError extends Error {
  constructor(method: SgbMethod, host: SgbHostKind, path: string) {
    super(
      `Blocked non-allowlisted SGB request: ${method} ${host}:${path}. ` +
        "See apps/client-area/src/lib/sgb-api/allowlist.ts.",
    );
    this.name = "SgbAllowlistViolationError";
  }
}

export function assertAllowedSgbRequest(
  method: SgbMethod,
  host: SgbHostKind,
  path: string,
): void {
  const isAllowed = ALLOWLIST.some(
    (entry) =>
      entry.method === method && entry.host === host && entry.pattern.test(path),
  );

  if (!isAllowed) {
    throw new SgbAllowlistViolationError(method, host, path);
  }
}
