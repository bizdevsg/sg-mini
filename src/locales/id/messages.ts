import { getCdnAssetUrl } from "@/lib/env";

import type { AppMessages } from "../shared/messages";

export const idMessages: AppMessages = {
  app: {
    title: "SGB Mini",
    description:
      "Landing page SGB Mini dengan live quote, informasi spread, dan konten trading berbahasa Indonesia.",
    brandName: "Solid Gold Berjangka",
    brandWordmark: "Solid",
    homeLabel: "Kembali ke beranda",
  },
  navbar: {
    login: "Masuk",
    openAccount: "Daftar",
    switchLocaleLabel: "Ganti ke English",
    switchLocaleIconAlt: "Ikon bendera Amerika Serikat",
    openMenuLabel: "Buka menu navigasi",
    closeMenuLabel: "Tutup menu navigasi",
    menuGroups: [
      {
        label: "Produk",
        items: [
          {
            label: "Produk Multilateral",
            href: "/produk/multilateral",
          },
          { label: "Produk Bilateral", href: "/produk/bilateral" },
          { label: "Aplikasi Solid Gold" },
          { label: "Live Quote", href: "/live-quote" },
        ],
      },
      {
        label: "Edukasi",
        items: [{ label: "Cara Memulai" }, { label: "Ebook", href: "/ebook" }],
      },
      {
        label: "Berita",
        items: [
          { label: "Berita Terkini", href: "/news" },
          { label: "Kalender Ekonomi", href: "/economic-calendar" },
          { label: "Historical Data", href: "/historical-data" },
        ],
      },
      {
        label: "Tentang",
        href: "/about",
      },
    ],
  },
  hero: {
    titleLead: "20 Tahun Dipercaya",
    titleBody: "Oleh Ribuan Trader Indonesia",
    cta: "Mulai Trading",
    visualAlt: "Visual aplikasi trading di ponsel",
  },
  regulator: {
    eyebrow: "Teregulasi resmi oleh",
  },
  trustStats: {
    title: "Trading di Platform Yang Aman & Terpercaya",
    subtitle:
      "SG Mini menjadi platform andalan untuk trading forex dan komoditi dengan volume transaksi terbesar di Indonesia.",
    stats: [
      { value: "24/5", label: "Customer Support" },
      { value: "25", label: "Tahun Pengalaman" },
      { value: "15 rb+", label: "Review Positif" },
      { value: "50+", label: "Penghargaan Resmi" },
    ],
  },
  security: {
    title: "Keamanan dan Legalitas",
    subtitle:
      "Trading lebih aman dengan perlindungan dana nasabah, pengawasan regulator, dan sistem keamanan berstandar internasional.",
    cards: [
      {
        title: "Terpercaya & Diakui",
        body: "Platform teregulasi BAPPEBTI yang berhasil meraih berbagai penghargaan.",
        variant: "featured",
        image: {
          src: getCdnAssetUrl("aed38b4d-ca53-447c-8250-59a03a7ea4eb.avif"),
          alt: "Ilustrasi penghargaan dan pengawasan regulator",
          width: 900,
          height: 640,
        },
      },
      {
        title: "Rekening Terpisah & Penarikan Dana Cepat",
        body: "Deposit dan penarikan dana cepat dan mudah, dengan dana yang disimpan di rekening terpisah.",
        variant: "wallet",
        image: {
          src: getCdnAssetUrl("6b4283d4-5ae9-43be-94dc-25c845136019.avif"),
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
          src: getCdnAssetUrl("0be6b5d6-eeda-4236-92c9-a1e119e30523.avif"),
          alt: "Ilustrasi gembok untuk sistem keamanan",
          width: 1000,
          height: 1000,
        },
      },
    ],
  },
  spread: {
    title: "Maksimalkan Potensi Profit Dengan Spread Kompetitif",
    subtitle:
      "Maksimalkan potensi profit dengan spread dan biaya komisi yang rendah.",
    cta: "Mulai Trading Sekarang",
    items: [
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
    ],
    labels: {
      product: "Produk",
      targetSpread: "Target Spread",
      transactionSize: "Ukuran Transaksi",
      freeSwap: "Free Swap",
    },
  },
  finalCta: {
    title: "Sekarang Saatnya",
    subTitle: "Trading Forex dengan SG Mini",
    cta: "Mulai Trading Forex",
    companyTitle: "MIFX",
    companyItems: [
      "Tentang",
      "Produk Kami",
      "Live Quote",
      "Download Platform",
      "Program Referral",
      "Blog",
    ],
    helpTitle: "Bantuan",
    helpItems: [
      "Support Center",
      "Hubungi Kami",
      "Pengaduan",
      "Waspada Penipuan",
      "Bug Bounty",
    ],
  },
  liveQuoteSection: {
    title: "Live Quote",
    subtitle:
      "Pantau pergerakan harga market secara realtime melalui live quote API internal.",
    cta: "Lihat Lainnya",
  },
  liveQuotePage: {
    breadcrumb: "Live Quote",
  },
  ebookPage: {
    title: "Ebook Trading",
    description:
      "Kumpulan ebook trading untuk membantu trader memahami dasar market, manajemen risiko, dan penyusunan rencana trading.",
    breadcrumb: "Ebook",
    hero: {
      eyebrow: "Pusat Materi",
      title:
        "Ebook trading yang ringkas, relevan, dan siap dipelajari kapan saja.",
      description:
        "Halaman ini merangkum materi baca yang cocok untuk pemula maupun trader aktif yang ingin memperkuat pemahaman market secara lebih terstruktur.",
      primaryCta: "Buka Akun",
      secondaryCta: "Masuk Area Klien",
    },
    libraryTitle: "Pilihan Ebook",
    librarySubtitle:
      "Materi disusun untuk membantu proses belajar dari pondasi dasar sampai pemahaman strategi dan manajemen risiko.",
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
  },
  liveQuoteTable: {
    feedLabel: "Realtime Market Feed",
    empty: "Menunggu data live quote masuk dari websocket.",
    firstTick: "Menunggu tick pertama",
    lastUpdated: "Pembaruan terakhir",
    fields: {
      symbol: "Symbol",
      price: "Price",
      sell: "Sell",
      buy: "Buy",
      open: "Open",
      high: "High",
      low: "Low",
      time: "Time",
      dateTime: "Date Time",
    },
    connectionStatus: {
      connecting: "Connecting",
      live: "Live",
      reconnecting: "Reconnecting",
      error: "Connection Error",
    },
    trend: {
      up: "Naik",
      down: "Turun",
      neutral: "Stabil",
    },
  },
  aboutPage: {
    hero: {
      eyebrow: "Tentang Solid Gold Berjangka",
      title:
        "Perusahaan pialang berjangka dengan fondasi legal yang jelas dan rekam jejak panjang di Indonesia.",
      description:
        "Profil ini merangkum siapa kami, arah perusahaan, pencapaian penting, dan dasar legalitas yang menjadi pijakan operasional PT. Solid Gold Berjangka.",
      facts: {
        foundedLabel: "Berdiri Sejak",
        foundedValue: "2002",
        focusLabel: "Fokus Utama",
        focusValue: "Perdagangan Berjangka",
        operationsLabel: "Operasional",
        operationsValue: "Jakarta, Semarang, Makassar",
      },
    },
    companyProfile: {
      eyebrow: "Profil Perusahaan",
      logoAlt: "PT. Solid Gold Berjangka",
      title: "PT. Solid Gold Berjangka",
      paragraphs: [
        "Berdiri sejak tahun 2002, PT Solid Gold Berjangka (SGB) merupakan perusahaan pialang berjangka yang terdaftar dan diawasi oleh BAPPEBTI. Dengan pengalaman lebih dari dua dekade, SGB menjadi salah satu pelaku utama dalam industri Perdagangan Berjangka Komoditi di Indonesia.",
        "SGB merupakan anggota Bursa Berjangka Jakarta (BBJ) dan Kliring Berjangka Indonesia (Persero), serta terus memperluas layanan melalui kantor operasional di Jakarta, Semarang, dan Makassar.",
      ],
    },
    visiMisi: {
      eyebrow: "Arah Perusahaan",
      missionTitle: "Misi Perusahaan",
      visionTitle: "Visi Perusahaan",
      missionItems: [
        "Menjadi sebuah perusahaan pialang berjangka yang memiliki skala internasional",
        "Menjadi market leader, baik itu secara regional ataupun internasional",
      ],
      visionItems: [
        "Mengembangkan dan memajukan Perdagangan Berjangka di Indonesia sehingga dapat memberikan dampak positif kepada perekonomian Nasional baik dari segi mikro dan makro",
        "Memberdayakan Perdagangan Berjangka di Indonesia dan membantu semua pihak yang membutuhkannya untuk dapat mempergunakannya sebagai sarana lindung nilai (Hedging)",
      ],
      summary:
        "Dari visi dan misi perusahaan keuangan PT. Solid Gold Berjangka ini, kami berusaha semaksimal mungkin mendirikan perusahaan agar dapat memajukan dan mengembangkan perdagangan berjangka di Indonesia untuk memberikan dampak positif bagi perekonomian nasional, baik dari segi makro maupun mikro.",
    },
    awards: {
      eyebrow: "Pencapaian",
      title: "Penghargaan",
      description:
        "Beberapa pengakuan yang mencerminkan konsistensi perusahaan dalam aktivitas perdagangan dan kontribusi di industri.",
      items: [
        {
          title: "KBI Award 2014",
          subtitle: "Anggota Kliring Terbaik ke-2",
          imageSrc:
            "https://cdn.pandalingua.my.id/sgb/assets/a4690a59-8cb5-40d0-a2bf-8ce723f1f926.avif",
          imageAlt: "Penghargaan Anggota Kliring Terbaik ke-2 Tahun 2014",
        },
        {
          title: "JFX Award 2011",
          subtitle: "Transaksi Bilateral Terbanyak",
          imageSrc:
            "https://cdn.pandalingua.my.id/sgb/assets/bbe0962d-abab-4ba7-90fc-2ee7434d1fdf.avif",
          imageAlt:
            "Penghargaan Dengan Volume Transaksi Bilateral Terbanyak ke-2 Tahun 2011",
        },
      ],
    },
    regulation: {
      eyebrow: "Legalitas",
      title: "Terdaftar, diawasi, dan terhubung dengan",
      highlightedTitle: "lembaga resmi Indonesia",
      description:
        "PT. Solid Gold Berjangka menjalankan kegiatan usaha dengan landasan perizinan dan keanggotaan resmi pada regulator, bursa, serta lembaga kliring yang relevan.",
    },
  },
  productPage: {
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
        title: "Multilateral",
        description:
          "Daftar produk multilateral resmi yang ditampilkan dari katalog produk Solid Gold.",
        eyebrow: "Kategori JFX",
        summary:
          "Produk multilateral ini memuat spesifikasi kontrak resmi beserta detail penyerahan dan perdagangan untuk instrumen yang diperdagangkan di bursa.",
      },
      bilateral: {
        title: "Bilateral",
        description:
          "Daftar produk bilateral resmi yang ditampilkan dari katalog produk Solid Gold.",
        eyebrow: "Kategori SPA",
        summary:
          "Produk bilateral ini merangkum spesifikasi perdagangan, margin, komisi, dan parameter transaksi untuk instrumen bilateral yang aktif.",
      },
    },
  },
  economicCalendarPage: {
    title: "Kalender Ekonomi",
    description:
      "Pantau event ekonomi penting hari ini, minggu ini, minggu depan, dan minggu sebelumnya dalam satu halaman kalender ekonomi.",
    breadcrumb: "Kalender Ekonomi",
  },
  economicCalendarBrowser: {
    tabs: {
      today: "Today",
      thisWeek: "This Week",
      nextWeek: "Next Week",
      previousWeek: "Previous Week",
    },
    statusUnavailable: "Tidak tersedia",
    time: "Waktu",
    country: "Negara",
    impact: "Dampak",
    event: "Peristiwa",
    previous: "Sebelumnya",
    forecast: "Perkiraan",
    actual: "Aktual",
    source: "Sumber",
    measures: "Indikator",
    effect: "Dampak Umum",
    frequency: "Frekuensi",
    nextRelease: "Rilis Berikutnya",
    notes: "Catatan",
    whyCare: "Alasan Penting",
    date: "Tanggal",
    noHistory: "Belum ada riwayat event untuk entri ini.",
    empty: "Belum ada event pada rentang kalender ini.",
    unavailable:
      "Data untuk rentang kalender ini sedang tidak tersedia dari API.",
    collapse: "Tutup",
    expand: "Lihat detail",
    today: "Hari ini",
    previousPage: "Sebelumnya",
    nextPage: "Berikutnya",
    page: "Halaman",
    of: "dari",
  },
  historicalDataPage: {
    title: "Historical Data",
    description:
      "Pantau historical data market lintas kategori untuk kebutuhan analisa harga SG Mini.",
    breadcrumb: "Historical Data",
  },
  historicalDataBrowser: {
    records: "Data",
    categories: "Kategori",
    latestDate: "Tanggal Terbaru",
    empty: "Data historical belum tersedia untuk filter yang dipilih.",
    date: "Tanggal",
    category: "Kategori",
    open: "Open",
    high: "High",
    low: "Low",
    close: "Close",
    note: "Keterangan",
    bankHoliday: "Bank Holiday",
    noNote: "-",
    previous: "Sebelumnya",
    next: "Berikutnya",
    page: "Halaman",
    of: "dari",
    showing: "Menampilkan",
    to: "sampai",
    ofRecords: "dari",
  },
  newsPage: {
    breadcrumb: "Berita",
    listTitle: "Kategori",
    allCategories: "Semua Kategori",
    filter: "Filter",
    searchPlaceholder: "Cari berita...",
    emptyTitle: "Belum ada berita untuk ditampilkan.",
    emptyBody: "Coba lagi beberapa saat lagi.",
    pagination: {
      previous: "Sebelumnya",
      next: "Berikutnya",
      summary: "Halaman",
    },
  },
  newsBrowser: {
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
  },
  newsDetailPage: {
    news: "Berita",
    relatedNews: "Related News",
    latestNews: "Latest News",
    readTimeUnit: "menit baca",
  },
  fraudAlertPage: {
    title: "Waspada Penipuan",
    description:
      "Panduan singkat untuk mengenali modus penipuan yang mengatasnamakan Solid Gold Berjangka dan langkah verifikasi yang aman.",
    breadcrumb: "Waspada Penipuan",
    hero: {
      eyebrow: "Keamanan Nasabah",
      title: "Kenali modus penipuan sebelum Anda merespons.",
      description:
        "Gunakan halaman ini sebagai pengingat singkat untuk memeriksa identitas pihak yang menghubungi Anda, tautan yang dibagikan, dan instruksi transaksi yang diberikan.",
    },
    alertBoxTitle:
      "Jangan langsung percaya pada akun, nomor, atau tautan yang belum terverifikasi.",
    alertBoxBody:
      "Pelaku penipuan biasanya meniru nama perusahaan, staf, atau tampilan komunikasi resmi untuk mendorong keputusan yang terburu-buru. Luangkan waktu untuk memeriksa detailnya terlebih dahulu.",
    redFlagsTitle: "Tanda-tanda yang perlu dicurigai",
    redFlags: [
      "Meminta transfer dana ke rekening pribadi atau rekening di luar nama perusahaan resmi.",
      "Menjanjikan profit pasti, bonus instan, atau hasil trading tanpa risiko.",
      "Menekan Anda untuk segera deposit, membagikan data pribadi, atau mengklik tautan tertentu saat itu juga.",
      "Mengirim file, aplikasi, atau link login dari domain dan akun media sosial yang tidak resmi.",
      "Menggunakan identitas staf yang tidak konsisten, sulit diverifikasi, atau berubah-ubah selama percakapan.",
    ],
    verificationTitle: "Langkah verifikasi yang aman",
    verificationSteps: [
      "Periksa kembali alamat website, domain email, dan akun media sosial sebelum mengikuti instruksi apa pun.",
      "Konfirmasi nomor telepon, akun, atau informasi promo melalui kanal resmi perusahaan yang sudah Anda kenal.",
      "Jangan pernah membagikan password, PIN, OTP, kode verifikasi, atau akses perangkat kepada pihak lain.",
      "Pastikan instruksi pembayaran hanya mengarah ke rekening resmi perusahaan dan bukan rekening pribadi.",
      "Jika ada keraguan kecil sekalipun, hentikan proses dan verifikasi ulang terlebih dahulu.",
    ],
    responseTitle: "Jika Anda terlanjur dihubungi atau diarahkan",
    responseSteps: [
      "Hentikan komunikasi dan jangan lanjutkan transfer, login, atau pengiriman dokumen tambahan.",
      "Simpan bukti seperti screenshot chat, nomor pengirim, email, tautan, dan bukti transfer bila ada.",
      "Segera ubah password akun terkait jika Anda sempat membagikan data login atau mengakses tautan mencurigakan.",
      "Hubungi bank atau penyedia pembayaran Anda bila sudah terjadi transaksi untuk meminta langkah penanganan secepatnya.",
      "Laporkan kejadian tersebut ke kanal dukungan resmi agar bisa ditinjau lebih lanjut.",
    ],
    reminderTitle: "Ingat",
    reminderBody:
      "Pihak resmi tidak akan meminta password, PIN, OTP, atau transfer dana ke rekening pribadi atas nama staf mana pun.",
    primaryCta: "Kembali ke Beranda",
    secondaryCta: "Pelajari Perusahaan",
  },
  contactPage: {
    title: "Hubungi Kami",
    description:
      "Halaman kontak PT. Solid Gold Berjangka dengan form pesan, peta kantor pusat, dan informasi customer support resmi.",
    breadcrumb: "Hubungi Kami",
    breadcrumbs: {
      supportCenter: "Pusat Dukungan",
    },
    hero: {
      eyebrow: "Kontak Resmi",
      title: "HUBUNGI KAMI",
      description:
        "PT. Solid Gold Berjangka hadir di Jakarta dan beberapa kota operasional lain di Indonesia.",
    },
    form: {
      title: "Kirimkan Pesan Anda",
      description:
        "Isi data singkat Anda. Tombol kirim akan membuka email ke alamat resmi PT. Solid Gold Berjangka.",
      nameLabel: "Nama",
      namePlaceholder: "Nama lengkap Anda",
      emailLabel: "Email",
      emailPlaceholder: "nama@email.com",
      phoneLabel: "No. Handphone",
      phonePlaceholder: "08xxxxxxxxxx",
      subjectLabel: "Subjek",
      subjectPlaceholder: "Contoh: Pertanyaan pembukaan akun",
      messageLabel: "Pesan",
      messagePlaceholder:
        "Tuliskan kebutuhan, pertanyaan, atau kendala Anda secara singkat.",
      captchaLabel: "CAPTCHA",
      captchaAction: "Refresh",
      submit: "Kirim Pesan",
      helper:
        "Untuk respons lebih cepat, Anda juga bisa langsung menghubungi customer support di samping.",
      success:
        "Aplikasi email Anda sedang dibuka dengan detail pesan yang sudah disiapkan.",
    },
    headOffice: {
      title: "Kantor Pusat SGB",
      address:
        "TCC Batavia, Tower One Lt. 10, Jl. K.H. Mas Mansyur Kav. 126, Jakarta Pusat 10220",
      email: "berjangka@solidgold.co.id",
      phone: "021-29675088",
      phoneHref: "tel:02129675088",
      fax: "021-29675089",
      complaintPhone: "021-29675088 ext. 116",
      complaintPhoneHref: "tel:02129675088",
    },
    map: {
      title: "Peta Kantor Pusat",
      description:
        "Lokasi kantor pusat PT. Solid Gold Berjangka di Jakarta dapat langsung dibuka melalui peta berikut.",
      iframeTitle: "Peta kantor pusat PT. Solid Gold Berjangka",
      directionsCta: "Buka Petunjuk Arah",
      directionsUrl:
        "https://www.google.com/maps/search/?api=1&query=TCC%20Batavia%20Tower%20One%20Lt.%2010%20Jl.%20K.H.%20Mas%20Mansyur%20Kav.%20126%20Jakarta%20Pusat%2010220",
    },
    support: {
      title: "Customer Support",
      description:
        "Pilih kanal kontak resmi sesuai kebutuhan Anda, mulai dari pertanyaan umum sampai unit pengaduan.",
      hoursLabel: "Waktu Operasional",
      hoursValue: "Senin - Jumat",
      callTitle: "Telepon",
      callDescription: "Jalur telepon utama kantor pusat.",
      emailTitle: "Email",
      emailDescription: "Alamat email resmi untuk pertanyaan umum.",
      complaintTitle: "Unit Pengaduan",
      complaintDescription: "Gunakan ext. 116 untuk kebutuhan pengaduan.",
      faxTitle: "Fax",
      faxDescription: "Kanal fax resmi perusahaan.",
    },
    offices: {
      title: "Kantor Cabang SGB",
      description:
        "Lokasi operasional PT. Solid Gold Berjangka yang ditampilkan mengikuti informasi kontak publik resmi perusahaan.",
      phoneLabel: "Telepon",
      emailLabel: "Email",
      faxLabel: "Fax",
      items: [
        {
          name: "Kantor Pusat Jakarta",
          address:
            "TCC Batavia, Tower One Lt. 10, Jl. K.H. Mas Mansyur Kav. 126, Jakarta Pusat 10220",
          phone: "021-29675088",
          phoneHref: "tel:02129675088",
          email: "berjangka@solidgold.co.id",
          fax: "021-29675089",
        },
        {
          name: "Kantor Semarang",
          address:
            "Gedung Menara SUARA MERDEKA Lt. 3, Jl. Pandanaran No. 30 Semarang 50134",
          phone: "024-3583979, 024-3583980",
          phoneHref: "tel:0243583979",
        },
        {
          name: "Kantor Makassar",
          address:
            "Pettarani Business Center, Jl. AP. Pettarani Kav. E9, Kel. Tidung, Kec. Rappocini, Kota Makassar, Sulawesi Selatan 90222",
        },
      ],
    },
  },
  footer: {
    brandTitle: "SG Mini",
    brandItems: [
      { label: "Tentang Kami", href: "/about" },
      { label: "Ebook", href: "/ebook" },
      { label: "Live Quote", href: "/live-quote" },
      { label: "Berita", href: "/news" },
    ],
    helpTitle: "Bantuan",
    helpItems: [
      { label: "Hubungi Kami", href: "/contact-us" },
      { label: "Waspada Penipuan", href: "/fraud-alert" },
      { label: "Kalender Ekonomi", href: "/economic-calendar" },
      { label: "Historical Data", href: "/historical-data" },
    ],
    legalItems: [
      "Badan Pengawas Perdagangan Berjangka Komoditi: Nomor 1156/BAPPEBTI/SI/3/2007",
      "Otoritas Jasa Keuangan: Nomor S-126/PM.02/2025",
      "Bank Indonesia: Nomor 27/663/DPPK/Srt/B",
      "Bursa Komoditi dan Derivatif Indonesia: Nomor S-373/PM.02/2025",
      "Bursa Berjangka Jakarta: Nomor SPAB-047/BBJ/07/02",
      "Kliring Berjangka Indonesia: Nomor 15/AK-KBI/V/2003",
    ],
    socials: [
      {
        name: "Instagram",
        url: "https://instagram.com/example",
        icon: "instagram",
      },
      {
        name: "Facebook",
        url: "https://facebook.com/example",
        icon: "facebook-f",
      },
      {
        name: "YouTube",
        url: "https://youtube.com/example",
        icon: "youtube",
      },
      {
        name: "TikTok",
        url: "https://tiktok.com/@example",
        icon: "tiktok",
      },
    ],
    copyrightProtected: "Hak cipta dilindungi.",
    komdigiAlt: "Logo Komdigi",
    tsiAlt: "Logo TSI",
  },
  loadingOverlay: {
    title: "Memuat Halaman",
    description: "Menyiapkan konten dan aset...",
  },
};
