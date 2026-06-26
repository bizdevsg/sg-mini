import type { AppMessages } from "../../shared/messages";

export const idClientArea: AppMessages["clientArea"] = {
  pageTitle: "Client Area",
  pageDescription:
    "Tampilan utama nasabah setelah login dengan ringkasan akun, aksi cepat, dan signal market.",
  user: {
    name: "Anita",
    role: "Akun Demo Saya",
    accountId: "1003713406",
    status: "Demo",
  },
  sidebar: {
    label: "Navigasi client",
    backToWebsite: "Kembali ke website utama",
    tradeCta: "Trade",
    navItems: [
      {
        id: "home",
        label: "Beranda",
        href: "#overview",
      },
      {
        id: "market",
        label: "Pasar",
        href: "#market",
      },
      {
        id: "services",
        label: "Lainnya",
        href: "#services",
      },
    ],
  },
  topbar: {
    supportLabel: "Download Aplikasi MIFX",
    supportPhone: "021-50996650",
    logoutLabel: "Log Out",
    primaryCta: "Buka Akun Live",
    accountMode: "Demo",
    notificationCount: "1",
    breadcrumb: "1003713406",
    navItems: [
      {
        label: "PRODUK",
        href: "/produk/multilateral",
      },
      {
        label: "EDUKASI",
        href: "/education/cara-memulai",
      },
      {
        label: "BERITA",
        href: "/news",
      },
      {
        label: "TENTANG",
        href: "/about",
      },
    ],
  },
  accountPanel: {
    eyebrow: "Akun Demo Saya",
    title: "1003713406",
    primaryCta: "Ubah Demo Balance",
    items: [
      {
        id: "balance",
        label: "Balance",
        value: "$78.23",
      },
      {
        id: "equity",
        label: "Equity",
        value: "$78.23",
      },
    ],
  },
  promoPanel: {
    eyebrow: "MIFX Priority",
    title: "Benefit eksklusif dan akses prioritas untuk client aktif.",
    description:
      "Siapkan area promo utama untuk campaign, loyalty, atau edukasi yang ingin ditonjolkan setelah user login.",
    cta: "Pelajari sekarang",
  },
  quickActions: {
    items: [
      {
        id: "deposit",
        label: "Deposit",
      },
      {
        id: "withdraw",
        label: "Tarik Dana",
      },
      {
        id: "overbook",
        label: "Overbook",
      },
    ],
  },
  shortcutPanel: {
    items: [
      {
        id: "signal",
        label: "Trading Signal",
      },
      {
        id: "mover",
        label: "Top Mover",
      },
      {
        id: "trending",
        label: "Trending",
      },
      {
        id: "products",
        label: "Produk",
      },
      {
        id: "education",
        label: "Edukasi",
      },
      {
        id: "rewards",
        label: "Rewards",
      },
      {
        id: "deposit",
        label: "Deposit",
      },
      {
        id: "more",
        label: "Lainnya",
      },
    ],
  },
  signalsPanel: {
    title: "Signal Produk Terpopuler",
    cta: "Lihat Semua",
    items: [
      {
        symbol: "XAUUSD",
        title: "Gold",
        time: "15:56 WIB",
        bias: "sell",
      },
      {
        symbol: "EURUSD",
        title: "EURUSD",
        time: "16:01 WIB",
        bias: "buy",
      },
      {
        symbol: "USDJPY",
        title: "USDJPY",
        time: "16:05 WIB",
        bias: "buy",
      },
      {
        symbol: "GBPUSD",
        title: "GBPUSD",
        time: "16:04 WIB",
        bias: "buy",
      },
      {
        symbol: "OIL",
        title: "Oil",
        time: "16:07 WIB",
        bias: "sell",
      },
    ],
  },
  servicePanel: {
    title: "Layanan Nasabah",
    items: [
      {
        label: "Live Quote",
        description: "Pantau harga real-time untuk keputusan entry yang lebih cepat.",
        cta: "Buka market feed",
      },
      {
        label: "Kalender Ekonomi",
        description: "Lihat agenda high impact yang bisa memengaruhi volatilitas harian.",
        cta: "Lihat jadwal",
      },
      {
        label: "Bantuan Client Service",
        description: "Hubungi support untuk kendala login, transaksi, atau verifikasi data.",
        cta: "Hubungi support",
      },
    ],
  },
};
