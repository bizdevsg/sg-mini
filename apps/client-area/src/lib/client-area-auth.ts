import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { AppLocale } from "@/locales";
import {
  CLIENT_AREA_IDENTIFIER_COOKIE,
  CLIENT_AREA_INACTIVITY_TIMEOUT_SECONDS,
  CLIENT_AREA_LAST_ACTIVITY_COOKIE,
  CLIENT_AREA_OTP_SESSION_COOKIE,
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
  shouldUseSecureClientAreaCookie,
  type SgbClientAreaSessionPayload,
} from "@/lib/sgb-session";
import type { ClientAreaAccountIds } from "@/lib/client-area-profile.shared";
import {
  CLIENT_AREA_ACCOUNT_MODE_COOKIE,
  resolveAvailableClientAreaAccountMode,
} from "@/lib/client-area-account-mode";
import {
  accountIdsByMode,
  primaryAccountId,
} from "@/types/account-summary";

export {
  getClientAreaDashboardHref,
  getClientAreaLoginHref,
} from "@/lib/client-area-session";

export type ClientAreaSessionProfile = {
  accountId: string;
  accountIds: ClientAreaAccountIds;
  avatarSrc: string;
  displayName: string;
  email: string;
};

export type ClientAreaSessionState = {
  isAuthenticated: boolean;
  profile: ClientAreaSessionProfile | null;
};

export type MiniMicroSession = {
  token: string;
  account: string;
  isDemo: boolean;
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
  const accountIds = accountIdsByMode(session.accounts);
  const primaryAccount = primaryAccountId(session.accounts);

  return {
    // First account in list-account (shape verified against a UAT sample). The
    // person has one number here — it is not split per Demo/Real. "—" when the
    // list is missing, per the rule for fields we can't map.
    accountId: primaryAccount ?? "—",
    accountIds,
    avatarSrc: "/assets/client-area-profile-avatar.png",
    // The real name only arrives with getcustomerfullinfo; until then show the
    // account number rather than a name guessed from the email.
    displayName: primaryAccount ?? deriveDisplayNameFromEmail(session.email),
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
  const accountIds = accountIdsByMode(payload.accounts);
  const isDemo = !accountIds.real && Boolean(accountIds.demo);
  const account = (isDemo ? accountIds.demo : accountIds.real) ?? "";

  await startSession(payload.token, account, isDemo, {
    email: payload.email,
    accounts: payload.accounts,
    rememberMe,
  });
}

type StartSessionMetadata = {
  email?: string;
  accounts?: unknown;
  rememberMe?: boolean;
};

/** Starts the encrypted, httpOnly MiniMicro session. */
export async function startSession(
  token: string,
  account: string,
  isDemo: boolean,
  metadata: StartSessionMetadata = {},
) {
  const cookieStore = await cookies();
  const secure = await shouldUseSecureClientAreaCookie();
  const encryptedSession = await encryptSgbSession({
    token,
    account,
    isDemo,
    email: metadata.email ?? "",
    accounts:
      metadata.accounts ?? (account ? [{ account, type: isDemo ? "demo" : "real" }] : null),
    issuedAtMs: Date.now(),
    rememberMe: metadata.rememberMe,
  });
  const now = Date.now().toString();
  const cookieOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure,
    path: "/",
    ...(metadata.rememberMe ? { maxAge: CLIENT_AREA_REMEMBER_ME_MAX_AGE } : {}),
  };

  cookieStore.set({
    name: CLIENT_AREA_SESSION_COOKIE,
    value: encryptedSession,
    ...cookieOptions,
  });
  cookieStore.set({
    name: CLIENT_AREA_IDENTIFIER_COOKIE,
    value: normalizeClientAreaIdentifier(metadata.email ?? ""),
    ...cookieOptions,
  });
  cookieStore.set({
    name: CLIENT_AREA_LAST_ACTIVITY_COOKIE,
    value: now,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: CLIENT_AREA_INACTIVITY_TIMEOUT_SECONDS,
  });
}

/** Returns only the MiniMicro fields needed by authenticated server calls. */
export async function getSession(): Promise<MiniMicroSession | null> {
  const cookieStore = await cookies();
  const session = await getActiveSgbSession();

  if (!session) {
    return null;
  }

  const accounts = accountIdsByMode(session.accounts);
  const savedMode = resolveAvailableClientAreaAccountMode(
    cookieStore.get(CLIENT_AREA_ACCOUNT_MODE_COOKIE)?.value ??
      (session.isDemo ? "demo" : "real"),
    accounts,
  );
  const hasMappedAccounts = Boolean(accounts.demo || accounts.real);
  const account = hasMappedAccounts
    ? (savedMode === "demo" ? accounts.demo : accounts.real) ?? ""
    : session.account ?? "";
  const isDemo = hasMappedAccounts ? savedMode === "demo" : session.isDemo === true;

  return { token: session.token, account, isDemo };
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
  const secure = await shouldUseSecureClientAreaCookie();
  const encryptedSession = await encryptSgbSession({
    ...session,
    token: newToken,
  });

  cookieStore.set({
    name: CLIENT_AREA_SESSION_COOKIE,
    value: encryptedSession,
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    ...(session.rememberMe ? { maxAge: CLIENT_AREA_REMEMBER_ME_MAX_AGE } : {}),
  });
}

/** Replaces the bearer token while preserving all other encrypted session data. */
export async function rotateToken(token: string) {
  const session = await getActiveSgbSession();

  if (session) {
    await refreshClientAreaSessionToken(session, token);
  }
}

export async function clearClientAreaSession() {
  const cookieStore = await cookies();
  cookieStore.delete(CLIENT_AREA_SESSION_COOKIE);
  cookieStore.delete(CLIENT_AREA_IDENTIFIER_COOKIE);
  cookieStore.delete(CLIENT_AREA_LAST_ACTIVITY_COOKIE);
  cookieStore.delete(CLIENT_AREA_OTP_SESSION_COOKIE);
}

/** Ends the local MiniMicro session. */
export async function endSession() {
  await clearClientAreaSession();
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
