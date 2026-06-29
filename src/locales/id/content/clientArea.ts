import type { AppMessages } from "../../shared/messages";

export const idClientArea: AppMessages["clientArea"] = {
  pageTitle: "Client Area",
  pageDescription:
    "Tampilan utama nasabah setelah login dengan ringkasan akun, aksi cepat, dan signal market.",
  login: {
    badge: "Portal Nasabah",
    title: "Masuk ke Client Area SG Berjangka",
    description:
      "Akses akun demo atau live Anda untuk memantau saldo, market watch, dan aktivitas transaksi dalam satu dashboard.",
    accountLabel: "Nomor akun atau email",
    accountPlaceholder: "Masukkan nomor akun atau email",
    passwordLabel: "Password",
    passwordPlaceholder: "Masukkan password Anda",
    rememberMe: "Ingat saya di perangkat ini",
    forgotPassword: "Lupa password?",
    primaryCta: "Masuk ke dashboard demo",
    secondaryCta: "Hubungi support",
    submitting: "Memeriksa akses...",
    helper:
      "Gunakan kredensial demo di bawah untuk masuk ke client area versi preview ini.",
    captchaTitle: "Verifikasi keamanan",
    captchaHelper:
      "Selesaikan reCAPTCHA sebelum masuk ke client area.",
    demoCredentialsTitle: "Akses demo cepat",
    demoCredentialsAccount: "Akun demo: BBH10158",
    demoCredentialsPassword: "Password: demo12345",
    errorRequired: "Masukkan nomor akun atau email beserta password Anda.",
    errorInvalidCredentials:
      "Kredensial tidak valid. Gunakan akun demo yang tersedia untuk preview ini.",
    errorCaptchaRequired: "Selesaikan verifikasi reCAPTCHA terlebih dahulu.",
    errorCaptchaFailed:
      "Verifikasi reCAPTCHA gagal. Coba ulangi pemeriksaan keamanan.",
    highlightsTitle: "Yang bisa Anda pantau",
    highlights: [
      "Ringkasan balance, equity, dan floating P/L real-time.",
      "Akses cepat ke deposit, withdraw, edukasi, dan produk.",
      "Market watch, berita, dan riwayat transaksi dalam area terpisah.",
    ],
    securityTitle: "Keamanan akun",
    securityBody:
      "Pastikan Anda hanya login melalui domain resmi dan jangan pernah membagikan OTP atau password kepada pihak lain.",
  },
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
        id: "transaction",
        label: "Transaksi",
        href: "#actions",
      },
      {
        id: "news",
        label: "Berita",
        href: "/news",
      },
      {
        id: "account",
        label: "Akun",
        href: "#account",
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
        id: "education",
        label: "Edukasi",
      },
      {
        id: "products",
        label: "Produk",
      },
      {
        id: "withdraw",
        label: "Withdraw",
      },
      {
        id: "deposit",
        label: "Deposit",
      },
      {
        id: "temporary",
        label: "Temporary",
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
    title: "Rekomendasi",
    cta: "Lihat semua",
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
