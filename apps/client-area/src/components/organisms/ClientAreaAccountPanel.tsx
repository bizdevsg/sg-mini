"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  helperText: string;
  icon: IconProp;
  label: string;
  onClick?: () => void;
};

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
      href: resolveLocalizedHref(locale, "/client-area/account/kode-referal"),
      helperText: accountPage.menuDescriptions.referral,
      icon: ["fas", "user-group"],
      label: accountPage.menuItems.referral,
    },
    {
      href: resolveLocalizedHref(
        locale,
        "/client-area/account/document-approval",
      ),
      helperText: accountPage.menuDescriptions.documentApproval,
      icon: ["fas", "file-signature"],
      label: accountPage.menuItems.documentApproval,
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

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
