import { notFound } from "next/navigation";

import { ClientAreaAccountView } from "@/components/organisms/ClientAreaAccountView";
import { requireClientAreaSession } from "@/lib/client-area-auth";
import { getClientAreaBreakingNews } from "@/lib/client-area-news";
import { isSupportedLocale, type AppLocale } from "@/locales";

type ClientAreaAccountPageProps = {
  params: Promise<{ locales: string }>;
};

function assertValidLocale(value: string): asserts value is AppLocale {
  if (!isSupportedLocale(value)) {
    notFound();
  }
}

export default async function ClientAreaAccountPage({
  params,
}: ClientAreaAccountPageProps) {
  const { locales } = await params;
  assertValidLocale(locales);
  await requireClientAreaSession(locales);
  const breakingNews = await getClientAreaBreakingNews(locales);

  return <ClientAreaAccountView breakingNews={breakingNews} locale={locales} />;
}
