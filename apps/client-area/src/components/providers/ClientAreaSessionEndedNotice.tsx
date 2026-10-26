"use client";

import { useEffect, useRef, useState } from "react";
import { MonitorSmartphone } from "lucide-react";

import {
  CLIENT_AREA_LAST_ACTIVITY_STORAGE_KEY,
  getClientAreaLoginHref,
} from "@/lib/client-area-session";
import { CLIENT_AREA_SESSION_ENDED_EVENT } from "@/lib/client-area-session-events";
import { getMessages, type AppLocale } from "@/locales";

type ClientAreaSessionEndedNoticeProps = {
  locale: AppLocale;
};

/**
 * Blocking notice shown when an authenticated request reports the session is
 * gone. Replaces the old silent reload that dropped the customer on the login
 * page with no explanation.
 */
export function ClientAreaSessionEndedNotice({
  locale,
}: ClientAreaSessionEndedNoticeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const actionRef = useRef<HTMLButtonElement>(null);
  const labels = getMessages(locale).clientArea.sessionEndedNotice;

  useEffect(() => {
    const open = () => setIsOpen(true);

    window.addEventListener(CLIENT_AREA_SESSION_ENDED_EVENT, open);

    return () => window.removeEventListener(CLIENT_AREA_SESSION_ENDED_EVENT, open);
  }, []);

  useEffect(() => {
    if (isOpen) {
      actionRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  function signInAgain() {
    try {
      window.localStorage.removeItem(CLIENT_AREA_LAST_ACTIVITY_STORAGE_KEY);
    } catch {
      // Ignore storage cleanup failures in restricted browsers.
    }

    window.location.replace(getClientAreaLoginHref(locale));
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="client-area-session-ended-title"
        aria-describedby="client-area-session-ended-description"
        className="w-full max-w-md space-y-5 rounded-3xl border border-amber-500/30 bg-zinc-900 p-6 text-center shadow-2xl"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
          <MonitorSmartphone className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h3
            id="client-area-session-ended-title"
            className="text-lg font-bold text-zinc-100"
          >
            {labels.title}
          </h3>
          <p
            id="client-area-session-ended-description"
            className="text-sm leading-6 text-zinc-400"
          >
            {labels.description}
          </p>
        </div>

        <button
          ref={actionRef}
          type="button"
          onClick={signInAgain}
          className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-full bg-yellow-500 px-5 text-sm font-semibold text-black transition hover:bg-yellow-400"
        >
          {labels.action}
        </button>
      </div>
    </div>
  );
}
