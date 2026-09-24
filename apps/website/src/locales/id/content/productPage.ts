import type { AppMessages } from "../../shared/messages";

export const idProductPage: AppMessages["productPage"] = {
    breadcrumb: "Produk",
    productsLabel: "Katalog Produk",
    categoryLabel: "Kategori Bursa",
    countLabel: "Produk",
    sourceLabel: "Sumber",
    viewDetailCta: "Lihat Detail",
    backToCatalogCta: "Kembali ke Katalog",
    descriptionTitle: "Deskripsi Produk",
    specificationTitle: "Spesifikasi Produk",
    emptyTitle: "Produk belum tersedia.",
    emptyBody: "Silakan coba lagi beberapa saat lagi.",
    categories: {
      multilateral: {
        title: "Produk Multilateral",
        description:
          "Daftar produk multilateral resmi yang ditampilkan dari katalog produk Solid Gold.",
        eyebrow: "Kategori JFX",
        summary:
          "Produk multilateral ini memuat spesifikasi kontrak resmi beserta detail penyerahan dan perdagangan untuk instrumen yang diperdagangkan di bursa.",
      },
      bilateral: {
        title: "Produk Bilateral",
        description:
          "Daftar produk bilateral resmi yang ditampilkan dari katalog produk Solid Gold.",
        eyebrow: "Kategori SPA",
        summary:
          "Produk bilateral ini merangkum spesifikasi perdagangan, margin, komisi, dan parameter transaksi untuk instrumen bilateral yang aktif.",
      },
    },
  };
