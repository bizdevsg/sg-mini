import { getFramerImageUrl } from "@/lib/env";

import type { SolidGoldAppPageContent } from "../../shared/solid-gold-app-page";

export const enSolidGoldAppPageContent: SolidGoldAppPageContent = {
  meta: {
    title: "Official SG Berjangka & Solid Gold Apps",
    description:
      "Explore the official Solid Gold Berjangka applications for market information through SG Berjangka and seamless trading access through the Solid app on Android and iOS.",
  },

  hero: {
    eyebrow: "Official Applications",
    title: "Access market information and trading activities in one place.",
    description:
      "Solid Gold Berjangka provides two official applications with different functions. SG Berjangka delivers market news and analysis, while Solid provides convenient access for trading activities.",
    primaryCta: "Download on Play Store",
    secondaryCta: "Download on App Store",
    badges: [
      "SG Berjangka: Market News & Analysis",
      "Solid: Trading Platform",
      "Available on Android & iOS",
    ],
    visualSrc: getFramerImageUrl(
      "852i2sfEYXSfE1r3eJjVmPA8KZE.webp?height=1020&width=750",
    ),
    visualAlt:
      "Official Solid Gold Berjangka applications displayed on a mobile device",
  },

  platforms: {
    title: "Choose the Application That Fits Your Needs",
    subtitle:
      "Access market information and manage your trading activities through the official Solid Gold Berjangka applications. Available for Android and iOS devices.",
    items: [
      {
        title: "SG Berjangka",
        description:
          "A market information application providing the latest news, analysis, and insights related to futures trading in one platform.",
        availability: ["Android", "iPhone & iPad"],
        stores: [
          {
            label: "Open Play Store",
            href: "https://play.google.com/store/apps/details?id=com.nm23.sgberjangkaapps&hl=id",
            icon: "google-play",
          },
          {
            label: "Open App Store",
            href: "https://apps.apple.com/id/app/sg-berjangka/id6760511838?l=id",
            icon: "apple",
          },
        ],
      },
      {
        title: "Solid",
        description:
          "The official Solid Gold Berjangka trading platform that provides easy access to monitor markets and perform transactions conveniently.",
        availability: ["Android", "iPhone & iPad"],
        stores: [
          {
            label: "Open Play Store",
            href: "https://play.google.com/store/apps/details?id=com.solidgoldberjangka.minimicro&hl=id",
            icon: "google-play",
          },
          {
            label: "Open App Store",
            href: "https://apps.apple.com/id/app/solid/id6756168987?l=id",
            icon: "apple",
          },
        ],
      },
    ],
  },

  benefits: {
    title: "Key Benefits of Solid Gold Berjangka Applications",
    items: [
      "Stay updated with the latest market news, articles, and analysis through the SG Berjangka application.",
      "Access the Solid trading platform to monitor markets and manage trading activities more conveniently.",
      "Download the official applications through Google Play Store and App Store for a secure and reliable experience.",
    ],
  },
};
