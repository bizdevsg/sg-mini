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
  hoverSrc?: string;
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
      "Platform ini memudahkan trader dengan data pasar yang lengkap, sinyal terkurasi, dan insight yang membantu menyusun strategi trading dengan lebih percaya diri.",
  },
  {
    name: "Andy Senjaya",
    role: "Influencer Keuangan",
    quote:
      "Aplikasinya punya fitur yang relevan untuk trader Indonesia, mulai dari materi edukasi sampai trading signal. Sangat layak dipertimbangkan.",
  },
  {
    name: "Theresa Learns",
    role: "Influencer Keuangan",
    quote:
      "Saya memulai dari akun demo sambil belajar, lalu beralih ke akun live setelah lebih paham. Alurnya terasa rapi dan tetap nyaman dipakai untuk trading harian.",
  },
  {
    name: "Om Ben Trader",
    role: "Influencer Keuangan",
    quote:
      "Aplikasinya mudah dipahami untuk pemula, fiturnya juga cukup lengkap untuk kebutuhan belajar sekaligus eksekusi trading.",
  },
  {
    name: "Dennis SLL",
    role: "Professional trader",
    quote:
      "Fungsinya terasa praktis untuk kebutuhan trader aktif: pemantauan akun sederhana, proses transaksi jelas, dan ukuran lot yang ramah untuk pemula.",
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
    src: "/assets/regulator/KEMENDAG-1 2.png",
    hoverSrc: "/assets/regulator/KEMENDAG 1-color.png",
    alt: "Logo Bappebti",
    width: 308,
    height: 90,
  },
  {
    src: "/assets/regulator/OJK_Logo-3 2.png",
    hoverSrc: "/assets/regulator/OJK_Logo-3 2-color-fixed.png",
    alt: "Logo OJK",
    width: 244,
    height: 106,
  },
  {
    src: "/assets/regulator/aspeb-logo-2 2.png",
    hoverSrc: "/assets/regulator/aspeb-logo 1-color.png",
    alt: "Logo Aspebtindo",
    width: 90,
    height: 96,
  },
  {
    src: "/assets/regulator/Kliring Berjangka Logo-1 1.png",
    hoverSrc: "/assets/regulator/Kliring Berjangka Logo-1 1-color-fixed.png",
    alt: "Logo KBI",
    width: 212,
    height: 118,
  },
  {
    src: "/assets/regulator/logo JFX-black 3.png",
    hoverSrc: "/assets/regulator/logo JFX 1-color.png",
    alt: "Logo JFX",
    width: 284,
    height: 90,
  },
  {
    src: "/assets/regulator/BI_Logo-3 2.png",
    hoverSrc: "/assets/regulator/BI_Logo-2 4-color-fixed.png",
    alt: "Logo BI",
    width: 335,
    height: 106,
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
