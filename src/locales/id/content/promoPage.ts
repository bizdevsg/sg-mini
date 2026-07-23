import type { AppMessages } from "../../shared/messages";

export const idPromoPage: AppMessages["promoPage"] = {
  title: "Halaman Promo",
  description:
    "Kumpulan informasi promo, banner, program, dan informasi pendukung lainnya.",
  breadcrumb: "Halaman Promo",
  hero: {
    eyebrow: "Informasi Penting",
    title: "Halaman Promo",
    description:
      "Baca detail dari setiap banner promo atau informasi yang sedang ditampilkan oleh PT. Solid Gold Berjangka.",
    primaryCta: "Lihat daftar promo",
  },
  list: {
    title: "Daftar promo",
    description:
      "Pilih salah satu banner untuk melihat detail promo dan informasi yang tersedia.",
    readMore: "Baca detail",
    emptyTitle: "Belum ada informasi tersedia",
    emptyBody: "Saat ini belum ada banner promo aktif yang tersedia.",
    untitledFallback: "Promo tanpa judul",
  },
};
