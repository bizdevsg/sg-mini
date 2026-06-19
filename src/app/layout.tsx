import type { Metadata } from "next";
import { Suspense } from "react";
import { Noto_Sans, Open_Sans } from "next/font/google";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { FontAwesomeProvider } from "@/components/providers/FontAwesomeProvider";
import { LoadingProvider } from "@/components/providers/LoadingProvider";
import { NEWS_PORTAL_BASE_URL } from "@/lib/env";
import "@/lib/fontawesome";
import {
  DEFAULT_LOCALE,
  getLocaleConfig,
  isSupportedLocale,
  type AppLocale,
} from "@/locales";
import "./globals.css";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  display: "swap",
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Solid Gold Berjangka",
    template: "%s | Solid Gold Berjangka",
  },
  description:
    "PT Solid Gold Berjangka provides trusted futures trading services, market insights, and investment education to help traders make informed decisions.",
  icons: {
    icon: "/assets/Logo SG-WEB111.png",
    shortcut: "/assets/Logo SG-WEB111.png",
    apple: "/assets/Logo SG-WEB111.png",
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params?: Promise<{ locales?: string }>;
}>) {
  const { locales } = params ? await params : {};
  const locale: AppLocale =
    locales && isSupportedLocale(locales) ? locales : DEFAULT_LOCALE;

  return (
    <html
      lang={getLocaleConfig(locale).lang}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${notoSans.variable} ${openSans.variable} h-full antialiased`}
    >
      <head>
        <link rel="dns-prefetch" href="//portalnews.newsmaker.id" />
        <link
          rel="preconnect"
          href={NEWS_PORTAL_BASE_URL}
          crossOrigin="anonymous"
        />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <FontAwesomeProvider>
          <Suspense fallback={children}>
            <LoadingProvider locale={locale}>{children}</LoadingProvider>
          </Suspense>
        </FontAwesomeProvider>
      </body>
    </html>
  );
}
