"use client";

import { ClientAreaShell } from "@/components/organisms/ClientAreaShell";
import { ClientAreaTransactionsPanel } from "@/components/organisms/ClientAreaTransactionsPanel";
import type { AppLocale } from "@/locales";

type ClientAreaTransactionsViewProps = {
  locale: AppLocale;
};

export function ClientAreaTransactionsView({
  locale,
}: ClientAreaTransactionsViewProps) {
  return (
    <ClientAreaShell activeTab="transaction" locale={locale}>
      {({ copy }) => <ClientAreaTransactionsPanel copy={copy} />}
    </ClientAreaShell>
  );
}
