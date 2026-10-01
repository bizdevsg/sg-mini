"use client";

import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useClientAreaAccountMode } from "@/components/providers/ClientAreaAccountModeProvider";
import {
  getClientAreaAccountModeData,
  getDashboardCopy,
  resolveLocalizedHref,
} from "@/components/organisms/client-area.shared";
import { PUBLIC_REGISTER_URL } from "@/lib/env";
import { getMessages, type AppLocale } from "@/locales";

type ClientAreaAccountReferralPanelProps = {
  locale: AppLocale;
};

export function ClientAreaAccountReferralPanel({
  locale,
}: ClientAreaAccountReferralPanelProps) {
  const { clientArea } = getMessages(locale);
  const { accountMode } = useClientAreaAccountMode();
  const { currentAccount } = getClientAreaAccountModeData(
    getDashboardCopy(locale),
    accountMode,
  );
  const [copiedField, setCopiedField] = useState<"code" | "link" | null>(
    null,
  );
  const accountHref = resolveLocalizedHref(locale, "/client-area/account");
  const referralPage = clientArea.referralPage;
  const referralCode = currentAccount.accountId;
  const referralUrl = `${PUBLIC_REGISTER_URL}${PUBLIC_REGISTER_URL.includes("?") ? "&" : "?"
    }ref=${encodeURIComponent(referralCode)}`;

  async function copyValue(field: "code" | "link", value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      window.setTimeout(() => setCopiedField(null), 1800);
    } catch {
      setCopiedField(null);
    }
  }

  return (
    <div className="space-y-8">
      <Link
        href={accountHref}
        prefetch={false}
        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm font-semibold text-zinc-300 transition hover:border-yellow-500/40 hover:text-yellow-400"
      >
        <FontAwesomeIcon icon={["fas", "chevron-left"]} className="text-xs" />
        <span>{clientArea.accountPage.backLabel}</span>
      </Link>

      <header className="border-b border-white/10 pb-7">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-yellow-400">
          {referralPage.hero.eyebrow}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">
          {referralPage.hero.title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
          {referralPage.hero.description}
        </p>
      </header>

      <section
        aria-labelledby="referral-access-title"
        className="overflow-hidden rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/[0.12] via-zinc-950 to-zinc-950"
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4 sm:px-7">
          <FontAwesomeIcon
            icon={["fas", "link"]}
            className="text-yellow-400"
          />
          <h2 id="referral-access-title" className="font-semibold text-white">
            {referralPage.accessTitle}
          </h2>
        </div>

        <div className="divide-y divide-white/10 px-5 sm:px-7">
          <div className="grid gap-3 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                {referralPage.codeLabel}
              </p>
              <p className="mt-2 font-mono text-xl font-bold tracking-[0.16em] text-white sm:text-2xl">
                {referralCode}
              </p>
            </div>
            <button
              type="button"
              onClick={() => copyValue("code", referralCode)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-yellow-500/30 px-4 text-sm font-semibold text-yellow-300 transition hover:border-yellow-400/60 hover:bg-yellow-500/10"
            >
              <FontAwesomeIcon
                icon={["fas", copiedField === "code" ? "check" : "copy"]}
              />
              {copiedField === "code"
                ? referralPage.copiedLabel
                : referralPage.copyLabel}
            </button>
          </div>

          <div className="grid gap-3 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                {referralPage.linkLabel}
              </p>
              <p className="mt-2 truncate text-sm text-zinc-300 sm:text-base">
                {referralUrl}
              </p>
            </div>
            <button
              type="button"
              onClick={() => copyValue("link", referralUrl)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 px-4 text-sm font-semibold text-zinc-200 transition hover:border-yellow-500/40 hover:text-yellow-300"
            >
              <FontAwesomeIcon
                icon={["fas", copiedField === "link" ? "check" : "copy"]}
              />
              {copiedField === "link"
                ? referralPage.copiedLabel
                : referralPage.copyLinkLabel}
            </button>
          </div>
        </div>
      </section>

      <section aria-labelledby="referral-steps-title">
        <h2
          id="referral-steps-title"
          className="text-xl font-bold text-white sm:text-2xl"
        >
          {referralPage.stepsTitle}
        </h2>
        <div className="mt-5 border-l border-white/15">
          {referralPage.steps.map((step, index) => (
            <div key={step} className="relative pb-6 pl-8 last:pb-0">
              <span className="absolute -left-3 top-0 grid h-6 w-6 place-items-center rounded-full border border-yellow-500/40 bg-zinc-950 text-[11px] font-bold text-yellow-400">
                {index + 1}
              </span>
              <p className="text-sm leading-6 text-zinc-300 sm:text-base">
                {step}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer className="flex flex-col gap-5 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm leading-7 text-zinc-400">
          {referralPage.closing}
        </p>
        <Link
          href={referralUrl}
          prefetch={false}
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-yellow-400 px-6 text-sm font-bold text-zinc-950 transition hover:bg-yellow-300"
        >
          {referralPage.hero.cta}
          <FontAwesomeIcon icon={["fas", "arrow-up-right-from-square"]} />
        </Link>
      </footer>
    </div>
  );
}
