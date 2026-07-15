"use client";

import { useState } from "react";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";

import { ClientAreaFundTransferUnavailableModal } from "@/components/molecules/ClientAreaFundTransferUnavailableModal";
import { ClientAreaAccountMenuCard } from "@/components/molecules/ClientAreaAccountMenuCard";
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
          <ClientAreaAccountMenuCard
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
