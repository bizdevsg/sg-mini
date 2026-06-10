import { notFound } from "next/navigation";

import { PageTemplate } from "@/components/layouts/PageTemplate";
import { isSupportedLocale, type AppLocale } from "@/locales";

type LocalizedLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locales: string }>;
};

function assertValidLocale(value: string): asserts value is AppLocale {
  if (!isSupportedLocale(value)) {
    notFound();
  }
}

export default async function LocalizedLayout({
  children,
  params,
}: LocalizedLayoutProps) {
  const { locales } = await params;
  assertValidLocale(locales);

  return <PageTemplate locale={locales}>{children}</PageTemplate>;
}
