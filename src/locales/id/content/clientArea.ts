import type { AppMessages } from "../../shared/messages";

export const idClientArea: AppMessages["clientArea"] = {
  pageTitle: "Client Area",
  pageDescription:
    "Tampilan utama nasabah setelah login dengan ringkasan akun, aksi cepat, dan signal market.",
  login: {
    badge: "Portal Nasabah",
    title: "Masuk Client Area",
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
    submitting: "Memverifikasi akun...",
    helper:
      "Gunakan kredensial demo di bawah untuk masuk ke client area versi preview ini.",
    captchaTitle: "Verifikasi keamanan",
    captchaHelper: "Selesaikan reCAPTCHA sebelum masuk ke client area.",
    demoCredentialsTitle: "Akses demo cepat",
    demoCredentialsAccount: "Akun demo: BBH10158",
    demoCredentialsPassword: "Password: demo12345",
    errorRequired: "Masukkan nomor akun atau email beserta password Anda.",
    errorInvalidCredentials:
      "Nomor akun, email, atau password yang Anda masukkan tidak sesuai. Silakan periksa kembali dan coba lagi.",
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
        id: "ebook",
        label: "Ebook",
        href: "/ebook",
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
    logoutModal: {
      title: "Keluar dari Client Area?",
      description:
        "Sesi Anda saat ini akan diakhiri dan Anda akan diarahkan kembali ke halaman login.",
      cancelLabel: "Batal",
      confirmLabel: "Ya, keluar",
      submittingLabel: "Sedang keluar...",
    },
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
        label: "Ebook",
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
        description:
          "Pantau harga real-time untuk keputusan entry yang lebih cepat.",
        cta: "Buka market feed",
      },
      {
        label: "Kalender Ekonomi",
        description:
          "Lihat agenda high impact yang bisa memengaruhi volatilitas harian.",
        cta: "Lihat jadwal",
      },
      {
        label: "Bantuan Client Service",
        description:
          "Hubungi support untuk kendala login, transaksi, atau verifikasi data.",
        cta: "Hubungi support",
      },
    ],
  },
  accountPage: {
    activeAccount: "Akun aktif",
    backLabel: "Back",
    pendingSectionNote:
      "Detail untuk section ini menyusul. Untuk sekarang fokusnya baru di Data Pribadi.",
    saveLabel: "Simpan",
    sections: {
      personal: "Data Pribadi",
      purpose: "Tujuan Pembukaan Rekening",
      emergency: "Data Darurat Yang Bisa Dihubungi",
      job: "Data Pekerjaan",
      wealth: "Data Kekayaan",
    },
    menuItems: {
      profile: "Profil",
      referral: "Referral SG Solid",
      documentApproval: "Dokumen Persetujuan",
      dailyStatement: "Daily Statement",
      withdrawal: "Withdrawal",
      deposit: "Deposit",
    },
    fields: {
      fullName: "Nama Lengkap",
      email: "Email",
      birthPlace: "Tempat Lahir",
      birthDate: "Tanggal Lahir",
      identityNumber: "No. Identitas (KTP / Paspor)",
      taxNumber: "No. NPWP",
      gender: "Jenis Kelamin",
      maritalStatus: "Status Perkawinan",
      spouseName: "Nama Istri / Suami",
      homeAddress: "Alamat Rumah",
      rt: "RT",
      rw: "RW",
      province: "Provinsi",
      city: "Kabupaten / Kota",
      subdistrict: "Kelurahan",
      postalCode: "Kode Pos",
      phone: "No. Handphone",
      openingPurpose: "Tujuan Pembukaan Rekening",
      investmentExperience: "Pengalaman Investasi",
      investmentField: "Bidang Investasi",
      futuresExperience: "Pengalaman Transaksi Perdagangan Berjangka",
      familyAffiliation:
        "Memiliki keluarga yang bekerja di BAPPEBTI / Bursa Berjangka / Lembaga Kliring Berjangka",
      familyAffiliationDetail: "Keterangan",
      bankruptStatus: "Apakah Anda telah dinyatakan pailit oleh Pengadilan",
      emergencyName: "Nama",
      emergencyAddress: "Alamat Rumah",
      emergencyNeighborhood: "RT / RW",
      emergencyProvince: "Provinsi",
      emergencyCity: "Kabupaten / Kota",
      emergencySubdistrict: "Kelurahan",
      emergencyPostalCode: "Kode Pos",
      emergencyPhone: "No. Telepon",
      occupation: "Pekerjaan",
      companyName: "Nama Perusahaan",
      businessSector: "Bidang Usaha",
      position: "Jabatan",
      yearsWorking: "Lama Bekerja",
      previousOffice: "Kantor Sebelumnya",
      officeAddress: "Alamat Kantor",
      officePostalCode: "Kode Pos",
      officePhone: "No. Telepon Kantor",
      annualIncome: "Penghasilan Pertahun",
      houseLocation: "Rumah, Lokasi",
      njop: "Nilai Jual Objek Pajak (NJOP)",
      bankDeposit: "Deposit Bank",
      amount: "Jumlah",
      otherAssets: "Lainnya",
      occupationOther: "Lainnya, sebutkan",
    },
    options: {
      binary: [
        {
          value: "yes",
          label: "Ya",
        },
        {
          value: "no",
          label: "Tidak",
        },
      ],
      purpose: [
        {
          value: "hedging",
          label: "Lindung Nilai",
        },
        {
          value: "speculation",
          label: "Spekulasi",
        },
        {
          value: "other",
          label: "Lainnya,",
        },
      ],
      investmentExperience: [
        {
          value: "yes",
          label: "Ya, Bidang:",
        },
        {
          value: "no",
          label: "Tidak",
        },
      ],
      occupation: [
        {
          value: "private",
          label: "Swasta",
        },
        {
          value: "entrepreneur",
          label: "Wiraswasta",
        },
        {
          value: "homemaker",
          label: "Ibu RT",
        },
        {
          value: "professional",
          label: "Professional",
        },
        {
          value: "government",
          label: "Peg. Negeri",
        },
        {
          value: "stateOwned",
          label: "Peg. BUMN",
        },
        {
          value: "student",
          label: "Mahasiswa",
        },
        {
          value: "other",
          label: "Lainnya, sebutkan",
        },
      ],
      annualIncome: [
        {
          value: "100to250",
          label: "Antara Rp 100 - 250 Juta",
        },
        {
          value: "250to500",
          label: "Antara Rp 250 - 500 Juta",
        },
        {
          value: "gt500",
          label: "Diatas Rp 500 Juta",
        },
      ],
    },
  },
  referralPage: {
    title: "Kode Referal",
    description:
      "Ajak teman untuk bergabung dan nikmati reward dari aktivitas trading mereka.",
    hero: {
      eyebrow: "Program Referral SG Solid",
      title: "Ajak Teman,\nDapatkan Reward",
      description:
        "Bagikan peluang ke jaringan kamu dan nikmati komisi dari teman yang aktif.",
      cta: "Daftar Sekarang",
      brandAlt: "PT Solid Gold Berjangka",
      visualAlt: "Visual program referral SG Solid",
    },
    stepsTitle: "Cara Kerja Program Referral SG Solid",
    steps: [
      "Dapatkan link atau kode referal dari akun SG Solid Anda.",
      "Bagikan kepada calon pengguna.",
      "Pengguna mendaftar akun trading melalui referral Anda.",
      "Anda memperoleh komisi dari aktivitas trading sesuai ketentuan yang berlaku.",
    ],
    closing:
      "Segera bergabung dengan Program Referral dan mulai bagikan link Anda untuk mendapatkan keuntungan. Daftarkan diri Anda sekarang dan maksimalkan peluang melalui Program Referral SG Solid.",
  },
};
