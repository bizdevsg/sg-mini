"use client";

import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";

import { ClientAreaFundTransferUnavailableModal } from "@/components/molecules/ClientAreaFundTransferUnavailableModal";
import { resolveLocalizedHref } from "@/components/organisms/client-area.shared";
import { CLIENT_AREA_REFERRAL_ENABLED } from "@/lib/client-area-features";
import { getMessages, type AppLocale } from "@/locales";

type ClientAreaAccountPanelProps = {
  locale: AppLocale;
};

type AccountMenuItem = {
  disabled?: boolean;
  href?: string;
  helperText: string;
  icon: IconProp;
  label: string;
  onClick?: () => void;
};

function AccountMenuRow({
  disabled = false,
  helperText,
  href,
  icon,
  label,
  onClick,
}: AccountMenuItem) {
  const className = `group flex w-full items-center gap-4 px-1 py-4 text-left transition-colors sm:px-2 ${
    disabled
      ? "cursor-not-allowed opacity-50"
      : "hover:bg-white/[0.025]"
  }`;
  const content = (
    <>
      <FontAwesomeIcon
        icon={icon}
        className={`w-5 shrink-0 text-base text-zinc-500 transition-colors ${
          disabled ? "" : "group-hover:text-yellow-400"
        }`}
      />
      <span className="min-w-0 flex-1">
        <span className="block text-base font-semibold text-zinc-100">
          {label}
        </span>
        <span className="mt-1 block text-sm leading-5 text-zinc-500">
          {helperText}
        </span>
      </span>
      <FontAwesomeIcon
        icon={["fas", disabled ? "lock" : "chevron-right"]}
        className={`mr-1 shrink-0 text-xs text-zinc-600 transition ${
          disabled
            ? ""
            : "group-hover:translate-x-0.5 group-hover:text-yellow-400"
        }`}
      />
    </>
  );

  if (disabled) {
    return (
      <div aria-disabled="true" className={className}>
        {content}
      </div>
    );
  }

  if (href) {
    return (
      <Link href={href} prefetch={false} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}

export function ClientAreaAccountPanel({
  locale,
}: ClientAreaAccountPanelProps) {
  const { clientArea } = getMessages(locale);
  const accountPage = clientArea.accountPage;
  const [activeTransferModal, setActiveTransferModal] = useState<
    "deposit" | "withdrawal" | null
  >(null);

  const items: AccountMenuItem[] = [
    {
      href: resolveLocalizedHref(locale, "/client-area/account/profile"),
      helperText: accountPage.menuDescriptions.profile,
      icon: ["fas", "user"],
      label: accountPage.menuItems.profile,
    },
    {
      disabled: !CLIENT_AREA_REFERRAL_ENABLED,
      href: CLIENT_AREA_REFERRAL_ENABLED
        ? resolveLocalizedHref(locale, "/client-area/account/kode-referal")
        : undefined,
      helperText: accountPage.menuDescriptions.referral,
      icon: ["fas", "user-group"],
      label: accountPage.menuItems.referral,
    },
    {
      href: resolveLocalizedHref(
        locale,
        "/client-area/account/daily-statement",
      ),
      helperText: accountPage.menuDescriptions.dailyStatement,
      icon: ["fas", "file-invoice-dollar"],
      label: accountPage.menuItems.dailyStatement,
    },
    {
      helperText: accountPage.menuDescriptions.withdrawal,
      icon: ["fas", "arrow-up-from-bracket"],
      label: accountPage.menuItems.withdrawal,
      onClick: () => setActiveTransferModal("withdrawal"),
    },
    {
      helperText: accountPage.menuDescriptions.deposit,
      icon: ["fas", "circle-down"],
      label: accountPage.menuItems.deposit,
      onClick: () => setActiveTransferModal("deposit"),
    },
  ];

  return (
    <section aria-labelledby="account-services-title">
      <div>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 id="account-services-title" className="text-xl font-bold text-white sm:text-2xl">
              {accountPage.accountCenter.servicesTitle}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              {accountPage.accountCenter.servicesDescription}
            </p>
          </div>
        </div>

        <div className="divide-y divide-white/10 border-y border-white/10">
          {items.map((item) => (
            <AccountMenuRow
              key={item.label}
              {...item}
            />
          ))}
        </div>
      </div>

      <ClientAreaFundTransferUnavailableModal
        action={activeTransferModal ?? "deposit"}
        isOpen={activeTransferModal !== null}
        locale={locale}
        onClose={() => setActiveTransferModal(null)}
      />
    </section>
  );
}
