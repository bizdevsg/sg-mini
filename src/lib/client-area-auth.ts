import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { CLIENT_AREA_SESSION_SECRET } from "@/lib/env";
import type { AppLocale } from "@/locales";
import {
  CLIENT_AREA_INACTIVITY_TIMEOUT_SECONDS,
  CLIENT_AREA_LAST_ACTIVITY_COOKIE,
  CLIENT_AREA_REMEMBER_ME_MAX_AGE,
  CLIENT_AREA_SESSION_COOKIE,
  getClientAreaDashboardHref,
  getClientAreaLoginHref,
  isClientAreaLastActivityActive,
  normalizeClientAreaIdentifier,
} from "@/lib/client-area-session";
export {
  getClientAreaDashboardHref,
  getClientAreaLoginHref,
} from "@/lib/client-area-session";

const CLIENT_AREA_ALLOWED_IDENTIFIERS = new Set([
  "bbh10158",
  "user.sgb@demo-trading.com",
]);
const CLIENT_AREA_DEMO_PASSWORD = "demo12345";
const CLIENT_AREA_SESSION_MAX_AGE_MS =
  CLIENT_AREA_REMEMBER_ME_MAX_AGE * 1000;

export type ClientAreaSessionProfile = {
  accountId: string;
  displayName: string;
  email: string;
};

export type ClientAreaSessionState = {
  isAuthenticated: boolean;
  profile: ClientAreaSessionProfile | null;
};

export function isValidClientAreaCredentials(account: string, password: string) {
  return (
    CLIENT_AREA_ALLOWED_IDENTIFIERS.has(
      normalizeClientAreaIdentifier(account),
    ) &&
    password === CLIENT_AREA_DEMO_PASSWORD
  );
}

function signClientAreaSessionPayload(payload: string) {
  return createHmac("sha256", CLIENT_AREA_SESSION_SECRET)
    .update(payload)
    .digest("hex");
}

// Signs `${identifier}.${issuedAt}` so the session cookie can't be forged
// without CLIENT_AREA_SESSION_SECRET, unlike the old fixed-string cookie.
function createClientAreaSessionToken(identifier: string) {
  const payload = Buffer.from(
    JSON.stringify({ id: identifier, iat: Date.now() }),
    "utf8",
  ).toString("base64url");

  return `${payload}.${signClientAreaSessionPayload(payload)}`;
}

function verifyClientAreaSessionToken(token: string | undefined) {
  if (!token || !CLIENT_AREA_SESSION_SECRET) {
    return null;
  }

  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    return null;
  }

  const expectedSignatureBuffer = Buffer.from(
    signClientAreaSessionPayload(payload),
    "hex",
  );
  const signatureBuffer = Buffer.from(signature, "hex");

  if (
    signatureBuffer.length !== expectedSignatureBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedSignatureBuffer)
  ) {
    return null;
  }

  try {
    const decoded = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as { id?: unknown; iat?: unknown };

    if (
      typeof decoded.id !== "string" ||
      typeof decoded.iat !== "number" ||
      Date.now() - decoded.iat > CLIENT_AREA_SESSION_MAX_AGE_MS
    ) {
      return null;
    }

    const normalizedIdentifier = normalizeClientAreaIdentifier(decoded.id);

    if (!CLIENT_AREA_ALLOWED_IDENTIFIERS.has(normalizedIdentifier)) {
      return null;
    }

    return normalizedIdentifier;
  } catch {
    return null;
  }
}

function resolveClientAreaSessionProfile(
  identifier: string,
): ClientAreaSessionProfile {
  const normalizedIdentifier = normalizeClientAreaIdentifier(identifier);

  if (normalizedIdentifier === "user.sgb@demo-trading.com") {
    return {
      accountId: "BBH10158",
      displayName: "Demo User",
      email: "user.sgb@demo-trading.com",
    };
  }

  return {
    accountId: "BBH10158",
    displayName: "Demo User",
    email: "user.sgb@demo-trading.com",
  };
}

export async function hasClientAreaSession() {
  return (await getClientAreaSessionState()).isAuthenticated;
}

export async function getClientAreaSessionProfile() {
  return (await getClientAreaSessionState()).profile;
}

export async function getClientAreaSessionState(): Promise<ClientAreaSessionState> {
  const cookieStore = await cookies();
  const identifier = verifyClientAreaSessionToken(
    cookieStore.get(CLIENT_AREA_SESSION_COOKIE)?.value,
  );

  if (
    !identifier ||
    !isClientAreaLastActivityActive(
      cookieStore.get(CLIENT_AREA_LAST_ACTIVITY_COOKIE)?.value,
    )
  ) {
    return {
      isAuthenticated: false,
      profile: null,
    };
  }

  return {
    isAuthenticated: true,
    profile: resolveClientAreaSessionProfile(identifier),
  };
}

export async function createClientAreaSession(
  account: string,
  rememberMe: boolean,
) {
  const cookieStore = await cookies();
  const normalizedAccount = normalizeClientAreaIdentifier(account);
  const now = Date.now().toString();
  const cookieOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    ...(rememberMe ? { maxAge: CLIENT_AREA_REMEMBER_ME_MAX_AGE } : {}),
  };

  cookieStore.set({
    name: CLIENT_AREA_SESSION_COOKIE,
    value: createClientAreaSessionToken(normalizedAccount),
    ...cookieOptions,
  });
  cookieStore.set({
    name: CLIENT_AREA_LAST_ACTIVITY_COOKIE,
    value: now,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: CLIENT_AREA_INACTIVITY_TIMEOUT_SECONDS,
  });
}

export async function clearClientAreaSession() {
  const cookieStore = await cookies();
  cookieStore.delete(CLIENT_AREA_SESSION_COOKIE);
  cookieStore.delete(CLIENT_AREA_LAST_ACTIVITY_COOKIE);
}

export async function requireClientAreaSession(locale: AppLocale) {
  if (!(await hasClientAreaSession())) {
    redirect(getClientAreaLoginHref(locale));
  }
}

export async function redirectAuthenticatedClientAreaUser(locale: AppLocale) {
  if (await hasClientAreaSession()) {
    redirect(getClientAreaDashboardHref(locale));
  }
}
