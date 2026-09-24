"use server";

import {
  getClientAreaSessionProfile,
  isValidClientAreaCredentials,
} from "@/lib/client-area-auth";

const SENSITIVE_PROFILE_DATA = {
  identityNumber: "3578 0417 8604 0003",
  taxNumber: "09.254.178.6-054.000",
} as const;

export async function revealClientAreaSensitiveProfile(
  field: string,
  password: string,
) {
  if (!(field in SENSITIVE_PROFILE_DATA)) {
    return { status: "invalid_request" } as const;
  }

  const profile = await getClientAreaSessionProfile();

  if (!profile) {
    return { status: "unauthorized" } as const;
  }

  if (
    !password ||
    password.length > 128 ||
    !isValidClientAreaCredentials(profile.accountId, password)
  ) {
    return { status: "invalid_password" } as const;
  }

  return {
    status: "success",
    data: {
      field: field as keyof typeof SENSITIVE_PROFILE_DATA,
      value: SENSITIVE_PROFILE_DATA[field as keyof typeof SENSITIVE_PROFILE_DATA],
    },
  } as const;
}
