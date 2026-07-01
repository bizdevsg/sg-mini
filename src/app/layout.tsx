import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "flag-icons/css/flag-icons.min.css";
import { FontAwesomeProvider } from "@/components/providers/FontAwesomeProvider";
import { NEWS_PORTAL_BASE_URL } from "@/lib/env";
import "@/lib/fontawesome";
import {
  DEFAULT_LOCALE,
  getLocaleConfig,
  isSupportedLocale,
  type AppLocale,
} from "@/locales";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
      className={`${poppins.variable} h-full antialiased`}
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
        <FontAwesomeProvider>{children}</FontAwesomeProvider>
        <Script id="tawk-init" strategy="lazyOnload">
          {`window.Tawk_API = window.Tawk_API || {}; window.Tawk_LoadStart = new Date();`}
        </Script>
        <Script
          id="tawk-chat"
          src="https://embed.tawk.to/6a4477cca4845e1d49d8e720/1jsdn7tul"
          strategy="lazyOnload"
          charSet="UTF-8"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
