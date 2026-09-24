"use client";

import { useEffect, useState } from "react";

import {
  TAWK_CHAT_ENABLE_EVENT,
  TAWK_CHAT_WIDGET_ATTRIBUTES,
  TAWK_CHAT_WIDGET_URL,
} from "@/lib/tawk";

declare global {
  interface Window {
    __sgbTawkBooted?: boolean;
  }
}

type TawkChatWidgetProps = {
  canEnable: boolean;
  enabledInitially: boolean;
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
}: TawkChatWidgetProps) {
  const [isEnabled, setIsEnabled] = useState(enabledInitially);

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
    };
    const handleError = () => {
      window.__sgbTawkBooted = false;
      script.remove();
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

  return null;
}
