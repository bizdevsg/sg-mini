import { notFound, redirect } from "next/navigation";
import { isSupportedLocale, type AppLocale } from "@/locales";

type TradePilotRedirectPageProps = {
  params: Promise<{ locales: string }>;
};

function assertValidLocale(value: string): asserts value is AppLocale {
  if (!isSupportedLocale(value)) {
    notFound();
  }
}

export default async function TradePilotPage({
  params,
}: TradePilotRedirectPageProps) {
  const { locales } = await params;
  assertValidLocale(locales);

  redirect(`/trade-pilot/${locales}`);
}
