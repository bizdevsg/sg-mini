import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { ClientAreaLoginPage } from "@/components/organisms/ClientAreaLoginPage";
import { redirectAuthenticatedClientAreaUser } from "@/lib/client-area-auth";
import { buildPrivateMetadata } from "@/lib/metadata";
import { isRecaptchaEnabled, resolveRequestHostname } from "@/lib/recaptcha";
import {
  getMessages,
  isSupportedLocale,
  SUPPORTED_LOCALES,
} from "@/locales";
import type { AppLocale } from "@/locales";

type ClientAreaLoginRouteProps = {
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
}: ClientAreaLoginRouteProps): Promise<Metadata> {
  const { locales } = await params;
  assertValidLocale(locales);

  const { clientArea } = getMessages(locales);
  const title =
    locales === "id" ? "Login Client Area" : "Client Area Login";

  return buildPrivateMetadata({
    title,
    description: clientArea.login.description,
    locale: locales,
    path: `/${locales}/client-area/login`,
  });
}

export default async function ClientAreaLoginRoute({
  params,
}: ClientAreaLoginRouteProps) {
  const { locales } = await params;
  assertValidLocale(locales);
  await redirectAuthenticatedClientAreaUser(locales);
  const requestHeaders = await headers();
  const requestHostname = resolveRequestHostname(requestHeaders);

  return (
    <ClientAreaLoginPage
      isRecaptchaEnabled={isRecaptchaEnabled(requestHostname)}
      locale={locales}
    />
  );
}
