"use client";

import { ClientAreaMarketPanel } from "@/components/organisms/ClientAreaMarketPanel";
import { ClientAreaShell } from "@/components/organisms/ClientAreaShell";
import type { AppLocale } from "@/locales";

type ClientAreaMarketViewProps = {
  locale: AppLocale;
};

export function ClientAreaMarketView({ locale }: ClientAreaMarketViewProps) {
  return (
    <ClientAreaShell activeTab="market" locale={locale}>
      {({ copy, onActionClick, prices }) => (
        <ClientAreaMarketPanel
          copy={copy}
          prices={prices}
          onTrade={() => onActionClick("deposit")}
        />
      )}
    </ClientAreaShell>
  );
}
