import { notFound } from "next/navigation";

import { ClientAreaTransactionsView } from "@/components/organisms/ClientAreaTransactionsView";
import { requireClientAreaSession } from "@/lib/client-area-auth";
import { isSupportedLocale, type AppLocale } from "@/locales";

type ClientAreaTransactionPageProps = {
  params: Promise<{ locales: string }>;
};

function assertValidLocale(value: string): asserts value is AppLocale {
  if (!isSupportedLocale(value)) {
    notFound();
  }
}

export default async function ClientAreaTransactionPage({
  params,
}: ClientAreaTransactionPageProps) {
  const { locales } = await params;
  assertValidLocale(locales);
  await requireClientAreaSession(locales);

  return <ClientAreaTransactionsView locale={locales} />;
}
