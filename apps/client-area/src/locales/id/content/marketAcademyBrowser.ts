import type { AppMessages } from "../../shared/messages";

export const idMarketAcademyBrowser: AppMessages["marketAcademyBrowser"] = {
  categories: {},
  filterModal: {
    title: "Filter Artikel",
    subtitle: "Sesuaikan feed Market Academy Anda",
    sortBy: "Urutkan",
    newest: "Terbaru",
    oldest: "Terlama",
    period: "Periode",
    all: "Semua",
    today: "Hari Ini",
    week: "Minggu Ini",
    month: "Bulan Ini",
    apply: "Terapkan",
    reset: "Reset",
    close: "Tutup",
  },
  summary: {
    category: "kategori",
    available: "artikel tersedia",
    fallback: "Belum ada artikel yang tersedia saat ini",
    articlesInCategory: "artikel di kategori",
  },
  pagination: {
    template: "Halaman {current} dari {total}",
  },
  emptyFiltered: "Coba kata kunci atau kategori lain.",
  readArticle: "Baca Artikel",
};
