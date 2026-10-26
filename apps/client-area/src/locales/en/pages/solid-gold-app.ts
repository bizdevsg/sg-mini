import type { SolidGoldAppPageContent } from "../../shared/solid-gold-app-page";

export const enSolidGoldAppPageContent: SolidGoldAppPageContent = {
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
            href: "https://play.google.com/store/apps/details?id=com.solidgoldberjangka.minimicro&pcampaignid=web_share",
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
};
