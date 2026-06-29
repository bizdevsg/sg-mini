"use client";

import { ClientAreaAccountPanel } from "@/components/organisms/ClientAreaAccountPanel";
import { ClientAreaShell } from "@/components/organisms/ClientAreaShell";
import type { AppLocale } from "@/locales";

type ClientAreaAccountViewProps = {
  locale: AppLocale;
};

export function ClientAreaAccountView({ locale }: ClientAreaAccountViewProps) {
  return (
    <ClientAreaShell activeTab="account" locale={locale}>
      {({ copy, currentAccount }) => (
        <ClientAreaAccountPanel copy={copy} currentAccount={currentAccount} />
      )}
    </ClientAreaShell>
  );
}
