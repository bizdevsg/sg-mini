import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDashboardCopy } from "@/components/organisms/client-area.shared";
import { buildPrivateMetadata } from "@/lib/metadata";
import {
  getMessages,
  isSupportedLocale,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/locales";

export type ClientAreaSubpageId =
  | "account"
  | "ebook"
  | "market"
  | "market-signal"
  | "news";

export type ClientAreaSubpageProps = {
  params: Promise<{ locales: string }>;
};

export type ClientAreaTradePilotRoute =
  | "analisis"
  | "riwayat-performa"
  | "panduan";

export function assertValidLocale(value: string): asserts value is AppLocale {
  if (!isSupportedLocale(value)) {
    notFound();
  }
}

export function generateClientAreaStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({
    locales: locale,
  }));
}

export function getClientAreaSeoLabel(locale: AppLocale) {
  return getMessages(locale).clientArea.seoLabel;
}

function getClientAreaSubpageTitle(
  locale: AppLocale,
  pageId: ClientAreaSubpageId,
) {
  const copy = getDashboardCopy(locale);

  switch (pageId) {
    case "account":
      return copy.accountTitle;
    case "ebook":
      return getMessages(locale).ebookPage.title;
    case "market":
      return getMessages(locale).clientArea.marketTransactions.title;
    case "market-signal":
      return getMessages(locale).clientArea.marketSignalDetail.insightTitle;
    case "news":
      return copy.newsTitle;
  }
}

export function buildClientAreaSubpageMetadata(
  locale: AppLocale,
  pageId: ClientAreaSubpageId,
): Metadata {
  const { clientArea } = getMessages(locale);
  const sectionTitle = getClientAreaSubpageTitle(locale, pageId);
  const clientAreaLabel = getClientAreaSeoLabel(locale);
  const path = `/${locale}/client-area/${pageId}`;

  return buildPrivateMetadata({
    title: `${sectionTitle} | ${clientAreaLabel}`,
    description: `${sectionTitle}. ${clientArea.pageDescription}`,
    locale,
    path,
  });
}

export function buildClientAreaTradePilotMetadata(
  locale: AppLocale,
  route: ClientAreaTradePilotRoute,
): Metadata {
  const { clientArea } = getMessages(locale);
  const routeCopy =
    route === "analisis"
      ? clientArea.tradePilotPage.analysis
      : route === "riwayat-performa"
        ? clientArea.tradePilotPage.performanceHistory
        : clientArea.tradePilotPage.guide;
  const clientAreaLabel = getClientAreaSeoLabel(locale);

  return buildPrivateMetadata({
    title: `${routeCopy.title} | Trade Pilot | ${clientAreaLabel}`,
    description: routeCopy.description,
    locale,
    path: `/${locale}/client-area/trade-pilot/${route}`,
  });
}
