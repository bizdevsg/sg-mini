import type { IndexSymbolsPageContent } from "../../shared/index-symbols-page";

export const idIndexSymbolsPageContent: IndexSymbolsPageContent = {
  meta: {
    title: "Simbol Index",
    description:
      "Daftar simbol index, simbol bulan kontrak, dan contoh pembacaan kode kontrak untuk membantu memahami instrumen index dan futures.",
  },
  breadcrumb: {
    education: "Edukasi",
    current: "Simbol Index",
  },
  hero: {
    eyebrow: "Edukasi Trading",
    title: "Simbol Index",
    description:
      "Halaman ini merangkum simbol index spot, futures, simbol bulan kontrak, dan contoh pembacaan kode kontrak secara lebih terstruktur.",
    primaryCta: "Lihat Simbol",
    secondaryCta: "Lihat Kontrak",
    badges: [
      "Referensi Simbol Index",
      "Kode Bulan Kontrak",
      "Contoh Pembacaan Kontrak",
    ],
  },
  sections: {
    symbolsTitle: "1 Simbol Index",
    symbolsSubtitle:
      "Daftar berikut merangkum kode simbol yang umum dipakai untuk index spot dan futures.",
    contractMonthsTitle: "2 Simbol Bulan Kontrak",
    contractMonthsSubtitle:
      "Setiap futures memakai kode bulan kontrak tertentu. Gunakan daftar ini untuk membaca simbol dengan benar.",
    contractExampleTitle: "Contoh Kontrak",
    contractExampleSubtitle:
      "Contoh berikut membantu memecah struktur kode kontrak menjadi bagian yang lebih mudah dipahami.",
  },
  symbols: [
    { code: "HSIV9", description: "Hang Seng Index (Futures) untuk kontrak Oktober 2009" },
    { code: "HSI", description: "Hang Seng Index (Spot)" },
    { code: "SN1Z9", description: "Nikkei 225 Index (Futures) untuk kontrak Desember 2009" },
    { code: "SNI", description: "Nikkei 225 Index (Spot)" },
    { code: "JKSCI", description: "Jakarta Composite Index (Spot)" },
    { code: "SISE4", description: "Straits Times Index (Spot)" },
    { code: "KCOM", description: "Kuala Lumpur Composite Index (Spot)" },
    { code: "SHICOM", description: "Shanghai Composite Index (Spot)" },
    { code: "SZICOM", description: "Shenzhen Composite Index (Spot)" },
    { code: "TOPX", description: "Tokyo Stock Price Index (Spot)" },
    { code: "BSET", description: "Bangkok Stock Price Index (Spot)" },
    { code: "KSCI", description: "Korea Stock Composite Index (Spot)" },
    { code: "DJIA", description: "Dow Jones Industrial Average (Spot)" },
    { code: "NDX", description: "Nasdaq 100 Index (Spot)" },
    { code: "NDXI", description: "Nasdaq Composite Index (Spot)" },
    { code: "SPX", description: "Standard & Poor's 500 Index (Spot)" },
    { code: "FTSE", description: "Financial Times Stock Exchange (Spot)" },
    { code: "DAX", description: "Deutscher Aktien Index / German Stock Index (Spot)" },
    { code: "NYSEI", description: "New York Stock Index (Spot)" },
    { code: "LGD", description: "Loco Gold London (Spot)" },
  ],
  contractMonths: [
    {
      title: "Hang Seng Futures",
      items: [
        { code: "F", month: "Januari" },
        { code: "G", month: "Februari" },
        { code: "H", month: "Maret" },
        { code: "J", month: "April" },
        { code: "K", month: "Mei" },
        { code: "M", month: "Juni" },
        { code: "N", month: "Juli" },
        { code: "Q", month: "Agustus" },
        { code: "U", month: "September" },
        { code: "V", month: "Oktober" },
        { code: "X", month: "November" },
        { code: "Z", month: "Desember" },
      ],
    },
    {
      title: "Nikkei 225 Futures",
      items: [
        { code: "H", month: "Maret" },
        { code: "M", month: "Juni" },
        { code: "U", month: "September" },
        { code: "Z", month: "Desember" },
      ],
    },
    {
      title: "Brent Crude Oil Futures",
      items: [
        { code: "F", month: "Januari" },
        { code: "G", month: "Februari" },
        { code: "H", month: "Maret" },
        { code: "J", month: "April" },
        { code: "K", month: "Mei" },
        { code: "M", month: "Juni" },
        { code: "N", month: "Juli" },
        { code: "Q", month: "Agustus" },
        { code: "U", month: "September" },
        { code: "V", month: "Oktober" },
        { code: "X", month: "November" },
        { code: "Z", month: "Desember" },
      ],
    },
  ],
  contractExample: [
    { code: "LCOPZ9", description: "Brent Crude Oil Contract" },
    { code: "LCOP", description: "Brent Crude Oil Code" },
    { code: "Z", description: "Futures contract untuk 2 bulan ke depan" },
    { code: "9", description: "Tahun" },
  ],
};
