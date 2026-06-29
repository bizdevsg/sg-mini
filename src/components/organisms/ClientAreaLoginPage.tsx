"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useActionState, useEffect, useState } from "react";

import {
  submitClientAreaLogin,
  type ClientAreaLoginState,
} from "@/app/actions/clientAreaLogin";
import { PUBLIC_RECAPTCHA_SITE_KEY } from "@/lib/env";
import { getMessages, type AppLocale } from "@/locales";
import { resolveLocalizedHref } from "@/components/organisms/client-area.shared";

declare global {
  interface Window {
    grecaptcha?: {
      reset: () => void;
    };
  }
}

type ClientAreaLoginPageProps = {
  isRecaptchaEnabled: boolean;
  locale: AppLocale;
};

const INITIAL_STATE: ClientAreaLoginState = {
  status: "idle",
  message: "",
};

export function ClientAreaLoginPage({
  isRecaptchaEnabled,
  locale,
}: ClientAreaLoginPageProps) {
  const { clientArea } = getMessages(locale);
  const login = clientArea.login;
  const supportHref = resolveLocalizedHref(locale, "/contact-us");
  const [state, formAction, pending] = useActionState(
    submitClientAreaLogin,
    INITIAL_STATE,
  );
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isRecaptchaEnabled || state.status !== "error") {
      return;
    }
    window.grecaptcha?.reset();
  }, [isRecaptchaEnabled, state.status]);

  return (
    <>
      {isRecaptchaEnabled ? (
        <Script
          src="https://www.google.com/recaptcha/api.js"
          strategy="afterInteractive"
        />
      ) : null}

      {/* ── Full-bleed wrapper that escapes the SectionContainer ── */}
      <div className="clogin-root">

        {/* ════════ LEFT – MARKETING VISUAL ════════ */}
        <div className="clogin-left" aria-hidden="true">
          {/* App store buttons */}
          <div className="clogin-appstore-group">
            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
              className="clogin-appstore-btn"
              aria-label="Get it on Google Play"
            >
              <svg className="clogin-appstore-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.18 23.76a2 2 0 0 1-.93-.23 2.07 2.07 0 0 1-1.05-1.82V2.29a2.07 2.07 0 0 1 1.05-1.82 2 2 0 0 1 2.06.1l17.25 9.72a2.07 2.07 0 0 1 0 3.62L4.31 23.63a2 2 0 0 1-1.13.13z" />
              </svg>
              <div className="clogin-appstore-text">
                <span className="clogin-appstore-sub">GET IT ON</span>
                <span className="clogin-appstore-name">Google Play</span>
              </div>
            </a>
            <a
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              className="clogin-appstore-btn"
              aria-label="Download on the App Store"
            >
              <svg className="clogin-appstore-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div className="clogin-appstore-text">
                <span className="clogin-appstore-sub">Download on the</span>
                <span className="clogin-appstore-name">App Store</span>
              </div>
            </a>
          </div>

          {/* Marketing image */}
          <div className="clogin-visual">
            <Image
              src="/assets/BANNER-UTAMA-SOLID.png"
              alt="SG Berjangka Client Area"
              fill
              className="clogin-visual-img"
              priority
            />
            {/* Fade to right so form blends */}
            <div className="clogin-visual-fade" />
          </div>
        </div>

        {/* ════════ RIGHT – FORM CARD ════════ */}
        <div className="clogin-right">
          <div className="clogin-form-card">
            <h1 className="clogin-title">Client Area</h1>

            <form action={formAction} className="clogin-form">
              <input type="hidden" name="locale" value={locale} />

              {/* Account / Email */}
              <div className="clogin-field">
                <input
                  id="client-area-account"
                  name="account"
                  type="text"
                  required
                  disabled={pending}
                  placeholder={login.accountPlaceholder}
                  className="clogin-input"
                />
              </div>

              {/* Password */}
              <div className="clogin-field clogin-field--password">
                <input
                  id="client-area-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={pending}
                  placeholder={login.passwordPlaceholder}
                  className="clogin-input"
                />
                <button
                  type="button"
                  className="clogin-eye-btn"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  <FontAwesomeIcon icon={["fas", showPassword ? "eye-slash" : "eye"]} />
                </button>
              </div>

              {/* Remember + forgot */}
              <div className="clogin-row">
                <label className="clogin-remember">
                  <input
                    name="rememberMe"
                    type="checkbox"
                    disabled={pending}
                    className="clogin-checkbox"
                  />
                  <span>{login.rememberMe}</span>
                </label>
                <Link href={supportHref} className="clogin-forgot">
                  {login.forgotPassword}
                </Link>
              </div>

              {/* reCAPTCHA */}
              {isRecaptchaEnabled ? (
                <div className="clogin-captcha">
                  <div className="overflow-x-auto">
                    <div
                      className="g-recaptcha min-w-[304px]"
                      data-sitekey={PUBLIC_RECAPTCHA_SITE_KEY}
                      data-theme="dark"
                    />
                  </div>
                </div>
              ) : null}

              {/* Error */}
              {state.status === "error" ? (
                <p className="clogin-error" aria-live="polite">
                  <FontAwesomeIcon icon={["fas", "circle-exclamation"]} />
                  {state.message}
                </p>
              ) : null}

              {/* Primary CTA – LOGIN */}
              <button
                type="submit"
                disabled={pending}
                className="clogin-btn-login"
              >
                {pending ? (
                  <>
                    <span className="clogin-spinner" />
                    {login.submitting}
                  </>
                ) : (
                  "LOGIN"
                )}
              </button>

              {/* Secondary CTA – REGISTRASI */}
              <Link href={supportHref} className="clogin-btn-register">
                REGISTRASI
              </Link>
            </form>
          </div>
        </div>

      </div>

      <style>{`
        /* ─── ROOT ───────────────────────────────────
           Negative horizontal margins to escape
           SectionContainer's px-4/px-6/px-10 padding
           while keeping vertical centering.
        ─────────────────────────────────────────────── */
        .clogin-root {
          display: flex;
          align-items: stretch;
          min-height: 520px;
          /* escape container horizontal padding at each breakpoint */
          margin-left: -1rem;
          margin-right: -1rem;
          border-radius: 1.5rem;
          overflow: hidden;
          background: #060606;
          box-shadow:
            0 0 0 1px rgba(245,158,11,0.10),
            0 32px 80px rgba(0,0,0,0.7),
            0 0 100px rgba(245,158,11,0.06);
        }
        @media (min-width: 640px) {
          .clogin-root {
            margin-left: -1.5rem;
            margin-right: -1.5rem;
          }
        }
        @media (min-width: 1024px) {
          .clogin-root {
            margin-left: -2.5rem;
            margin-right: -2.5rem;
            min-height: 580px;
          }
        }

        /* ─── LEFT – VISUAL ──────────────────────── */
        .clogin-left {
          position: relative;
          flex: 1.45;
          display: none; /* hidden on mobile */
          overflow: hidden;
          /* Pure black is critical for mix-blend-mode: multiply to work */
          background: #000000;
        }
        @media (min-width: 768px) {
          .clogin-left {
            display: block;
          }
        }

        /* app store buttons */
        .clogin-appstore-group {
          position: absolute;
          top: 1.75rem;
          left: 2rem;
          z-index: 10;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .clogin-appstore-btn {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.5rem 0.9rem;
          border-radius: 0.6rem;
          border: 1px solid rgba(255,255,255,0.18);
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(8px);
          color: #fff;
          text-decoration: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .clogin-appstore-btn:hover {
          border-color: rgba(245,158,11,0.45);
          background: rgba(0,0,0,0.75);
        }
        .clogin-appstore-icon {
          width: 1.4rem;
          height: 1.4rem;
          flex-shrink: 0;
        }
        .clogin-appstore-text {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }
        .clogin-appstore-sub {
          font-size: 0.58rem;
          letter-spacing: 0.06em;
          color: #d4d4d8;
        }
        .clogin-appstore-name {
          font-size: 0.82rem;
          font-weight: 700;
          color: #fff;
        }

        /* visual image */
        .clogin-visual {
          position: absolute;
          inset: 0;
          /* isolate needed so multiply blends against the black parent */
          isolation: isolate;
        }
        .clogin-visual-img {
          object-fit: cover;
          object-position: center center;
          /* multiply: white (#fff) × black (#000) = black → white bg disappears */
          mix-blend-mode: multiply;
        }
        /* subtle right-edge fade so card border reads cleanly */
        .clogin-visual-fade {
          position: absolute;
          top: 0;
          right: 0;
          width: 20%;
          height: 100%;
          background: linear-gradient(to right, transparent 0%, #060606 100%);
          /* run on top, no blend */
          z-index: 2;
          pointer-events: none;
        }

        /* ─── RIGHT – FORM ───────────────────────── */
        .clogin-right {
          flex: 0 0 360px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 1.75rem;
          background: rgba(10,10,12,0.96);
        }
        @media (min-width: 480px) {
          .clogin-right {
            flex: 0 0 400px;
            padding: 2.75rem 2.25rem;
          }
        }
        @media (min-width: 1024px) {
          .clogin-right {
            flex: 0 0 420px;
            padding: 3rem 2.5rem;
          }
        }
        /* On mobile, right panel takes full width */
        @media (max-width: 767px) {
          .clogin-right {
            flex: 1;
          }
        }

        /* ─── FORM CARD ──────────────────────────── */
        .clogin-form-card {
          width: 100%;
          max-width: 360px;
        }

        .clogin-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.02em;
          margin: 0 0 1.75rem 0;
        }

        /* ─── FORM ───────────────────────────────── */
        .clogin-form {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        .clogin-field {
          position: relative;
        }

        .clogin-field--password {
          display: flex;
          align-items: center;
        }

        .clogin-input {
          width: 100%;
          height: 3.125rem;
          padding: 0 1rem;
          border-radius: 0.6rem;
          border: 1px solid rgba(80,80,90,0.55);
          background: rgba(20,20,25,0.7);
          color: #fff;
          font-size: 0.9rem;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          -webkit-appearance: none;
        }
        .clogin-input::placeholder {
          color: #6b7280;
        }
        .clogin-input:focus {
          border-color: rgba(245,158,11,0.55);
          box-shadow: 0 0 0 3px rgba(245,158,11,0.1);
        }
        .clogin-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* password eye toggle */
        .clogin-field--password .clogin-input {
          padding-right: 3rem;
        }
        .clogin-eye-btn {
          position: absolute;
          right: 0.9rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          font-size: 0.9rem;
          padding: 0.25rem;
          transition: color 0.18s;
          line-height: 1;
        }
        .clogin-eye-btn:hover {
          color: #d1d5db;
          transform: translateY(-50%) !important;
        }

        /* row */
        .clogin-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }
        .clogin-remember {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.82rem;
          color: #9ca3af;
          cursor: pointer;
          user-select: none;
        }
        .clogin-checkbox {
          width: 0.9rem;
          height: 0.9rem;
          accent-color: #f59e0b;
          cursor: pointer;
        }
        .clogin-forgot {
          font-size: 0.82rem;
          color: #9ca3af;
          text-decoration: none;
          transition: color 0.18s;
        }
        .clogin-forgot:hover {
          color: #f59e0b;
        }

        /* captcha */
        .clogin-captcha {
          padding: 0.75rem;
          border-radius: 0.6rem;
          border: 1px solid rgba(63,63,70,0.7);
          background: rgba(0,0,0,0.3);
        }

        /* error */
        .clogin-error {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.65rem 0.9rem;
          border-radius: 0.6rem;
          background: rgba(251,191,36,0.07);
          border: 1px solid rgba(251,191,36,0.22);
          color: #fbbf24;
          font-size: 0.8rem;
          font-weight: 500;
          margin: 0;
        }

        /* LOGIN button */
        .clogin-btn-login {
          width: 100%;
          height: 3.125rem;
          border-radius: 0.6rem;
          background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);
          color: #000;
          font-size: 0.92rem;
          font-weight: 900;
          font-family: inherit;
          letter-spacing: 0.12em;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 0.35rem;
          transition: opacity 0.18s, box-shadow 0.2s, transform 0.15s;
          box-shadow: 0 4px 24px rgba(245,158,11,0.4), 0 1px 0 rgba(255,255,255,0.08) inset;
        }
        .clogin-btn-login:hover:not(:disabled) {
          opacity: 0.93;
          box-shadow: 0 6px 32px rgba(245,158,11,0.55);
          transform: translateY(-1px) !important;
        }
        .clogin-btn-login:active:not(:disabled) {
          transform: translateY(0) !important;
          opacity: 1;
        }
        .clogin-btn-login:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        /* REGISTRASI button */
        .clogin-btn-register {
          width: 100%;
          height: 3.125rem;
          border-radius: 0.6rem;
          background: transparent;
          border: 1px solid rgba(245,158,11,0.3);
          color: #f59e0b;
          font-size: 0.92rem;
          font-weight: 900;
          font-family: inherit;
          letter-spacing: 0.12em;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: background 0.18s, border-color 0.18s, box-shadow 0.2s, transform 0.15s;
        }
        .clogin-btn-register:hover {
          background: rgba(245,158,11,0.08);
          border-color: rgba(245,158,11,0.55);
          box-shadow: 0 0 20px rgba(245,158,11,0.15);
          transform: translateY(-1px) !important;
        }
        .clogin-btn-register:active {
          transform: translateY(0) !important;
        }

        /* spinner */
        .clogin-spinner {
          display: inline-block;
          width: 1rem;
          height: 1rem;
          border: 2px solid rgba(0,0,0,0.25);
          border-top-color: #000;
          border-radius: 50%;
          animation: clogin-spin 0.7s linear infinite;
          flex-shrink: 0;
        }
        @keyframes clogin-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
