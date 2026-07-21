"use client";

import { useEffect, useState } from "react";

import { TAWK_CHAT_ENABLE_EVENT, TAWK_CHAT_WIDGET_URL } from "@/lib/tawk";

declare global {
  interface Window {
    __sgbTawkBooted?: boolean;
    Tawk_API?: Record<string, unknown>;
    Tawk_LoadStart?: Date;
  }
}

type TawkChatWidgetProps = {
  enabledInitially: boolean;
};

const TAWK_SCRIPT_ID = "tawk-chat-script";

export function TawkChatWidget({
  enabledInitially,
}: TawkChatWidgetProps) {
  const [isEnabled, setIsEnabled] = useState(enabledInitially);

  useEffect(() => {
    if (enabledInitially) {
      setIsEnabled(true);
      return;
    }

    function handleEnable() {
      setIsEnabled(true);
    }

    window.addEventListener(TAWK_CHAT_ENABLE_EVENT, handleEnable);

    return () => {
      window.removeEventListener(TAWK_CHAT_ENABLE_EVENT, handleEnable);
    };
  }, [enabledInitially]);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    if (window.__sgbTawkBooted || document.getElementById(TAWK_SCRIPT_ID)) {
      window.__sgbTawkBooted = true;
      return;
    }

    try {
      const existingApi = window.Tawk_API as
        | { shutdown?: () => void }
        | undefined;
      existingApi?.shutdown?.();
    } catch {
      // Ignore stale widget shutdown failures and continue with a fresh init.
    }

    delete window.Tawk_API;
    delete window.Tawk_LoadStart;

    window.Tawk_API = {};
    window.Tawk_LoadStart = new Date();

    const script = document.createElement("script");
    script.id = TAWK_SCRIPT_ID;
    script.async = true;
    script.src = TAWK_CHAT_WIDGET_URL;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    script.addEventListener("load", () => {
      window.__sgbTawkBooted = true;
    });
    script.addEventListener("error", () => {
      window.__sgbTawkBooted = false;
    });

    document.head.appendChild(script);
  }, [isEnabled]);

  return null;
}
