"use client";

import { createClientAreaRequestQueue } from "@/lib/client-area-request-queue";
import { getClientAreaLoginHref } from "@/lib/client-area-session";
import { isSupportedLocale, type AppLocale } from "@/locales";

const enqueueClientAreaRequest = createClientAreaRequestQueue();
let isRedirectingToLogin = false;

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
  return enqueueClientAreaRequest(async () => {
    if (isRedirectingToLogin) {
      throw new ClientAreaSessionExpiredError();
    }

    const response = await fetch(input, { ...init, cache: "no-store" });

    if (response.status === 401) {
      isRedirectingToLogin = true;
      redirectToExpiredSessionLogin();
      throw new ClientAreaSessionExpiredError();
    }

    return response;
  });
}
