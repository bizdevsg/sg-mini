import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "aos/dist/aos.css";
import "flag-icons/css/flag-icons.min.css";
import { AosProvider } from "@/components/providers/AosProvider";
import { FirebaseBootstrap } from "@/components/providers/FirebaseBootstrap";
import { FontAwesomeProvider } from "@/components/providers/FontAwesomeProvider";
import { LoadingProvider } from "@/components/providers/LoadingProvider";
import { NEWS_IMAGE_BASE_URL } from "@/lib/env";
import {
  DEFAULT_SITE_DESCRIPTION,
  DEFAULT_SITE_TITLE,
  SITE_METADATA_BASE,
} from "@/lib/metadata";
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
  metadataBase: SITE_METADATA_BASE,
  title: {
    default: DEFAULT_SITE_TITLE,
    template: "%s | Solid Gold Berjangka",
  },
  description: DEFAULT_SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Solid Gold Berjangka",
    title: DEFAULT_SITE_TITLE,
    description: DEFAULT_SITE_DESCRIPTION,
    images: [
      {
        url: "/assets/BANNER-UTAMA-SOLID.png",
        alt: "Solid Gold Berjangka",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_SITE_TITLE,
    description: DEFAULT_SITE_DESCRIPTION,
    images: ["/assets/BANNER-UTAMA-SOLID.png"],
  },
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
          href={NEWS_IMAGE_BASE_URL}
          crossOrigin="anonymous"
        />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <FontAwesomeProvider>
          <FirebaseBootstrap />
          <AosProvider>
            <LoadingProvider locale={locale}>{children}</LoadingProvider>
          </AosProvider>
        </FontAwesomeProvider>
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
