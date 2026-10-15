"use client";

import { getClientAreaLoginHref } from "@/lib/client-area-session";
import { isSupportedLocale, type AppLocale } from "@/locales";

export class ClientAreaSessionExpiredError extends Error {
  constructor() {
    super("Client Area session expired");
    this.name = "ClientAreaSessionExpiredError";
  }
}

function currentLocale(): AppLocale {
  const segment = window.location.pathname.split("/")[1];
  return isSupportedLocale(segment) ? segment : "id";
}

export function redirectToExpiredSessionLogin() {
  const loginUrl = new URL(
    getClientAreaLoginHref(currentLocale()),
    window.location.origin,
  );
  loginUrl.searchParams.set("reason", "expired");
  window.location.replace(loginUrl.toString());
}

/** Shared browser fetch: every authenticated BFF 401 follows one redirect path. */
export async function clientAreaFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const response = await fetch(input, { ...init, cache: "no-store" });

  if (response.status === 401) {
    redirectToExpiredSessionLogin();
    throw new ClientAreaSessionExpiredError();
  }

  return response;
}
