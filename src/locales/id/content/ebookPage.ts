import type { AppMessages } from "../../shared/messages";

export const idEbookPage: AppMessages["ebookPage"] = {
  title: "Ebook Trading Forex",
  description:
    "Kumpulan ebook trading untuk membantu trader memahami dasar market, manajemen risiko, dan penyusunan rencana trading.",
  breadcrumb: "Ebook",
  parentLabel: "Edukasi",
  detailCta: "Lihat Kategori",
  previewCta: "Lihat Detail",
  downloadCta: "Buka Ebook",
  backToCategoriesCta: "Kembali ke kategori",
  closeCta: "Tutup",
  hero: {
    eyebrow: "Pusat Materi",
    title:
      "Ebook trading yang ringkas, relevan, dan siap dipelajari kapan saja.",
    description:
      "Halaman ini merangkum materi baca yang cocok untuk pemula maupun trader aktif yang ingin memperkuat pemahaman market secara lebih terstruktur.",
    primaryCta: "Buka Akun",
    secondaryCta: "Masuk Area Klien",
  },
  libraryTitle: "Kategori Ebook",
  librarySubtitle:
    "Pilih kategori yang paling relevan, lalu buka daftar ebook di dalamnya langsung dari API library.",
  items: [
    {
      title: "Dasar-Dasar Trading Forex",
      description:
        "Mengenal pasangan mata uang, jam market, istilah utama, dan alur transaksi yang perlu dipahami trader pemula.",
      format: "PDF Guide",
      level: "Pemula",
      topics: ["Pair & Pip", "Sesi Market", "Dasar Order"],
    },
    {
      title: "Manajemen Risiko untuk Trader",
      description:
        "Panduan membatasi risiko, mengatur ukuran lot, menjaga rasio risk-reward, dan membangun disiplin trading.",
      format: "Risk Manual",
      level: "Menengah",
      topics: ["Risk Reward", "Lot Sizing", "Trading Discipline"],
    },
    {
      title: "Membaca Arah Market dengan Lebih Terstruktur",
      description:
        "Menyusun proses analisa yang lebih rapi melalui kombinasi level harga, momentum, dan skenario trading.",
      format: "Strategy Notes",
      level: "Menengah",
      topics: ["Market Structure", "Momentum", "Trade Plan"],
    },
  ],
  benefitsTitle: "Yang Akan Anda Dapatkan",
  benefits: [
    "Materi yang lebih terstruktur untuk membantu proses belajar mandiri.",
    "Pembahasan singkat namun fokus pada hal yang paling relevan untuk trader.",
    "Topik dasar, risiko, dan penyusunan rencana trading dalam satu halaman.",
  ],
};
