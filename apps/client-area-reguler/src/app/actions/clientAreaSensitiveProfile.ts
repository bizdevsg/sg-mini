"use server";

import {
  getClientAreaSessionProfile,
} from "@/lib/client-area-auth";
import { SGB_FLAVOR } from "@/lib/env";
import { callSgbApi } from "@/lib/sgb-api/client";
import { encryptSgbPassword } from "@/lib/sgb-api/crypto";
import { buildSgbDeviceBodyFields, buildSgbDeviceHeaders } from "@/lib/sgb-api/device";
import { getOrCreateSgbDeviceUuid } from "@/lib/sgb-session";

// Real identity/tax numbers must come from getcustomerfullinfo, which is not
// mapped yet (and SGB refuses it for customers with unfinished registration).
// Until then the password is still verified for real, but no value is revealed —
// the previous hardcoded numbers were fake and must never be shown to a customer.
const SENSITIVE_PROFILE_FIELDS = ["identityNumber", "taxNumber"] as const;

type SensitiveProfileField = (typeof SENSITIVE_PROFILE_FIELDS)[number];

type RevealSensitiveProfileResult =
  | {
      status:
        | "invalid_request"
        | "unauthorized"
        | "invalid_password"
        | "unavailable";
    }
  | {
      status: "success";
      data: { field: SensitiveProfileField; value: string };
    };

async function verifyPasswordAgainstSgb(email: string, password: string) {
  const deviceUuid = await getOrCreateSgbDeviceUuid();
  const deviceHeaders = buildSgbDeviceHeaders(deviceUuid);
  const deviceBodyFields = buildSgbDeviceBodyFields(deviceUuid);

  try {
    // Reuses the already-allowlisted login endpoint purely to check the
    // password against the currently logged-in account's own email — no
    // dedicated "verify password" endpoint exists (see
    // prompt_integrasi_api_client_area-new.md, Fase Profil). The resulting
    // token is discarded; it never replaces the active session.
    await callSgbApi<{ token?: string }>({
      method: "POST",
      host: "sso",
      path: "/sso/login/v1",
      flavor: SGB_FLAVOR,
      mode: "normal",
      deviceHeaders,
      jsonBody: {
        email,
        password: encryptSgbPassword(password),
        token_captcha: "",
        ...deviceBodyFields,
      },
    });
    return true;
  } catch {
    return false;
  }
}

export async function revealClientAreaSensitiveProfile(
  field: string,
  password: string,
): Promise<RevealSensitiveProfileResult> {
  if (!(SENSITIVE_PROFILE_FIELDS as readonly string[]).includes(field)) {
    return { status: "invalid_request" };
  }

  const profile = await getClientAreaSessionProfile();

  if (!profile) {
    return { status: "unauthorized" };
  }

  if (
    !password ||
    password.length > 128 ||
    !(await verifyPasswordAgainstSgb(profile.email, password))
  ) {
    return { status: "invalid_password" };
  }

  return { status: "unavailable" };
}
