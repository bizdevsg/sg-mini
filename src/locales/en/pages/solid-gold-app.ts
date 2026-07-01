import { getFramerImageUrl } from "@/lib/env";

import type { SolidGoldAppPageContent } from "../../shared/solid-gold-app-page";

export const enSolidGoldAppPageContent: SolidGoldAppPageContent = {
  meta: {
    title: "Official Solid App",
    description:
      "Download the Solid app to monitor the market and manage Solid Gold Berjangka trading activities more conveniently on Android and iOS.",
  },

  hero: {
    eyebrow: "Official Applications",
    title: "Trade more conveniently through the Solid app.",
    description:
      "The Solid app helps you monitor the market, track price movements, and manage Solid Gold Berjangka trading activities faster from a single application.",
    primaryCta: "Download on Play Store",
    secondaryCta: "Download on App Store",
    badges: [
      "Solid: Official Trading Platform",
      "Monitor the Market More Easily",
      "Available on Android & iOS",
    ],
    visualSrc: getFramerImageUrl(
      "852i2sfEYXSfE1r3eJjVmPA8KZE.webp?height=1020&width=750",
    ),
    visualAlt: "Solid app displayed on a mobile device",
  },

  platforms: {
    title: "Download the Solid App",
    subtitle:
      "Use the Solid app to monitor the market and manage your trading activities on Android or iPhone.",
    items: [
      {
        title: "Solid",
        description:
          "The official Solid Gold Berjangka trading platform to monitor market movement and manage transactions more conveniently in one app.",
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
    title: "Why Use the Solid App?",
    description:
      "The Solid app is built to help clients monitor the market and manage trading activity through a workflow that feels faster, clearer, and more convenient on mobile devices.",
    items: [
      {
        title: "Monitor Prices and Market Movement in Real Time",
        description:
          "Track price movement and current market conditions directly from the app, so you can stay closer to market changes when they matter.",
      },
      {
        title: "A More Practical Trading Process",
        description:
          "The trading flow is designed to feel simpler and more direct, helping you move into transaction activity without unnecessary steps.",
      },
      {
        title: "Manage Trading Activity in One Place",
        description:
          "From monitoring the market to handling trading activity, the key functions are available in one app for a more efficient user experience.",
      },
      {
        title: "Official Access with a More Reliable Experience",
        description:
          "As the official Solid Gold Berjangka app, Solid provides a more trusted experience that is aligned with the daily needs of active clients.",
      },
    ],
  },
};
