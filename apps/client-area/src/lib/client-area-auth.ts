import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { AppLocale } from "@/locales";
import {
  CLIENT_AREA_IDENTIFIER_COOKIE,
  CLIENT_AREA_INACTIVITY_TIMEOUT_SECONDS,
  CLIENT_AREA_LAST_ACTIVITY_COOKIE,
  CLIENT_AREA_REMEMBER_ME_MAX_AGE,
  CLIENT_AREA_SESSION_COOKIE,
  getClientAreaDashboardHref,
  getClientAreaLoginHref,
  isClientAreaLastActivityActive,
  normalizeClientAreaIdentifier,
} from "@/lib/client-area-session";
import {
  decryptSgbSession,
  encryptSgbSession,
  type SgbClientAreaSessionPayload,
} from "@/lib/sgb-session";
import { primaryAccountId } from "@/types/account-summary";
export {
  getClientAreaDashboardHref,
  getClientAreaLoginHref,
} from "@/lib/client-area-session";

export type ClientAreaSessionProfile = {
  accountId: string;
  avatarSrc: string;
  displayName: string;
  email: string;
};

export type ClientAreaSessionState = {
  isAuthenticated: boolean;
  profile: ClientAreaSessionProfile | null;
};

/**
 * Best-effort display name until the real profile (getcustomerfullinfo) is
 * wired in — "budi.santoso" → "Budi Santoso". Never fabricates data beyond
 * what's derivable from the email itself.
 */
function deriveDisplayNameFromEmail(email: string): string {
  const localPart = email.split("@")[0] ?? email;
  const words = localPart.split(/[._-]+/).filter(Boolean);

  if (words.length === 0) {
    return email;
  }

  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function buildProfileFromSession(
  session: SgbClientAreaSessionPayload,
): ClientAreaSessionProfile {
  return {
    // First account in list-account (shape verified against a UAT sample). The
    // person has one number here — it is not split per Demo/Real. "—" when the
    // list is missing, per the rule for fields we can't map.
    accountId: primaryAccountId(session.accounts) ?? "—",
    avatarSrc: "/assets/client-area-profile-avatar.png",
    displayName: deriveDisplayNameFromEmail(session.email),
    email: session.email,
  };
}

async function readSgbSessionCookie(): Promise<SgbClientAreaSessionPayload | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(CLIENT_AREA_SESSION_COOKIE)?.value;

  if (!raw) {
    return null;
  }

  return decryptSgbSession(raw);
}

export async function hasClientAreaSession() {
  const cookieStore = await cookies();
  const session = await readSgbSessionCookie();

  if (!session) {
    return false;
  }

  return isClientAreaLastActivityActive(
    cookieStore.get(CLIENT_AREA_LAST_ACTIVITY_COOKIE)?.value,
  );
}

export async function getClientAreaSessionProfile() {
  return (await getClientAreaSessionState()).profile;
}

export async function getClientAreaSessionState(): Promise<ClientAreaSessionState> {
  const cookieStore = await cookies();
  const session = await readSgbSessionCookie();

  if (
    !session ||
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
    profile: buildProfileFromSession(session),
  };
}

export async function createClientAreaSession(
  payload: Omit<SgbClientAreaSessionPayload, "issuedAtMs">,
  rememberMe: boolean,
) {
  const cookieStore = await cookies();
  const encryptedSession = await encryptSgbSession({
    ...payload,
    issuedAtMs: Date.now(),
    rememberMe,
  });
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
    value: encryptedSession,
    ...cookieOptions,
  });
  cookieStore.set({
    name: CLIENT_AREA_IDENTIFIER_COOKIE,
    value: normalizeClientAreaIdentifier(payload.email),
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

/**
 * The decrypted SGB session (bearer token included) if it exists and is still
 * within the inactivity window — server-side only, never send it to the browser.
 */
export async function getActiveSgbSession(): Promise<SgbClientAreaSessionPayload | null> {
  const cookieStore = await cookies();
  const session = await readSgbSessionCookie();

  if (
    !session ||
    !isClientAreaLastActivityActive(
      cookieStore.get(CLIENT_AREA_LAST_ACTIVITY_COOKIE)?.value,
    )
  ) {
    return null;
  }

  return session;
}

/**
 * Persists a token the server rotated via the `csrf` response header. Keeps the
 * same cookie lifetime the customer chose at login ("remember me").
 */
export async function refreshClientAreaSessionToken(
  session: SgbClientAreaSessionPayload,
  newToken: string,
) {
  if (!newToken || newToken === session.token) {
    return;
  }

  const cookieStore = await cookies();
  const encryptedSession = await encryptSgbSession({
    ...session,
    token: newToken,
  });

  cookieStore.set({
    name: CLIENT_AREA_SESSION_COOKIE,
    value: encryptedSession,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    ...(session.rememberMe ? { maxAge: CLIENT_AREA_REMEMBER_ME_MAX_AGE } : {}),
  });
}

export async function clearClientAreaSession() {
  const cookieStore = await cookies();
  cookieStore.delete(CLIENT_AREA_SESSION_COOKIE);
  cookieStore.delete(CLIENT_AREA_IDENTIFIER_COOKIE);
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
