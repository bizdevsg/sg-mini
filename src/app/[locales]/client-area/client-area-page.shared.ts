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
  | "news"
  | "transaction";

export type ClientAreaSubpageProps = {
  params: Promise<{ locales: string }>;
};

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
  return locale === "id" ? "Client Area" : "Client Area";
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
      return copy.marketWatchTitle;
    case "news":
      return copy.newsTitle;
    case "transaction":
      return copy.transactionTitle;
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
