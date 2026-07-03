"use server";

import { setCookieConsent } from "@/lib/cookie-consent";

export async function acceptCookieConsent() {
  await setCookieConsent("accepted");
}

export async function dismissCookieConsent() {
  await setCookieConsent("dismissed");
}
