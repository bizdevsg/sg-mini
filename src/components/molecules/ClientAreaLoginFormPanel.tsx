import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { PUBLIC_RECAPTCHA_SITE_KEY } from "@/lib/env";
import type { AppLocale, AppMessages } from "@/locales";

type ClientAreaLoginFormPanelProps = {
  locale: AppLocale;
  login: AppMessages["clientArea"]["login"];
  supportHref: string;
  isRecaptchaEnabled: boolean;
  pending: boolean;
  showPassword: boolean;
  formAction: (formData: FormData) => void | Promise<void>;
  onTogglePassword: () => void;
  onOpenDownloadModal: () => void;
};

const inputClassName =
  "h-[3.125rem] w-full rounded-xl border border-[rgba(80,80,90,0.55)] px-4 text-[0.9rem] text-white outline-none transition-[border-color,box-shadow,opacity] placeholder:text-gray-500 focus:border-[rgba(245,158,11,0.55)] focus:shadow-[0_0_0_3px_rgba(245,158,11,0.1)] disabled:cursor-not-allowed disabled:opacity-50";

export function ClientAreaLoginFormPanel({
  locale,
  login,
  supportHref,
  isRecaptchaEnabled,
  pending,
  showPassword,
  formAction,
  onTogglePassword,
  onOpenDownloadModal,
}: ClientAreaLoginFormPanelProps) {
  const passwordToggleLabel =
    locale === "id"
      ? showPassword
        ? "Sembunyikan password"
        : "Tampilkan password"
      : showPassword
        ? "Hide password"
        : "Show password";
  const submitLabel = "LOGIN";
  const registerLabel = locale === "id" ? "REGISTRASI" : "REGISTER";

  return (
    <div className="mx-auto flex flex-1 items-center justify-center px-4 py-10 min-[480px]:px-6 min-[480px]:py-11 xl:mx-0 xl:basis-[520px] xl:grow-0 xl:shrink-0 xl:px-10 xl:py-12">
      <div className="w-full max-w-[44rem] rounded-[1.25rem] border border-white/10 bg-zinc-800/20 px-6 py-7 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-lg sm:px-7 sm:py-8">
        <h1 className="mb-7 text-[1.75rem] font-extrabold tracking-[-0.02em] text-white">
          {login.title}
        </h1>

        <form action={formAction} className="flex flex-col gap-[0.9rem]">
          <input type="hidden" name="locale" value={locale} />

          <div className="relative">
            <input
              id="client-area-account"
              name="account"
              type="text"
              required
              disabled={pending}
              placeholder={login.accountPlaceholder}
              className={inputClassName}
            />
          </div>

          <div className="relative flex items-center">
            <input
              id="client-area-password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              disabled={pending}
              placeholder={login.passwordPlaceholder}
              className={`${inputClassName} pr-12`}
            />
            <button
              type="button"
              className="absolute right-[0.9rem] top-1/2 -translate-y-1/2 p-1 text-[0.9rem] leading-none text-gray-500 transition-colors hover:text-gray-300"
              onClick={onTogglePassword}
              aria-label={passwordToggleLabel}
              tabIndex={-1}
            >
              <FontAwesomeIcon icon={["fas", showPassword ? "eye-slash" : "eye"]} />
            </button>
          </div>

          <div className="flex items-center justify-between gap-2 mb-3">
            <label className="flex cursor-pointer select-none items-center gap-2 text-[0.82rem] text-gray-400">
              <input
                name="rememberMe"
                type="checkbox"
                disabled={pending}
                className="size-[0.9rem] cursor-pointer accent-amber-500"
              />
              <span>{login.rememberMe}</span>
            </label>
            <Link
              href={supportHref}
              className="text-[0.82rem] text-gray-400 transition-colors hover:text-amber-500"
            >
              {login.forgotPassword}
            </Link>
          </div>

          {isRecaptchaEnabled ? (
            <div className="rounded-[0.6rem] border border-zinc-700/70 bg-black/30 p-3">
              <div className="overflow-x-auto">
                <div
                  className="g-recaptcha min-w-[304px]"
                  data-sitekey={PUBLIC_RECAPTCHA_SITE_KEY}
                  data-theme="dark"
                />
              </div>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="mt-1 flex h-[3.125rem] w-full items-center justify-center gap-2 cursor-pointer rounded-[0.6rem] bg-gradient-to-r from-amber-500 to-amber-600 text-[0.92rem] font-black tracking-[0.12em] text-black shadow-[0_4px_24px_rgba(245,158,11,0.4),inset_0_1px_0_rgba(255,255,255,0.08)] transition-[opacity,box-shadow,transform] enabled:hover:-translate-y-px enabled:hover:opacity-95 enabled:hover:shadow-[0_6px_32px_rgba(245,158,11,0.55)] disabled:cursor-not-allowed disabled:opacity-[0.55]"
          >
            {pending ? (
              <>
                <span className="size-4 shrink-0 animate-spin rounded-full border-2 border-black/25 border-t-black" />
                {login.submitting}
              </>
            ) : (
              submitLabel
            )}
          </button>

          <button
            type="button"
            className="flex h-[3.125rem] w-full items-center justify-center rounded-[0.6rem] cursor-pointer border border-amber-500/30 bg-transparent text-[0.92rem] font-black tracking-[0.12em] text-amber-500 transition-[background-color,border-color,box-shadow,transform] hover:-translate-y-px hover:border-amber-500/[0.55] hover:bg-amber-500/[0.08] hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]"
            onClick={onOpenDownloadModal}
          >
            {registerLabel}
          </button>
        </form>
      </div>
    </div>
  );
}
