import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TradePilotWebviewPage } from "@/components/organisms/TradePilotWebviewPage";
import {
  getLocaleConfig,
  isSupportedLocale,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/locales";

type TradePilotStandalonePageProps = {
  params: Promise<{ locales: string }>;
};

function assertValidLocale(value: string): asserts value is AppLocale {
  if (!isSupportedLocale(value)) {
    notFound();
  }
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({
    locales: locale,
  }));
}

export async function generateMetadata({
  params,
}: TradePilotStandalonePageProps): Promise<Metadata> {
  const { locales } = await params;
  assertValidLocale(locales);

  return {
    title: "Trade Pilot Webview",
    description:
      "Fullscreen iframe webview for Trade Pilot inside Solid Gold Berjangka.",
    alternates: {
      canonical: `/trade-pilot/${locales}`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [
          getLocaleConfig(locale).lang,
          `/trade-pilot/${locale}`,
        ]),
      ),
    },
  };
}

export default async function TradePilotStandalonePage({
  params,
}: TradePilotStandalonePageProps) {
  const { locales } = await params;
  assertValidLocale(locales);

  return <TradePilotWebviewPage locale={locales} />;
}
