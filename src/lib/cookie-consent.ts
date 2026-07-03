import { cookies } from "next/headers";

export const COOKIE_CONSENT_COOKIE = "sgb_cookie_consent";
const COOKIE_CONSENT_MAX_AGE = 60 * 60 * 24 * 180;

const COOKIE_CONSENT_VALUES = ["accepted", "dismissed"] as const;

export type CookieConsentValue = (typeof COOKIE_CONSENT_VALUES)[number];

function isCookieConsentValue(value: string): value is CookieConsentValue {
  return COOKIE_CONSENT_VALUES.includes(value as CookieConsentValue);
}

export async function getCookieConsentValue() {
  const cookieStore = await cookies();
  const value = cookieStore.get(COOKIE_CONSENT_COOKIE)?.value;

  return value && isCookieConsentValue(value) ? value : null;
}

export async function hasCookieConsentPreference() {
  return (await getCookieConsentValue()) !== null;
}

export async function setCookieConsent(value: CookieConsentValue) {
  const cookieStore = await cookies();

  cookieStore.set({
    name: COOKIE_CONSENT_COOKIE,
    value,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_CONSENT_MAX_AGE,
  });
}
