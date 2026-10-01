"use client";

import { ArrowLeft } from "lucide-react";
import {
  startTransition,
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  submitSendOtp,
  submitVerifyOtp,
  type ClientAreaOtpState,
} from "@/app/actions/clientAreaOtp";
import type { AppLocale, AppMessages } from "@/locales";

type ClientAreaOtpFormPanelProps = {
  locale: AppLocale;
  otp: AppMessages["clientArea"]["otp"];
  loginToken: string;
  email: string;
  rememberMe: boolean;
  onBackToLogin: () => void;
};

const OTP_CODE_LENGTH = 6;

const INITIAL_VERIFY_STATE: ClientAreaOtpState = {
  status: "idle",
  message: "",
};

const INITIAL_RESEND_STATE: ClientAreaOtpState = {
  status: "idle",
  message: "",
};

const RESEND_COOLDOWN_SECONDS = 60;

export function ClientAreaOtpFormPanel({
  locale,
  otp,
  loginToken,
  email,
  rememberMe,
  onBackToLogin,
}: ClientAreaOtpFormPanelProps) {
  const [otpDigits, setOtpDigits] = useState<string[]>(
    Array(OTP_CODE_LENGTH).fill(""),
  );
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const [resendMessage, setResendMessage] = useState("");

  // ── Verify OTP action ───────────────────────────────────────────────

  const verifyAction = useCallback(
    async (prevState: ClientAreaOtpState, formData: FormData) => {
      formData.set("loginToken", loginToken);
      formData.set("email", email);
      formData.set("rememberMe", rememberMe ? "on" : "off");
      return submitVerifyOtp(prevState, formData);
    },
    [loginToken, email, rememberMe],
  );

  const [verifyState, verifyFormAction, verifyPending] = useActionState(
    verifyAction,
    INITIAL_VERIFY_STATE,
  );

  // ── Resend OTP action ──────────────────────────────────────────────

  const resendAction = useCallback(
    async (prevState: ClientAreaOtpState, formData: FormData) => {
      formData.set("loginToken", loginToken);
      return submitSendOtp(prevState, formData);
    },
    [loginToken],
  );

  const [resendState, resendFormAction, resendPending] = useActionState(
    resendAction,
    INITIAL_RESEND_STATE,
  );

  // ── Auto-focus and auto-send OTP on mount ─────────────────────────────
  // Login alone does not deliver the OTP — the client must call send-otp
  // after email + password. The server rate-limits repeated sends
  // ("please wait a moment before you request another otp").

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const autoSentRef = useRef(false);
  useEffect(() => {
    if (!autoSentRef.current && loginToken) {
      autoSentRef.current = true;
      const formData = new FormData();
      formData.set("locale", locale);
      formData.set("loginToken", loginToken);
      startTransition(() => {
        resendFormAction(formData);
      });
    }
  }, [locale, loginToken, resendFormAction]);

  // ── Resend cooldown timer ──────────────────────────────────────────

  useEffect(() => {
    if (resendCooldown <= 0) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setResendCooldown((current) => {
        const next = current - 1;

        if (next <= 0) {
          window.clearInterval(intervalId);
          return 0;
        }

        return next;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [resendCooldown]);

  // ── Handle resend state changes ───────────────────────────────────

  useEffect(() => {
    if (resendState.status === "resend_success") {
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      setResendMessage(resendState.message);

      const timeoutId = window.setTimeout(() => {
        setResendMessage("");
      }, 4000);

      return () => window.clearTimeout(timeoutId);
    }

    if (resendState.status === "error" && resendState.message) {
      setResendMessage(resendState.message);

      const timeoutId = window.setTimeout(() => {
        setResendMessage("");
      }, 4000);

      return () => window.clearTimeout(timeoutId);
    }
  }, [resendState]);

  // ── OTP digit input handlers ──────────────────────────────────────

  function handleDigitChange(index: number, value: string) {
    // Only accept digits
    const digit = value.replace(/\D/g, "").slice(-1);
    const nextDigits = [...otpDigits];
    nextDigits[index] = digit;
    setOtpDigits(nextDigits);

    // Auto-focus next input
    if (digit && index < OTP_CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleDigitKeyDown(
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(event: React.ClipboardEvent) {
    event.preventDefault();
    const pastedText = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_CODE_LENGTH);

    if (!pastedText) {
      return;
    }

    const nextDigits = [...otpDigits];
    for (let i = 0; i < pastedText.length; i++) {
      nextDigits[i] = pastedText[i];
    }
    setOtpDigits(nextDigits);

    const focusIndex = Math.min(pastedText.length, OTP_CODE_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  }

  const otpCode = otpDigits.join("");
  const isOtpComplete = otpCode.length === OTP_CODE_LENGTH;
  const hasVerifyError =
    verifyState.status === "error" && verifyState.message;

  return (
    <div className="mx-auto flex flex-1 items-center justify-center py-4 sm:py-6 xl:mx-0 xl:basis-[27.5rem] xl:grow-0 xl:shrink-0 xl:py-8">
      <div className="w-full max-w-[27.5rem] rounded-[1.25rem] border border-white/[0.12] bg-zinc-900/35 px-6 py-7 shadow-[0_24px_70px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:px-8 sm:py-9">
        <button
          type="button"
          onClick={onBackToLogin}
          className="flex items-center gap-2 text-xs text-yellow-500 hover:text-yellow-600 bg-zinc-500/20 hover:bg-zinc-500/10 rounded py-1 px-2 w-fit mb-4 cursor-pointer"
        >
          <ArrowLeft className="w-5" />
          <span>{otp.backToLogin}</span>
        </button>

        <h1 className="mb-2 text-[1.75rem] font-extrabold tracking-[-0.02em] text-white">
          {otp.title}
        </h1>

        <p className="mb-6 text-sm leading-6 text-gray-400">
          {otp.description}
        </p>

        {/* OTP digit inputs */}
        <form action={verifyFormAction} className="flex flex-col gap-[0.9rem]">
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="otpCode" value={otpCode} />

          <div>
            <label className="mb-2 block text-[0.82rem] font-medium text-gray-300">
              {otp.codeLabel}
            </label>
            <div
              className="flex items-center justify-between gap-2"
              onPaste={handlePaste}
            >
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  disabled={verifyPending}
                  onChange={(event) =>
                    handleDigitChange(index, event.target.value)
                  }
                  onKeyDown={(event) => handleDigitKeyDown(index, event)}
                  className="h-[3.375rem] w-full rounded-lg border border-white/15 bg-transparent text-center text-xl font-bold text-white outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={`${otp.codeLabel} ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Error / success message */}
          {hasVerifyError ? (
            <p className="text-[0.82rem] text-red-400">
              {verifyState.message}
            </p>
          ) : null}

          {resendMessage ? (
            <p
              className={`text-[0.82rem] ${
                resendState.status === "resend_success"
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}
            >
              {resendMessage}
            </p>
          ) : null}

          {/* Verify button */}
          <button
            type="submit"
            disabled={verifyPending || !isOtpComplete}
            className="mt-1 flex h-[3.125rem] w-full items-center justify-center gap-2 cursor-pointer rounded-[0.6rem] bg-gradient-to-r from-amber-500 to-amber-600 text-[0.92rem] font-black tracking-[0.12em] text-black shadow-[0_4px_24px_rgba(245,158,11,0.4),inset_0_1px_0_rgba(255,255,255,0.08)] transition-[opacity,box-shadow,transform] enabled:hover:-translate-y-px enabled:hover:opacity-95 enabled:hover:shadow-[0_6px_32px_rgba(245,158,11,0.55)] disabled:cursor-not-allowed disabled:opacity-[0.55]"
          >
            {verifyPending ? (
              <>
                <span className="size-4 shrink-0 animate-spin rounded-full border-2 border-black/25 border-t-black" />
                {otp.submitting}
              </>
            ) : (
              otp.submitLabel
            )}
          </button>
        </form>

        {/* Resend OTP */}
        <div className="mt-4 flex items-center justify-center">
          {resendCooldown > 0 ? (
            <span className="text-[0.82rem] text-gray-500">
              {otp.resendLabel} ({resendCooldown}s)
            </span>
          ) : (
            <form action={resendFormAction}>
              <input type="hidden" name="locale" value={locale} />
              <button
                type="submit"
                disabled={resendPending}
                className="text-[0.82rem] text-amber-500 transition-colors hover:text-amber-400 disabled:opacity-50 cursor-pointer"
              >
                {resendPending ? otp.resending : otp.resendLabel}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
