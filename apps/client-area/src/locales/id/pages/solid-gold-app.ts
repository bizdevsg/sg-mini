import type { SolidGoldAppPageContent } from "../../shared/solid-gold-app-page";

export const idSolidGoldAppPageContent: SolidGoldAppPageContent = {
  platforms: {
    title: "Download Aplikasi Solid",
    subtitle:
      "Gunakan aplikasi Solid untuk memantau market dan mengelola aktivitas trading Anda melalui perangkat Android atau iPhone.",
    items: [
      {
        title: "Solid",
        description:
          "Platform trading resmi Solid Gold Berjangka untuk memantau pergerakan market dan melakukan transaksi dengan lebih praktis dalam satu aplikasi.",
        availability: ["Android", "iPhone & iPad"],
        stores: [
          {
            label: "Buka Play Store",
            href: "https://play.google.com/store/apps/details?id=com.solidgoldberjangka.minimicro&pcampaignid=web_share",
            icon: "google-play",
          },
          {
            label: "Buka App Store",
            href: "https://apps.apple.com/id/app/solid/id6756168987?l=id",
            icon: "apple",
          },
        ],
      },
    ],
  },
};
