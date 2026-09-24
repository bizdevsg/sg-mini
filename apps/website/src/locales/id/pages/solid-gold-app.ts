import { getFramerImageUrl } from "@/lib/env";

import type { SolidGoldAppPageContent } from "../../shared/solid-gold-app-page";

export const idSolidGoldAppPageContent: SolidGoldAppPageContent = {
  meta: {
    title: "Aplikasi Resmi Solid",
    description:
      "Download aplikasi Solid untuk memantau market dan menjalankan aktivitas trading Solid Gold Berjangka dengan lebih praktis di Android dan iOS.",
  },

  hero: {
    eyebrow: "Aplikasi Resmi",
    title: "Trading lebih praktis langsung dari aplikasi Solid.",
    description:
      "Aplikasi Solid membantu Anda memantau market, melihat pergerakan harga, dan menjalankan aktivitas trading Solid Gold Berjangka dengan lebih cepat dari satu aplikasi.",
    primaryCta: "Download di Play Store",
    secondaryCta: "Download di App Store",
    badges: [
      "Solid: Platform Trading Resmi",
      "Pantau Market Lebih Mudah",
      "Tersedia untuk Android & iOS",
    ],
    visualSrc: getFramerImageUrl(
      "852i2sfEYXSfE1r3eJjVmPA8KZE.webp?height=1020&width=750",
    ),
    visualAlt: "Tampilan aplikasi Solid pada perangkat mobile",
  },

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
    title: "Kenapa Menggunakan Aplikasi Solid?",
    description:
      "Aplikasi Solid dirancang untuk membantu nasabah memantau market dan menjalankan aktivitas trading dengan alur yang lebih cepat, jelas, dan nyaman dari perangkat mobile.",
    items: [
      {
        title: "Pantau Harga dan Market Secara Real Time",
        description:
          "Pergerakan harga dan kondisi market dapat dipantau langsung melalui aplikasi, sehingga Anda bisa mengikuti perubahan pasar lebih cepat saat dibutuhkan.",
      },
      {
        title: "Eksekusi Trading Lebih Praktis",
        description:
          "Proses trading dirancang agar lebih ringkas dan mudah dijalankan, membantu Anda masuk ke aktivitas transaksi tanpa alur yang berbelit.",
      },
      {
        title: "Akses Aktivitas Trading Dalam Satu Tempat",
        description:
          "Mulai dari memantau market hingga mengelola aktivitas trading, semuanya tersedia dalam satu aplikasi agar penggunaan terasa lebih efisien.",
      },
      {
        title: "Aplikasi Resmi yang Lebih Aman dan Terarah",
        description:
          "Sebagai aplikasi resmi Solid Gold Berjangka, Solid memberikan akses yang lebih sesuai untuk kebutuhan nasabah dengan pengalaman penggunaan yang lebih terpercaya.",
      },
    ],
  },
};
