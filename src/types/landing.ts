import { getCdnAssetUrl } from "@/lib/env";

export type Testimonial = {
  name: string;
  role: string;
  quote: string;
};

export type Stat = {
  value: string;
  label: string;
};

export type SecurityItem = {
  title: string;
  body: string;
  variant: "featured" | "wallet" | "lock";
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
};

export type SpreadItem = {
  product: string;
  spread: string;
  size: string;
  swap: string;
};

export type RegulatorLogo = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export const navItems = [
  "Tentang",
  "Produk Kami",
  "Live Quote",
  "Download Platform",
  "Program Referral",
  "Blog",
];

export const stats: Stat[] = [
  { value: "24/5", label: "Customer Support" },
  { value: "25", label: "Tahun Pengalaman" },
  { value: "15 rb+", label: "Review Positif" },
  { value: "50+", label: "Penghargaan Resmi" },
];

export const testimonials: Testimonial[] = [
  {
    name: "Yudha Keling",
    role: "Influencer Keuangan",
    quote:
      "MIFX, M-nya itu memudahkan! Karena di mana lagi bisa trading forex dengan data lengkap, sinyal terkurasi, dan insight untuk bantu arahin strategi trading? Cuma di MIFX!",
  },
  {
    name: "Andy Senjaya",
    role: "Influencer Keuangan",
    quote:
      "Aplikasi MIFX punya semua yang diperlukan oleh para trader khususnya trader Indonesia. Mulai dari video edukasi sampai Trading Signal. Highly recommended!",
  },
  {
    name: "Theresa Learns",
    role: "Influencer Keuangan",
    quote:
      "Aku mulai pertama trading di MIFX pake demo akun sambil belajar, sampai sudah familiar baru masuk pakai uang asli. Trading forex di MIFX so far paling oke dan easy to use.",
  },
  {
    name: "Om Ben Trader",
    role: "Influencer Keuangan",
    quote:
      "Aplikasi nya mantap, mudah dipahami buat pemula Fitur nya juga lengkap Top banget dah mifx",
  },
  {
    name: "Dennis SLL",
    role: "Professional trader",
    quote:
      "Aplikasi MIFX bener-bener fungsional: deposit & WD gampang, tracking akun simpel, banyak hadiah. Tradingnya juga mulai dari Rp500rb & bisa microlot, pas buat pemula!",
  },
];

export const securityCards: SecurityItem[] = [
  {
    title: "Terpercaya & Diakui",
    body: "Platform Teregulasi BAPPEBTI yang berhasil meraih berbagai penghargaan.",
    variant: "featured",
    image: {
      src: "/assets/aed38b4d-ca53-447c-8250-59a03a7ea4eb.png",
      alt: "Ilustrasi penghargaan dan pengawasan regulator",
      width: 900,
      height: 640,
    },
  },
  {
    title: "Rekening Terpisah & Penarikan Dana Cepat",
    body: "Deposit/penarikan dana cepat & mudah, dengan dana yang disimpan di rekening terpisah.",
    variant: "wallet",
    image: {
      src: "/assets/6b4283d4-5ae9-43be-94dc-25c845136019.png",
      alt: "Ilustrasi dompet untuk penyimpanan dana nasabah",
      width: 1000,
      height: 1000,
    },
  },
  {
    title: "Sistem Keamanan Berstandar Internasional",
    body: "Trading lebih aman di platform yang telah bersertifikasi ISO 27001.",
    variant: "lock",
    image: {
      src: "/assets/0be6b5d6-eeda-4236-92c9-a1e119e30523.png",
      alt: "Ilustrasi gembok untuk sistem keamanan",
      width: 1000,
      height: 1000,
    },
  },
];

export const spreads: SpreadItem[] = [
  {
    product: "EURUSD",
    spread: "Mulai dari 0.3",
    size: "Mulai dari 0.01",
    swap: "Tersedia",
  },
  {
    product: "GBPUSD",
    spread: "Mulai dari 0.9",
    size: "Mulai dari 0.01",
    swap: "Tersedia",
  },
  {
    product: "USDJPY",
    spread: "Mulai dari 0.9",
    size: "Mulai dari 0.01",
    swap: "Tersedia",
  },
  {
    product: "Gold",
    spread: "Mulai dari $0.29",
    size: "Mulai dari 0.01",
    swap: "Tersedia",
  },
  {
    product: "Nasdaq",
    spread: "Mulai dari 1.1",
    size: "Mulai dari 0.01",
    swap: "Tersedia",
  },
];

export const regulatorLogos: RegulatorLogo[] = [
  {
    src: getCdnAssetUrl("logo-Bappebti.png"),
    alt: "Logo Bappebti",
    width: 1367,
    height: 327,
  },
  {
    src: getCdnAssetUrl("f6de89c6-20f7-43e5-87b2-170199c45ec7.avif"),
    alt: "Logo OJK",
    width: 1200,
    height: 522,
  },
  {
    src: getCdnAssetUrl("69cf4915-3cbc-48db-b8ea-2cc80c25e463.avif"),
    alt: "Logo Aspebtindo",
    width: 1574,
    height: 1694,
  },
  {
    src: getCdnAssetUrl("17a99617-1747-42ed-a450-2d0acb17aaa0.avif"),
    alt: "Logo KBI",
    width: 429,
    height: 189,
  },
  {
    src: getCdnAssetUrl("e9701fbd-3376-430c-9da2-496f090aecce.avif"),
    alt: "Logo JFX",
    width: 4393,
    height: 1390,
  },
  {
    src: getCdnAssetUrl("Logo-BI.avif"),
    alt: "Logo BI",
    width: 4393,
    height: 1390,
  },
];

export const legalItems = [
  "Badan Pengawas Perdagangan Berjangka Komoditi: Nomor 1156/BAPPEBTI/SI/3/2007",
  "Otoritas Jasa Keuangan: Nomor S-126/PM.02/2025",
  "Bank Indonesia: Nomor 27/663/DPPK/Srt/B",
  "Bursa Komoditi dan Derivatif Indonesia: S-373/PM.02/2025",
  "Bursa Berjangka Jakarta: Nomor SPAB-047/BBJ/07/02",
  "Kliring Berjangka Indonesia: Nomor 15/AK-KBI/V/2003",
];
