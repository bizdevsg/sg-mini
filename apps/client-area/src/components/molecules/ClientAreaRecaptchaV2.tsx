"use client";

import Script from "next/script";
import { useCallback, useRef } from "react";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      render: (
        container: HTMLElement,
        parameters: { sitekey: string; theme?: "light" | "dark" },
      ) => number;
    };
  }
}

type ClientAreaRecaptchaV2Props = {
  siteKey: string;
};

/**
 * reCAPTCHA v2 checkbox. Rendered INSIDE the login <form>: Google adds a
 * `g-recaptcha-response` field next to the widget, so the token travels with the
 * form data to the server action, which forwards it to SGB as `token_captcha`.
 * A token works once — the parent remounts this component (new `key`) after each
 * attempt to get a fresh widget.
 */
export function ClientAreaRecaptchaV2({ siteKey }: ClientAreaRecaptchaV2Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Runs on every mount (Script `onReady`), also when api.js is already loaded.
  const renderWidget = useCallback(() => {
    const container = containerRef.current;
    const recaptcha = window.grecaptcha;

    if (!container || !recaptcha) {
      return;
    }

    recaptcha.ready(() => {
      // Guard against a second render into the same container (React strict mode).
      if (container.childElementCount === 0) {
        recaptcha.render(container, { sitekey: siteKey, theme: "dark" });
      }
    });
  }, [siteKey]);

  return (
    <>
      <Script
        src="https://www.google.com/recaptcha/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={renderWidget}
      />
      <div ref={containerRef} className="min-h-[4.875rem]" />
    </>
  );
}
