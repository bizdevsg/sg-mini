import { notFound } from "next/navigation";

import { ClientAreaNewsView } from "@/components/organisms/ClientAreaNewsView";
import { requireClientAreaSession } from "@/lib/client-area-auth";
import { getClientAreaNewsContent } from "@/lib/client-area-news";
import { isSupportedLocale, type AppLocale } from "@/locales";

type ClientAreaNewsPageProps = {
  params: Promise<{ locales: string }>;
};

function assertValidLocale(value: string): asserts value is AppLocale {
  if (!isSupportedLocale(value)) {
    notFound();
  }
}

export default async function ClientAreaNewsPage({
  params,
}: ClientAreaNewsPageProps) {
  const { locales } = await params;
  assertValidLocale(locales);
  await requireClientAreaSession(locales);
  const { articles, breakingNews } = await getClientAreaNewsContent(locales);

  return (
    <ClientAreaNewsView
      articles={articles}
      breakingNews={breakingNews}
      locale={locales}
    />
  );
}
