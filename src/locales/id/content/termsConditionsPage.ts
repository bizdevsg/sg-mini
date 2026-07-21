import type { AppMessages } from "../../shared/messages";

export const idTermsConditionsPage: AppMessages["termsConditionsPage"] = {
  title: "Syarat dan Ketentuan",
  description:
    "Kumpulan informasi syarat dan ketentuan dari banner promosi, program, dan informasi pendukung lainnya.",
  breadcrumb: "Syarat dan Ketentuan",
  hero: {
    eyebrow: "Informasi Penting",
    title: "Halaman Syarat dan Ketentuan",
    description:
      "Baca detail syarat dan ketentuan dari setiap banner, promo, atau informasi yang sedang ditampilkan oleh PT. Solid Gold Berjangka.",
    primaryCta: "Lihat daftar informasi",
  },
  list: {
    title: "Daftar informasi",
    description:
      "Pilih salah satu banner untuk melihat syarat, ketentuan, dan detail informasi yang tersedia.",
    readMore: "Baca detail",
    emptyTitle: "Belum ada informasi tersedia",
    emptyBody:
      "Saat ini belum ada banner aktif yang memiliki halaman syarat dan ketentuan.",
    untitledFallback: "Informasi tanpa judul",
  },
};
