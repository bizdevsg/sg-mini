import { getFramerImageUrl } from "@/lib/env";

import type { SolidGoldAppPageContent } from "../../shared/solid-gold-app-page";

export const idSolidGoldAppPageContent: SolidGoldAppPageContent = {
  meta: {
    title: "Aplikasi Resmi SG Berjangka & Solid Gold",
    description:
      "Temukan aplikasi resmi Solid Gold Berjangka untuk mendapatkan informasi pasar melalui SG Berjangka dan melakukan aktivitas trading melalui aplikasi Solid di Android dan iOS.",
  },

  hero: {
    eyebrow: "Aplikasi Resmi",
    title: "Akses informasi pasar dan aktivitas trading dalam satu genggaman.",
    description:
      "Solid Gold Berjangka menghadirkan dua aplikasi resmi dengan fungsi berbeda. SG Berjangka menyediakan berita dan analisis pasar, sementara Solid memberikan akses praktis untuk aktivitas trading.",
    primaryCta: "Download di Play Store",
    secondaryCta: "Download di App Store",
    badges: [
      "SG Berjangka: Berita & Analisis Pasar",
      "Solid: Platform Trading",
      "Tersedia untuk Android & iOS",
    ],
    visualSrc: getFramerImageUrl(
      "852i2sfEYXSfE1r3eJjVmPA8KZE.webp?height=1020&width=750",
    ),
    visualAlt:
      "Tampilan aplikasi resmi Solid Gold Berjangka pada perangkat mobile",
  },

  platforms: {
    title: "Pilih Aplikasi Sesuai Kebutuhan Anda",
    subtitle:
      "Nikmati kemudahan mengakses informasi pasar dan menjalankan aktivitas trading melalui aplikasi resmi Solid Gold Berjangka. Tersedia untuk perangkat Android dan iOS.",
    items: [
      {
        title: "SG Berjangka",
        description:
          "Aplikasi informasi pasar yang menyediakan berita terkini, analisis, dan insight seputar perdagangan berjangka dalam satu platform.",
        availability: ["Android", "iPhone & iPad"],
        stores: [
          {
            label: "Buka Play Store",
            href: "https://play.google.com/store/apps/details?id=com.nm23.sgberjangkaapps&hl=id",
            icon: "google-play",
          },
          {
            label: "Buka App Store",
            href: "https://apps.apple.com/id/app/sg-berjangka/id6760511838?l=id",
            icon: "apple",
          },
        ],
      },
      {
        title: "Solid",
        description:
          "Platform trading resmi Solid Gold Berjangka yang memberikan akses mudah untuk memantau pasar dan melakukan transaksi secara praktis.",
        availability: ["Android", "iPhone & iPad"],
        stores: [
          {
            label: "Buka Play Store",
            href: "https://play.google.com/store/apps/details?id=com.solidgoldberjangka.minimicro&hl=id",
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

  benefits: {
    title: "Keunggulan Aplikasi Resmi Solid Gold Berjangka",
    items: [
      "Dapatkan informasi terbaru mengenai pasar melalui berita dan analisis yang tersedia di aplikasi SG Berjangka.",
      "Akses platform trading Solid untuk memantau pasar dan menjalankan aktivitas transaksi dengan lebih mudah.",
      "Nikmati kemudahan akses melalui aplikasi resmi yang tersedia di Google Play Store dan App Store.",
    ],
  },
};
