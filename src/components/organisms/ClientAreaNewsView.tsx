"use client";

import { ClientAreaNewsPanel } from "@/components/organisms/ClientAreaNewsPanel";
import { ClientAreaShell } from "@/components/organisms/ClientAreaShell";
import type { AppLocale } from "@/locales";

type ClientAreaNewsViewProps = {
  locale: AppLocale;
};

export function ClientAreaNewsView({ locale }: ClientAreaNewsViewProps) {
  return (
    <ClientAreaShell activeTab="news" locale={locale}>
      {({ copy }) => <ClientAreaNewsPanel copy={copy} />}
    </ClientAreaShell>
  );
}
