import type { AccountMode } from "@/components/organisms/client-area.types";

export const CLIENT_AREA_ACCOUNT_MODE_COOKIE = "sgb_client_area_account_mode";
export const CLIENT_AREA_ACCOUNT_MODE_COOKIE_MAX_AGE =
  60 * 60 * 24 * 30;

export function resolveClientAreaAccountMode(
  value?: string | null,
): AccountMode {
  return value === "real" ? "real" : "demo";
}
