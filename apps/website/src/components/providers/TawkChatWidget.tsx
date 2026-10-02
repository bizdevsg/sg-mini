"use client";

import { useEffect, useState } from "react";

import { WhatsAppWidget } from "@/components/molecules/WhatsAppWidget";
import {
  TAWK_CHAT_ENABLE_EVENT,
  TAWK_CHAT_WIDGET_ATTRIBUTES,
  TAWK_CHAT_WIDGET_URL,
} from "@/lib/tawk";
import type { AppLocale } from "@/locales";

declare global {
  interface Window {
    __sgbTawkBooted?: boolean;
  }
}

type TawkChatWidgetProps = {
  canEnable: boolean;
  enabledInitially: boolean;
  locale: AppLocale;
};

const TAWK_SCRIPT_ID = "tawk-chat-script";
const TAWK_WIDGET_HOST_ID = "solidchat-widget-host";
const TAWK_WIDGET_IFRAME_SELECTOR =
  'iframe[src*="localhost:3001"], iframe[src*="solidchat"]';

function removeTawkWidget() {
  document.getElementById(TAWK_SCRIPT_ID)?.remove();
  document.getElementById(TAWK_WIDGET_HOST_ID)?.remove();

  document.querySelectorAll(TAWK_WIDGET_IFRAME_SELECTOR).forEach((node) => {
    node.remove();
  });

  window.__sgbTawkBooted = false;
}

export function TawkChatWidget({
  canEnable,
  enabledInitially,
  locale,
}: TawkChatWidgetProps) {
  const [isEnabled, setIsEnabled] = useState(enabledInitially);
  // The chat script could not be loaded (server down, blocked, ...).
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    if (!canEnable) {
      setIsEnabled(false);
      return;
    }

    if (enabledInitially) {
      setIsEnabled(true);
      return;
    }

    function handleEnable() {
      if (canEnable) {
        setIsEnabled(true);
      }
    }

    window.addEventListener(TAWK_CHAT_ENABLE_EVENT, handleEnable);

    return () => {
      window.removeEventListener(TAWK_CHAT_ENABLE_EVENT, handleEnable);
    };
  }, [canEnable, enabledInitially]);

  useEffect(() => {
    if (!canEnable || !isEnabled) {
      removeTawkWidget();
      return;
    }

    if (window.__sgbTawkBooted) {
      return;
    }

    const existingScript = document.getElementById(TAWK_SCRIPT_ID);
    if (existingScript) {
      window.__sgbTawkBooted = true;
      return;
    }

    const script = document.createElement("script");
    script.id = TAWK_SCRIPT_ID;
    script.async = true;
    script.src = TAWK_CHAT_WIDGET_URL;
    Object.entries(TAWK_CHAT_WIDGET_ATTRIBUTES).forEach(([name, value]) => {
      script.setAttribute(name, value);
    });

    const handleLoad = () => {
      window.__sgbTawkBooted = true;
      setLoadFailed(false);
    };
    const handleError = () => {
      window.__sgbTawkBooted = false;
      script.remove();
      setLoadFailed(true);
    };
    script.addEventListener("load", handleLoad);
    script.addEventListener("error", handleError);

    document.head.appendChild(script);

    return () => {
      script.removeEventListener("load", handleLoad);
      script.removeEventListener("error", handleError);
      removeTawkWidget();
    };
  }, [canEnable, isEnabled]);

  // Live chat is "dead" when it is switched off or its script failed to load.
  // (While it merely waits for cookie consent it is not dead — no fallback yet.)
  if (canEnable && !loadFailed) {
    return null;
  }

  return <WhatsAppWidget locale={locale} />;
}
