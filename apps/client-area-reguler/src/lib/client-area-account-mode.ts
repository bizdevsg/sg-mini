import type { AccountMode } from "@/components/organisms/client-area.types";
import type { ClientAreaAccountIds } from "@/lib/client-area-profile.shared";

export const CLIENT_AREA_ACCOUNT_MODE_COOKIE = "sgb_client_area_account_mode";
export const CLIENT_AREA_ACCOUNT_MODE_COOKIE_MAX_AGE =
  60 * 60 * 24 * 30;

export function resolveClientAreaAccountMode(
  value?: string | null,
): AccountMode {
  return value === "real" ? "real" : "demo";
}

export function resolveAvailableClientAreaAccountMode(
  value: string | null | undefined,
  accountIds: ClientAreaAccountIds,
): AccountMode {
  const preferredMode = resolveClientAreaAccountMode(value);

  if (accountIds[preferredMode]) {
    return preferredMode;
  }

  if (accountIds.real) {
    return "real";
  }

  if (accountIds.demo) {
    return "demo";
  }

  return preferredMode;
}
