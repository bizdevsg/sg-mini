import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ClientAreaMarketSignalDetailPanel } from "@/components/organisms/ClientAreaMarketSignalDetailPanel";
import { requireClientAreaSession } from "@/lib/client-area-auth";
import { getClientAreaNewsContent } from "@/lib/client-area-news";
import { buildPrivateMetadata } from "@/lib/metadata";
import {
  getLatestMarketSignalByCategory,
  getMarketSignalHistoryByCategory,
} from "@/lib/market-signal";
import { getMessages, isSupportedLocale, type AppLocale } from "@/locales";

const MARKET_SIGNAL_NEWS_LIMIT = 1;
const MARKET_SIGNAL_HISTORY_LIMIT = 5;

type ClientAreaMarketSignalDetailPageProps = {
  params: Promise<{ locales: string; category: string }>;
};

function assertValidLocale(value: string): asserts value is AppLocale {
  if (!isSupportedLocale(value)) {
    notFound();
  }
}

export async function generateMetadata({
  params,
}: ClientAreaMarketSignalDetailPageProps): Promise<Metadata> {
  const { locales, category } = await params;
  assertValidLocale(locales);

  const item = await getLatestMarketSignalByCategory(
    decodeURIComponent(category),
  );

  if (!item) {
    notFound();
  }

  return buildPrivateMetadata({
    title: `${item.categoryName} Signal | Market Insight`,
    description: item.title || `${item.categoryName} trading signal`,
    locale: locales,
    path: `/${locales}/client-area/market-signal/${item.categorySlug}`,
  });
}

export default async function ClientAreaMarketSignalDetailPage({
  params,
}: ClientAreaMarketSignalDetailPageProps) {
  const { locales, category } = await params;
  assertValidLocale(locales);
  await requireClientAreaSession(locales);

  const item = await getLatestMarketSignalByCategory(
    decodeURIComponent(category),
  );

  if (!item) {
    notFound();
  }

  const backLabel = getMessages(locales).app.homeLabel;

  const [olderHistorySignals, newsContent] = await Promise.all([
    getMarketSignalHistoryByCategory(
      item.categorySlug,
      item.id,
      MARKET_SIGNAL_HISTORY_LIMIT,
    ),
    getClientAreaNewsContent(locales),
  ]);

  const categoryHaystack = [item.categoryName, item.categorySlug]
    .filter(Boolean)
    .map((value) => value.toLowerCase());
  const relevantNews = newsContent.articles.filter((article) => {
    const haystack = `${article.category} ${article.title} ${article.excerpt}`.toLowerCase();
    return categoryHaystack.some((keyword) => haystack.includes(keyword));
  });
  const newsArticles = (
    relevantNews.length > 0 ? relevantNews : newsContent.articles
  ).slice(0, MARKET_SIGNAL_NEWS_LIMIT);
  const historySignals = [item, ...olderHistorySignals].slice(
    0,
    MARKET_SIGNAL_HISTORY_LIMIT,
  );

  return (
    <ClientAreaMarketSignalDetailPanel
      backLabel={backLabel}
      historySignals={historySignals}
      item={item}
      locale={locales}
      newsArticles={newsArticles}
    />
  );
}
