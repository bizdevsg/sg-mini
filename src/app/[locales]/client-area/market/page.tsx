import { notFound } from "next/navigation";

import { ClientAreaMarketView } from "@/components/organisms/ClientAreaMarketView";
import { requireClientAreaSession } from "@/lib/client-area-auth";
import { isSupportedLocale, type AppLocale } from "@/locales";

type ClientAreaMarketPageProps = {
  params: Promise<{ locales: string }>;
};

function assertValidLocale(value: string): asserts value is AppLocale {
  if (!isSupportedLocale(value)) {
    notFound();
  }
}

export default async function ClientAreaMarketPage({
  params,
}: ClientAreaMarketPageProps) {
  const { locales } = await params;
  assertValidLocale(locales);
  await requireClientAreaSession(locales);

  return <ClientAreaMarketView locale={locales} />;
}
