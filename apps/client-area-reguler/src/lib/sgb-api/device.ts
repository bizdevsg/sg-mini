import "server-only";

import {
  SGB_APP_VERSION,
  SGB_DEFAULT_LATITUDE,
  SGB_DEFAULT_LONGITUDE,
  SGB_DEVICE_BRAND_MODEL,
  SGB_DEVICE_MANUFACTURER,
  SGB_DEVICE_OS,
} from "../env";

/**
 * Device/app headers the third-party API expects on every request (see
 * docs/api/Dokumentasi_API_Postman.md, C2.3 "Header Wajib"). Pure function —
 * no cookies here — so it can be reused by both the running app (which
 * persists `uuid` in an httpOnly cookie, see lib/sgb-session.ts) and
 * scripts/sgb-discovery.ts (which runs outside a request context).
 */
export function buildSgbDeviceHeaders(uuid: string): Record<string, string> {
  return {
    uuid,
    oSD: SGB_DEVICE_OS,
    "User-Agent": SGB_DEVICE_OS,
    user_agent: SGB_DEVICE_OS,
    dDM: SGB_DEVICE_BRAND_MODEL,
    dM: SGB_DEVICE_MANUFACTURER,
    v: SGB_APP_VERSION,
    latitude: SGB_DEFAULT_LATITUDE,
    longitude: SGB_DEFAULT_LONGITUDE,
  };
}

/**
 * Fields that must appear in the login/verify-otp JSON body and be byte-for-byte
 * identical to the device headers above (docs/api/Dokumentasi_API_Postman.md,
 * "CATATAN: KONSISTENSI PERANGKAT" — the backend can reject the session if they
 * differ). Deriving both from the same source prevents them from drifting apart.
 */
export function buildSgbDeviceBodyFields(uuid: string) {
  return {
    uuid,
    user_agent: SGB_DEVICE_OS,
    latitude: SGB_DEFAULT_LATITUDE,
    longitude: SGB_DEFAULT_LONGITUDE,
  };
}
