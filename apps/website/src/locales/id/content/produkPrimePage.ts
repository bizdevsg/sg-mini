import type { AppMessages } from "../../shared/messages";

export const idProdukPrimePage: AppMessages["produkPrimePage"] = {
  title: "Akun Prime",
  description:
    "Akun Prime Solid Gold Berjangka untuk nasabah yang menginginkan pengalaman transaksi dengan pendampingan yang lebih personal.",
  breadcrumb: "Akun Prime",
  hero: {
    eyebrow: "Akun Prime",
    title: "Pendampingan Transaksi yang Lebih Personal",
    description:
      "Akun Prime dirancang untuk nasabah yang ingin berdiskusi lebih mendalam mengenai kebutuhan transaksi berjangka bersama tim Solid Gold Berjangka.",
    primaryCta: "Buka Akun Sekarang",
    secondaryCta: "Hubungi Kami",
    badges: ["Setara Mini Account", "Minimum 0,1 Lot", "Pendampingan Lebih Personal"],
  },
  benefitsTitle: "Mengenal Akun Prime",
  benefitsDescription:
    "Akun Prime adalah nama layanan kami untuk Mini Account — cocok bagi nasabah yang ingin mulai bertransaksi berjangka dengan modal dan volume yang lebih kecil, didampingi tim Solid Gold Berjangka.",
  benefits: [
    {
      title: "Modal Awal Terjangkau",
      description:
        "Deposit margin awal mulai dari USD 500 dengan fixed rate USD 1 = IDR 10.000, sesuai ketentuan Mini Account CDD Sederhana.",
    },
    {
      title: "Posisi 0,1–0,9 Lot",
      description:
        "Volume transaksi berkisar minimum 0,1 lot hingga maksimum 0,9 lot selama posisi berjalan, mengikuti Trading Rules Mini Account yang berlaku.",
    },
    {
      title: "Kontrak Emas & Brent Crude Oil",
      description:
        "Tersedia kontrak XUL10 (Emas Loco London) dan BCO10_BBJ (Brent Crude Oil) dengan proses CDD Sederhana bagi nasabah perseorangan.",
    },
  ],
  specsLink: {
    label: "Lihat Trading Rules Mini Account",
    href: "/education/trading-rules",
  },
  cta: {
    title: "Tertarik dengan Akun Prime?",
    description:
      "Hubungi tim kami untuk mendapatkan penjelasan mengenai Akun Prime dan proses pembukaan akun.",
    buttonLabel: "Daftar Sekarang",
  },
};
