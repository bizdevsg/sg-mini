import type { AppMessages } from "../../shared/messages";

export const idNewsBrowser: AppMessages["newsBrowser"] = {
    categories: {
      Index: "Indeks",
      Commodity: "Komoditas",
      Currencies: "Mata Uang",
      "Global & Ekonomi": "Global & Ekonomi",
      "Fiscal & Moneter": "Fiskal & Moneter",
      "Analisis Market": "Analisis Market",
    },
    filterModal: {
      title: "Filter Berita",
      subtitle: "Sesuaikan feed berita Anda",
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
      available: "berita tersedia",
      fallback: "Menampilkan berita cadangan",
      articlesInCategory: "berita di kategori",
    },
    pagination: {
      template: "Halaman {current} dari {total}",
    },
    emptyFiltered: "Coba kata kunci atau kategori lain.",
    readArticle: "Baca Artikel",
  };
