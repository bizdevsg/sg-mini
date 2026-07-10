"use client";

import Link from "next/link";
import { useState } from "react";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ClientAreaFundTransferUnavailableModal } from "@/components/molecules/ClientAreaFundTransferUnavailableModal";
import { resolveLocalizedHref } from "@/components/organisms/client-area.shared";
import { getMessages, type AppLocale } from "@/locales";

type ClientAreaAccountPanelProps = {
  locale: AppLocale;
};

type AccountMenuItem = {
  href?: string;
  helperText?: string;
  icon: IconProp;
  label: string;
  onClick?: () => void;
};

function AccountMenuCard({
  helperText,
  href,
  icon,
  label,
  onClick,
}: AccountMenuItem) {
  const className =
    "group flex min-h-[118px] w-full flex-col items-center justify-center rounded-[18px] border border-zinc-700 bg-zinc-900/85 px-4 py-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-yellow-500/60 hover:bg-zinc-800/90";

  const content = (
    <>
      <div className="flex h-12 w-12 items-center justify-center text-yellow-400 transition-transform duration-300 group-hover:scale-110">
        <FontAwesomeIcon icon={icon} className="text-4xl" />
      </div>
      <span className="mt-4 text-base font-semibold leading-tight text-white">
        {label}
      </span>
      {helperText ? (
        <span className="mt-2 text-xs font-medium text-zinc-500">
          {helperText}
        </span>
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} prefetch={false} className={className}>
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {content}
      </button>
    );
  }

  return (
    <div aria-disabled="true" className={className}>
      {content}
    </div>
  );
}

export function ClientAreaAccountPanel({
  locale,
}: ClientAreaAccountPanelProps) {
  const { clientArea } = getMessages(locale);
  const accountPage = clientArea.accountPage;
  const modalCopy = clientArea.fundTransferModal;
  const [activeTransferModal, setActiveTransferModal] = useState<
    "deposit" | "withdrawal" | null
  >(null);
  const items: AccountMenuItem[] = [
    {
      href: resolveLocalizedHref(locale, "/client-area/account/profile"),
      icon: ["fas", "user-pen"],
      label: accountPage.menuItems.profile,
    },
    {
      href: resolveLocalizedHref(locale, "/client-area/account/kode-referal"),
      icon: ["fas", "user-group"],
      label: accountPage.menuItems.referral,
    },
    {
      icon: ["fas", "file-signature"],
      label: accountPage.menuItems.documentApproval,
    },
    {
      icon: ["fas", "file-invoice-dollar"],
      label: accountPage.menuItems.dailyStatement,
    },
    {
      icon: ["fas", "arrow-up-from-bracket"],
      label: accountPage.menuItems.withdrawal,
      onClick: () => setActiveTransferModal("withdrawal"),
    },
    {
      icon: ["fas", "circle-down"],
      label: accountPage.menuItems.deposit,
      onClick: () => setActiveTransferModal("deposit"),
    },
  ];

  return (
    <div className="rounded-[34px] border border-zinc-800 bg-black/35 p-4 backdrop-blur-xl sm:p-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {items.map((item) => (
          <AccountMenuCard
            helperText={item.helperText}
            key={item.label}
            href={item.href}
            icon={item.icon}
            label={item.label}
            onClick={item.onClick}
          />
        ))}
      </div>

      <ClientAreaFundTransferUnavailableModal
        action={activeTransferModal ?? "deposit"}
        isOpen={activeTransferModal !== null}
        locale={locale}
        onClose={() => setActiveTransferModal(null)}
      />
    </div>
  );
}
