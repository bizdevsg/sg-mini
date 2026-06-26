import { notFound } from "next/navigation";

import { ClientAreaLayout } from "@/components/layout/ClientAreaLayout";
import { isSupportedLocale, type AppLocale } from "@/locales";

type ClientLocalizedLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locales: string }>;
};

function assertValidLocale(value: string): asserts value is AppLocale {
  if (!isSupportedLocale(value)) {
    notFound();
  }
}

export default async function ClientLocalizedLayout({
  children,
  params,
}: ClientLocalizedLayoutProps) {
  const { locales } = await params;
  assertValidLocale(locales);

  return <ClientAreaLayout locale={locales}>{children}</ClientAreaLayout>;
}
