import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { resolveLocalizedHref } from "@/components/organisms/client-area.shared";
import type { AccountSnapshot } from "@/components/organisms/client-area.types";
import { getMessages, type AppLocale } from "@/locales";

type ClientAreaAccountProfilePanelProps = {
  currentAccount: AccountSnapshot;
  locale: AppLocale;
};

type ProfileDetailProps = {
  label: string;
  value: string;
};

function ProfileDetail({ label, value }: ProfileDetailProps) {
  return (
    <div className="grid gap-1 border-b border-white/8 py-4 last:border-b-0 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-center sm:gap-6">
      <dt className="text-sm text-zinc-500">{label}</dt>
      <dd className="break-words text-sm font-semibold text-zinc-100 sm:text-right">
        {value}
      </dd>
    </div>
  );
}

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return initials || "SG";
}

export function ClientAreaAccountProfilePanel({
  currentAccount,
  locale,
}: ClientAreaAccountProfilePanelProps) {
  const accountPage = getMessages(locale).clientArea.accountPage;
  const viewOnly = accountPage.viewOnly;
  const accountHref = resolveLocalizedHref(locale, "/client-area/account");

  return (
    <section
      aria-labelledby="account-profile-title"
      className="overflow-hidden rounded-[30px] border border-white/10 bg-[#151619] shadow-[0_24px_80px_rgba(0,0,0,0.28)]"
    >
      <header className="flex flex-col gap-5 border-b border-white/8 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex min-w-0 items-center gap-4">
          <Link
            href={accountHref}
            aria-label={accountPage.backLabel}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-zinc-300 transition hover:border-yellow-500/45 hover:text-yellow-400"
          >
            <FontAwesomeIcon
              icon={["fas", "chevron-left"]}
              className="text-xs"
            />
          </Link>
          <div className="min-w-0">
            <h1
              id="account-profile-title"
              className="text-xl font-bold tracking-tight text-white sm:text-2xl"
            >
              {accountPage.menuItems.profile}
            </h1>
            <p className="mt-1 truncate text-sm text-zinc-500">
              {currentAccount.accountId}
            </p>
          </div>
        </div>

        <div className="inline-flex w-fit items-center gap-2 text-xs font-semibold text-zinc-400">
          <FontAwesomeIcon
            icon={["fas", "lock"]}
            className="text-yellow-500"
            aria-hidden="true"
          />
          <span>{viewOnly.badge}</span>
        </div>
      </header>

      <div className="grid lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="border-b border-white/8 p-6 sm:p-8 lg:border-b-0 lg:border-r lg:border-white/8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            {viewOnly.photoLabel}
          </p>

          <div className="mt-5 flex items-center gap-5 lg:flex-col lg:items-start">
            <div
              aria-label={`${viewOnly.photoLabel}: ${currentAccount.accountOwner}`}
              className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 text-2xl font-black text-zinc-950 ring-4 ring-white/[0.04] sm:h-28 sm:w-28 sm:text-3xl"
              role="img"
            >
              {getInitials(currentAccount.accountOwner)}
            </div>

            <div className="min-w-0">
              <p className="break-words text-lg font-bold leading-snug text-white">
                {currentAccount.accountOwner}
              </p>
              <p className="mt-1 break-all text-sm leading-5 text-zinc-500">
                {currentAccount.email}
              </p>
            </div>
          </div>
        </aside>

        <div className="p-5 sm:p-8">
          <section aria-labelledby="personal-information-title">
            <h2
              id="personal-information-title"
              className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-300"
            >
              {viewOnly.personalTitle}
            </h2>
            <dl className="mt-3">
              <ProfileDetail
                label={accountPage.fields.fullName}
                value={currentAccount.accountOwner}
              />
              <ProfileDetail
                label={accountPage.fields.email}
                value={currentAccount.email}
              />
            </dl>
          </section>

          <section
            aria-labelledby="account-information-title"
            className="mt-8 border-t border-white/8 pt-8"
          >
            <h2
              id="account-information-title"
              className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-300"
            >
              {viewOnly.accountTitle}
            </h2>
            <dl className="mt-3">
              <ProfileDetail
                label={viewOnly.accountIdLabel}
                value={currentAccount.accountId}
              />
              <ProfileDetail
                label={viewOnly.accountTypeLabel}
                value={currentAccount.typeLabel}
              />
              <ProfileDetail
                label={viewOnly.accountStatusLabel}
                value={currentAccount.status}
              />
              <ProfileDetail
                label={viewOnly.brokerLabel}
                value={currentAccount.broker}
              />
            </dl>
          </section>
        </div>
      </div>
    </section>
  );
}
