"use client";

import { useState } from "react";

import { ClientAreaActionModal } from "@/components/molecules/ClientAreaActionModal";
import { ClientAreaMarketPanel } from "@/components/organisms/ClientAreaMarketPanel";
import { ClientAreaShell } from "@/components/organisms/ClientAreaShell";
import {
  getClientAreaMarketPrices,
  getDashboardCopy,
} from "@/components/organisms/client-area.shared";
import type {
  ActionId,
  BreakingNewsItem,
} from "@/components/organisms/client-area.types";
import { useLiveQuoteStream } from "@/hooks/useLiveQuoteStream";
import type { AppLocale } from "@/locales";

type ClientAreaMarketViewProps = {
  breakingNews?: BreakingNewsItem[];
  locale: AppLocale;
};

export function ClientAreaMarketView({
  breakingNews,
  locale,
}: ClientAreaMarketViewProps) {
  const copy = getDashboardCopy(locale);
  const { quotes } = useLiveQuoteStream();
  const prices = getClientAreaMarketPrices(quotes);
  const [activeModal, setActiveModal] = useState<ActionId | null>(null);

  return (
    <ClientAreaShell
      activeTab="market"
      breakingNews={breakingNews}
      locale={locale}
      modal={
        activeModal ? (
          <ClientAreaActionModal
            actionId={activeModal}
            copy={copy}
            locale={locale}
            onClose={() => setActiveModal(null)}
          />
        ) : null
      }
    >
      <ClientAreaMarketPanel
        copy={copy}
        prices={prices}
        onTrade={() => setActiveModal("deposit")}
      />
    </ClientAreaShell>
  );
}
