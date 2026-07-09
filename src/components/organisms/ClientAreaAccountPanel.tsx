"use client";

import Link from "next/link";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { resolveLocalizedHref } from "@/components/organisms/client-area.shared";
import { getMessages, type AppLocale } from "@/locales";

type ClientAreaAccountPanelProps = {
  locale: AppLocale;
};

type AccountMenuItem = {
  href?: string;
  icon: IconProp;
  label: string;
};

function AccountMenuCard({ href, icon, label }: AccountMenuItem) {
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
    </>
  );

  if (href) {
    return (
      <Link href={href} prefetch={false} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={className}>
      {content}
    </button>
  );
}

export function ClientAreaAccountPanel({
  locale,
}: ClientAreaAccountPanelProps) {
  const accountPage = getMessages(locale).clientArea.accountPage;
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
      href: resolveLocalizedHref(locale, "/client-area/account/withdrawal"),
      icon: ["fas", "arrow-up-from-bracket"],
      label: accountPage.menuItems.withdrawal,
    },
    {
      href: resolveLocalizedHref(locale, "/client-area/account/deposit"),
      icon: ["fas", "circle-down"],
      label: accountPage.menuItems.deposit,
    },
  ];

  return (
    <div className="rounded-[34px] border border-zinc-800 bg-black/35 p-4 backdrop-blur-xl sm:p-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {items.map((item) => (
          <AccountMenuCard
            key={item.label}
            href={item.href}
            icon={item.icon}
            label={item.label}
          />
        ))}
      </div>
    </div>
  );
}
