import type { Metadata } from "next";
import { Suspense } from "react";
import { Noto_Sans, Open_Sans } from "next/font/google";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { FontAwesomeProvider } from "@/components/providers/FontAwesomeProvider";
import { RouteLoadingBar } from "@/components/molecules/RouteLoadingBar";
import { getCdnAssetUrl, NEWS_PORTAL_BASE_URL } from "@/lib/env";
import "@/lib/fontawesome";
import { DEFAULT_LOCALE, getLocaleConfig } from "@/locales";
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
    icon: getCdnAssetUrl("Logo%20SG-WEB111.png"),
    shortcut: getCdnAssetUrl("Logo%20SG-WEB111.png"),
    apple: getCdnAssetUrl("Logo%20SG-WEB111.png"),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={getLocaleConfig(DEFAULT_LOCALE).lang}
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
          <Suspense fallback={null}>
            <RouteLoadingBar />
          </Suspense>
          {children}
        </FontAwesomeProvider>
      </body>
    </html>
  );
}
