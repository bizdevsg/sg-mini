"use client";

import { useRouter } from "next/navigation";

import { ClientAreaFundTransferUnavailableModal } from "@/components/molecules/ClientAreaFundTransferUnavailableModal";
import { ClientAreaAccountPanel } from "@/components/organisms/ClientAreaAccountPanel";
import { ClientAreaShell } from "@/components/organisms/ClientAreaShell";
import { resolveLocalizedHref } from "@/components/organisms/client-area.shared";
import type { BreakingNewsItem } from "@/components/organisms/client-area.types";
import type { AppLocale } from "@/locales";

type FundTransferAction = "deposit" | "withdrawal";

type ClientAreaAccountTransferUnavailableViewProps = {
  action: FundTransferAction;
  breakingNews?: BreakingNewsItem[];
  locale: AppLocale;
};

export function ClientAreaAccountTransferUnavailableView({
  action,
  breakingNews,
  locale,
}: ClientAreaAccountTransferUnavailableViewProps) {
  const router = useRouter();
  const accountHref = resolveLocalizedHref(locale, "/client-area/account");

  return (
    <ClientAreaShell
      activeTab="account"
      breakingNews={breakingNews}
      locale={locale}
      modal={
        <ClientAreaFundTransferUnavailableModal
          action={action}
          isOpen
          locale={locale}
          onClose={() => router.replace(accountHref)}
        />
      }
    >
      <ClientAreaAccountPanel locale={locale} />
    </ClientAreaShell>
  );
}
