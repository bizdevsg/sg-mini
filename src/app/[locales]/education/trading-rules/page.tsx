import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TradingRulesPage } from "@/components/organisms/TradingRulesPage";
import { getLocaleConfig, getMessages, getTradingRulesPageContent, isSupportedLocale, SUPPORTED_LOCALES, type AppLocale } from "@/locales";

type TradingRulesRouteProps = { params: Promise<{ locales: string }> };

function assertValidLocale(value: string): asserts value is AppLocale {
  if (!isSupportedLocale(value)) notFound();
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locales) => ({ locales }));
}

export async function generateMetadata({ params }: TradingRulesRouteProps): Promise<Metadata> {
  const { locales } = await params;
  assertValidLocale(locales);

  return {
    title: "Trading Rules Mini Account | Solid Gold Berjangka",
    description: "Ringkasan peraturan dan ketentuan perdagangan Mini Account CDD Sederhana minimum 0,1 lot.",
    alternates: { canonical: `/${locales}/education/trading-rules`, languages: Object.fromEntries(SUPPORTED_LOCALES.map((locale) => [getLocaleConfig(locale).lang, `/${locale}/education/trading-rules`])) },
  };
}

export default async function TradingRulesRoute({ params }: TradingRulesRouteProps) {
  const { locales } = await params;
  assertValidLocale(locales);
  return <TradingRulesPage homeLabel={getMessages(locales).app.homeLabel} locale={locales} page={getTradingRulesPageContent(locales)} />;
}
