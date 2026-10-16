import type { AppMessages } from "../../shared/messages";

export const idClientArea: AppMessages["clientArea"] = {
  pageTitle: "Beranda",
  pageDescription:
    "Tampilan utama nasabah setelah login dengan ringkasan akun, aksi cepat, dan signal market.",
  viewOnlyDisclaimer: {
    label: "Disclaimer:",
    body: "Seluruh informasi, data, grafik, dan fitur yang ditampilkan di Client Area bersifat hanya untuk dilihat (view only) dan tidak dapat digunakan untuk mengeksekusi transaksi.",
  },
  login: {
    badge: "Portal Nasabah",
    title: "Masuk Client Area",
    description:
      "Autentikasi akun sedang disiapkan dan belum tersedia melalui website.",
    accountLabel: "Email",
    accountPlaceholder: "Masukkan email Anda",
    passwordLabel: "Password",
    passwordPlaceholder: "Masukkan password Anda",
    rememberMe: "Ingat saya di perangkat ini",
    forgotPassword: "Lupa password?",
    primaryCta: "Masuk belum tersedia",
    secondaryCta: "Hubungi support",
    submitting: "Memverifikasi akun...",
    helper:
      "Silakan gunakan aplikasi resmi atau hubungi support untuk akses akun.",
    captchaTitle: "Verifikasi keamanan",
    captchaHelper: "Selesaikan reCAPTCHA sebelum masuk ke client area.",
    demoCredentialsTitle: "Akses akun",
    demoCredentialsAccount: "Akses melalui website belum tersedia.",
    demoCredentialsPassword: "",
    errorUnavailable:
      "Client area sedang dinonaktifkan dari sistem admin. Coba lagi beberapa saat lagi.",
    errorRequired: "Masukkan email dan password Anda.",
    errorInvalidCredentials:
      "Email atau password yang Anda masukkan tidak sesuai. Silakan periksa kembali dan coba lagi.",
    errorSessionConfiguration:
      "Login belum bisa diproses karena konfigurasi session server belum lengkap. Isi CLIENT_AREA_SESSION_SECRET terlebih dahulu.",
    errorCaptchaRequired:
      "Verifikasi keamanan belum berhasil. Silakan coba lagi.",
    errorCaptchaFailed:
      "Verifikasi reCAPTCHA gagal. Coba ulangi pemeriksaan keamanan.",
    errorNetwork:
      "Tidak dapat terhubung ke server login. Periksa koneksi internet Anda lalu coba lagi.",
    errorTimeout:
      "Server login membutuhkan waktu terlalu lama untuk merespons. Silakan coba lagi beberapa saat lagi.",
    errorSessionExpired:
      "Sesi login telah berakhir. Muat ulang halaman lalu coba masuk kembali.",
    errorServer:
      "Server login sedang bermasalah atau memberikan respons yang tidak dapat diproses. Silakan coba lagi beberapa saat lagi.",
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
  otp: {
    title: "Verifikasi OTP",
    description:
      "Akun Anda memerlukan verifikasi tambahan. Kami telah mengirim kode OTP ke email yang terdaftar Anda.",
    codeLabel: "Kode OTP",
    codePlaceholder: "Masukkan 6 digit kode OTP",
    submitLabel: "VERIFIKASI",
    submitting: "Memverifikasi kode...",
    resendLabel: "Kirim ulang kode",
    resending: "Mengirim ulang...",
    resendSuccess: "Kode OTP telah dikirim.",
    backToLogin: "Kembali ke login",
    errorRequired: "Masukkan kode OTP Anda.",
    errorInvalidCode:
      "Kode OTP tidak sesuai atau sudah kedaluwarsa. Silakan coba lagi.",
    errorSessionExpired: "Sesi verifikasi telah berakhir. Silakan login ulang.",
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
        id: "trade-pilot",
        label: "Trade Pilot",
        href: "/client-area/trade-pilot/analisis",
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
  livePriceTicker: {
    label: "Harga live dan berita terbaru",
    newsLabel: "Berita",
  },
  tradePilotPage: {
    access: {
      deniedTitle: "Trade Pilot belum tersedia",
      deniedDescription:
        "Akun login ini belum memiliki akun Demo atau Real yang terverifikasi. Nomor account tidak digunakan atau disimpan oleh Trade Pilot.",
      missingDemoTitle: "Maaf, Anda belum memiliki akun Demo",
      missingDemoDescription:
        "Pilih akun Real yang sudah terverifikasi untuk menggunakan Trade Pilot dalam mode Real.",
      missingRealTitle: "Maaf, Anda belum memiliki akun Real",
      missingRealDescription:
        "Pilih akun Demo untuk tetap menggunakan Trade Pilot, atau buka akun Real terlebih dahulu.",
      mockDataLabel: "Data simulasi",
    },
    navigation: {
      label: "Navigasi Trade Pilot",
      items: {
        analysis: "Analisis",
        performanceHistory: "Riwayat Performa",
        guide: "Panduan",
      },
    },
    analysis: {
      title: "Analisis Pasar",
      description:
        "Analisis pergerakan harga real-time dengan chart interaktif dan data terkini.",
      quotaValue: "10/30 Hari",
      quotaLabel: "Kuota Analisis",
      sessionValue: "Sydney - Tokyo",
      sessionLabel: "Sesi Aktif",
      instrumentPickerTitle: "Pilih Instrumen",
      searchPlaceholder: "Cari instrumen...",
      favoritesLabel: "Favorit",
      addFavoriteLabel: "Tambah instrumen favorit",
      setAlertLabel: "Pasang Alert",
      analysisActionLabel: "Analisis",
      analysisLoadingLabel: "Menganalisis...",
      insufficientCreditMessage: "Credit analisis untuk mode ini sudah habis.",
      analysisErrorMessage: "Analisis belum dapat dibuat. Silakan coba lagi.",
      noAnalysisTitle: "Belum ada hasil analisis",
      noAnalysisDescription:
        "Pilih instrumen dan timeframe, lalu tekan Analisis. Hasil yang tampil masih berupa simulasi deterministik.",
      demoModeLabel: "Demo",
      realModeLabel: "Real",
      instrumentLabel: "Instrumen:",
      currentPriceLabel: "Harga saat ini:",
      timeframeLabel: "Timeframe:",
      indicatorLabel: "Indikator",
      chartSettingsLabel: "Pengaturan chart",
      fullscreenLabel: "Tampilkan layar penuh",
      exitFullscreenLabel: "Keluar dari layar penuh",
      screenshotLabel: "Ambil tangkapan chart",
      captureInProgressLabel: "Sedang mengambil tangkapan chart",
      captureUnsupportedMessage:
        "Browser ini tidak mendukung pengambilan tangkapan chart.",
      captureFailedMessage:
        "Tangkapan chart gagal dibuat. Pilih tab Client Area saat browser meminta sumber layar.",
      fullscreenUnsupportedMessage:
        "Mode layar penuh tidak didukung oleh browser ini.",
      instrumentNames: {
        gold: "Emas / Dollar A.S.",
        brent: "Minyak Mentah Brent",
        hangSeng: "Indeks Hang Seng",
        nikkei: "Indeks Nikkei 225",
      },
      analysisResult: {
        relevanceLabel: "Relevan hingga sekitar 4 jam lagi",
        pendingLabel: "Pending",
        sessionWindowLabel: "Tokyo • London",
        highestLiquidityLabel: "likuiditas tertinggi",
        bullishLabel: "Bullish",
        bearishLabel: "Bearish",
        sidewaysLabel: "Sideways",
        changeTimeframeTitle: "Ganti Timeframe",
        changeTimeframeDescription:
          "Instrumen sama, timeframe berbeda — pilih salah satu untuk langsung dianalisis.",
        compareRiskLabel: "Bandingkan Risiko",
        directionBiasTitle: "Bias Arah",
        neutralWaitLabel: "Netral / Tunggu",
        timeframeContextLabel: "Untuk timeframe",
        bearishBiasLabel: "Bias bearish kuat",
        neutralBiasLabel: "Netral / Tunggu",
        bullishBiasLabel: "Bias bullish kuat",
        tendencyDisclaimer:
          "Kecenderungan dari analisis — bukan instruksi beli/jual",
        confidenceLabel: "Keyakinan",
        overallRiskLabel: "Risiko Keseluruhan",
        mediumRiskLabel: "Risiko Sedang",
        learnLabel: "Pelajari",
        confidenceReasonTitle: "Kenapa Keyakinan Tidak Lebih Tinggi?",
        confidenceReasonDescription:
          "Pergerakan harga dan perubahan sesi pasar dapat menambah volatilitas, sehingga keyakinan skenario teknikal tetap dibatasi.",
        fullReasonLabel: "Lihat Alasan Lengkap",
        analyzedAtLabel: "Dianalisis",
        refreshAnalysisLabel: "Perbarui Analisis",
        priceChartTitle: "Grafik Harga",
        updatedAtLabel: "Diperbarui",
        viewFullChartLabel: "Lihat chart lengkap",
        resetLabel: "Reset",
        shareChartLabel: "Bagikan grafik",
        suggestedLevelsTitle: "Saran Level",
        recommendedSideLabel: "Sisi yang disarankan",
        waitLabel: "Tunggu",
        suggestedLevelsDescription:
          "Level Entry, Stop Loss, dan Take Profit untuk skenario Buy dan Sell berdasarkan rentang harga saat analisis dibuat.",
        buyScenarioLabel: "Skenario Buy",
        sellScenarioLabel: "Skenario Sell",
        entryLabel: "Entry",
        aboveLabel: "di atas",
        belowLabel: "di bawah",
        breakoutHint: "setelah breakout harga tertinggi",
        breakdownHint: "setelah breakdown harga terendah",
        stopLossLabel: "Stop Loss",
        takeProfitOneLabel: "Take Profit 1",
        takeProfitTwoLabel: "Take Profit 2",
        riskRewardLabel: "Risk : Reward",
        reasonLabel: "Alasan",
        buyReason:
          "Konfirmasi breakout di atas resistance dan kelanjutan momentum harga.",
        sellReason:
          "Konfirmasi breakdown di bawah support dan kelanjutan tekanan harga.",
        copyLevelsLabel: "Salin level",
        copiedLabel: "Level tersalin",
      },
      technicalIndicators: {
        title: "Indikator Teknikal",
        description:
          "Indikator live • Analisis dan plan tersimpan tidak otomatis berubah",
        dataLabel: "Data",
        candleCountLabel: "13.744 candle",
        priceLabel: "Harga",
        lastBarLabel: "Bar terakhir",
        twentyBarsLabel: "20 bar",
        signalSummaryLabel: "Ringkasan sinyal",
        oscillatorLabel: "Oscillator",
        movingAverageLabel: "Moving Avg",
        movingAveragesLabel: "Moving Averages",
        leaningBullishLabel: "Cenderung Bullish",
        leaningBearishLabel: "Cenderung Bearish",
        bullishLabel: "Bullish",
        bearishLabel: "Bearish",
        neutralLabel: "Netral",
        buyLabel: "Beli",
        sellLabel: "Jual",
        waitLabel: "Tunggu",
      },
      priceAlert: {
        title: "Alert harga",
        description:
          "Dapat notifikasi push begitu harga live menyentuh tiap level dari AI.",
        toggleLabel: "Aktifkan atau nonaktifkan alert harga",
        statusLabel: "Alert",
        activeLabel: "Aktif",
        inactiveLabel: "Nonaktif",
        entryLabel: "Entry",
        stopLossLabel: "Stop Loss",
        takeProfitOneLabel: "Take Profit 1",
        takeProfitTwoLabel: "Take Profit 2",
        triggeredLabel: "Terpicu",
        cancelledLabel: "Dibatalkan",
      },
      footer: {
        eyebrow: "Dapatkan TradePilot di",
        title: "Tersedia di iOS dan Android",
        description:
          "Pantau market, lihat rekomendasi, dan kelola watchlist kapan saja.",
        googlePlayAlt: "Dapatkan TradePilot di Google Play",
        appStoreAlt: "Dapatkan TradePilot di App Store",
        logoAlt: "Logo TradePilot",
        supportTitle:
          "TradePilot adalah alat pendukung keputusan, bukan saran keuangan atau layanan trading.",
        supportDescription:
          "Keputusan dan risiko tetap milikmu. Performa masa lalu tidak menjamin hasil di masa depan.",
        disclaimerLabel: "Disclaimer:",
        disclaimerDescription:
          "Seluruh informasi, data, grafik, dan fitur yang ditampilkan di Client Area bersifat hanya untuk dilihat (view only) dan tidak dapat digunakan untuk mengeksekusi transaksi.",
        legalNavigationLabel: "Tautan legal TradePilot",
        privacyLabel: "Kebijakan Privasi",
        termsLabel: "Syarat Layanan",
        helpLabel: "Bantuan",
        deleteAccountLabel: "Hapus Akun",
        tiktokLabel: "Kunjungi TikTok TradePilot.id",
        copyright: "Solid Gold Berjangka. TradePilot. Hak cipta dilindungi.",
      },
      fundamentalContext: {
        title: "Konteks Fundamental",
        description: "Berita & event terkait analisis ini.",
        refreshLabel: "Refresh fundamental",
        latestNewsLabel: "Berita Terkini",
        economicCalendarLabel: "Kalender Ekonomi",
        learnLabel: "Pelajari",
        items: [
          {
            title:
              "US Bond Yields Keep Climbing — But Retail Traders Still Can't Get Enough Stocks",
            source: "Yahoo Finance",
            publishedAt: "sekitar 1 jam yang lalu",
          },
          {
            title:
              "Emas Masih Dalam Mode Tertekan, Dolar dan Yield AS Jadi Beban Utama",
            source: "Newsmaker.id",
            publishedAt: "sekitar 4 jam yang lalu",
          },
          {
            title:
              "Menteri Keuangan Jepang Dukung Kenaikan Bunga BoJ, Fokus Capai Target Inflasi",
            source: "Newsmaker.id",
            publishedAt: "sekitar 4 jam yang lalu",
          },
          {
            title:
              "Pasar Menanti Data Ekonomi AS di Tengah Penguatan Imbal Hasil Obligasi",
            source: "Newsmaker.id",
            publishedAt: "sekitar 5 jam yang lalu",
          },
          {
            title:
              "Harga Emas Bergerak Sideways Menjelang Pembukaan Sesi London",
            source: "Newsmaker.id",
            publishedAt: "sekitar 6 jam yang lalu",
          },
        ],
      },
      marketContextSummary: {
        eyebrow: "Ringkasan Konteks Pasar",
        bearishTitle: "Cenderung Bearish",
        bullishTitle: "Cenderung Bullish",
        sellLabel: "Jual",
        buyLabel: "Beli",
        bearishDescription:
          "7 dari 11 indikator cenderung bearish, sementara 3 bullish dan 1 netral.",
        bullishDescription:
          "7 dari 11 indikator cenderung bullish, sementara 3 bearish dan 1 netral.",
        bearishNote:
          "Data saat ini condong ke skenario penurunan — konfirmasi dengan price action sebelum mengambil keputusan.",
        bullishNote:
          "Data saat ini condong ke skenario kenaikan — konfirmasi dengan price action sebelum mengambil keputusan.",
      },
      tradingPlan: {
        title: "Trading Plan Adaptif",
        description: "Simulasi entry, lot, dan risiko dari analisis ini.",
        lotUnitLabel: "lot",
        accountTypeLabel: "Tipe Akun",
        microAccountLabel: "Micro",
        microAccountDesc: "Minimum 0,01 lot · margin $10",
        miniAccountLabel: "Mini",
        miniAccountDesc: "Minimum 0,10 lot · margin $100",
        regularAccountLabel: "Regular",
        regularAccountDesc: "Minimum 1,00 lot · margin $1.000",
        tradingCapitalLabel: "Modal trading",
        lossLimitLabel: "Batas rugi",
        riskStyleLabel: "Gaya Risiko",
        conservativeLabel: "Conservative",
        moderateLabel: "Moderat",
        aggressiveLabel: "Aggressive",
        intradayNote:
          "Perhitungan ini khusus untuk posisi intraday (day trade); posisi overnight tidak tercakup.",
        snapshotLabel: "Snapshot candle analisis diambil",
        snapshotValue: "2/10/2026, 09:10:15",
        createRecommendationLabel: "Buat Rekomendasi",
        selectDirectionLabel: "Pilih Satu Arah",
        waitStatusLabel: "Tunggu",
        limitedOptionsLabel: "Hanya opsi terbatas",
        waitDescription:
          "Risiko lot minimum melewati target gaya, meski masih di bawah batas rugi. Jangan entry.",
        waitGuidance:
          "Tunggu setup lain dengan risiko lot minimum maksimal $225; jangan geser stop.",
        minimumStopRiskLabel: "Risiko minimum di stop",
        warningTitle: "Belum ada rencana yang aman",
        warningDescription:
          "Belum ada sisi yang memiliki plan aman dan disetujui. Periksa status dan angka lot minimum tiap sisi di bawah; angka diagnostik bukan plan entry yang valid. Ubah input finansial hanya jika terjangkau dan dapat diterima secara mandiri, atau tunggu/skip.",
        buyScenarioLabel: "Skenario Naik (Buy)",
        buyScenarioDescription:
          "Skenario naik (Buy) disesuaikan dengan risiko dan dana. Konfirmasi chart terkini sebelum entry.",
        buyScenarioGuidance:
          "Pantau entry sekitar {entry}. Entry hanya jika setup terkonfirmasi; jangan geser stop.",
        sellScenarioLabel: "Skenario Turun (Sell)",
        sellScenarioDescription:
          "Skenario turun (Sell) disesuaikan dengan risiko dan dana. Konfirmasi chart terkini sebelum entry.",
        sellScenarioGuidance:
          "Pantau entry sekitar {entry}. Entry hanya jika setup terkonfirmasi; jangan geser stop.",
        brokerFundsUntilStopLabel: "Dana Broker Hingga Stop",
        understandDetailsLabel: "Pahami detailnya",
        understandDetailsDescription:
          "Lihat penjelasan lengkap, perhitungan setiap posisi, dan logika di balik rekomendasi ini.",
        cancellationConditionsLabel: "3 kondisi pembatalan",
        alternateScenarioPendingLabel:
          "Skenario belum bisa dijalankan · tunggu syarat terpenuhi.",
        savePlanLabel: "Simpan Plan",
        shareLabel: "Bagikan",
        entryPositionLabel: "Entry (1 posisi)",
        initialEntryDescription: "Harga entry awal",
        stopLossLabel: "Stop Loss",
        finalStopLossDescription: "Satu SL final",
        riskBudgetLabel: "Risk budget",
        riskBudgetDescription: "{percentage}% dari batas {limit}",
        targetProfitLabel: "Target Profit",
        takeProfitOneShortLabel: "TP1",
        takeProfitTwoShortLabel: "TP2",
        riskStyleDescriptions: {
          conservative: "Risiko lebih rendah",
          moderate: "Risiko seimbang",
          aggressive: "Risiko lebih tinggi",
        },
        planSummaryLabel: "Ringkasan Plan",
        planDetailsLabel: "Rincian Plan",
        unusedCandidatesLabel: "Kandidat layer yang tidak dipakai",
        recommendationUsageLabel: "Cara memakai rekomendasi ini",
        entryAndLotTitle: "Harga entry & lot tiap posisi",
        allEntriesFilledDescription:
          "Jika semua entry terisi: 1 posisi · {lot} lot",
        initialEntryLabel: "Posisi 1: Entry awal",
        riskSectionTitle: "Risiko",
        finalStopLossLabel: "Satu Stop Loss final",
        maximumLossEstimateLabel: "Estimasi rugi maksimal",
        targetProfitSectionTitle: "Target profit",
        takeProfitOneLabel: "Take Profit 1",
        takeProfitTwoLabel: "Take Profit 2",
        estimatedProfitLabel: "Estimasi profit",
        riskContextTitle: "Batas risiko",
        usableRiskBudgetLabel: "Risk budget yang boleh dipakai",
        guardrailDescription: "{percentage}% dari batas rugi setelah guardrail",
        proposedLossLimitLabel: "Batas rugi yang dicadangkan",
        initialEntryOnlyNote:
          "Skenario ini hanya untuk entry awal; tidak ada layer tambahan untuk direkomendasikan.",
        otherCalculationDetailsLabel: "Detail perhitungan lainnya",
        weightedAverageEntryLabel: "Rata-rata entry tertimbang",
        usedMarginLabel: "Margin yang dipakai",
        marginAndStopLossLabel: "Margin day + rugi di SL",
        initialPositionTitle: "Posisi 1 · Entry awal",
        entryFromPlanDescription: "Entry dari {account} Plan",
        positionMarginLabel: "Margin posisi ini",
        positionRiskAtStopLabel: "Risiko posisi di SL",
        fundsNeededAtFinalStopLabel: "Dana dibutuhkan di SL final",
        remainingFundsLabel: "Sisa dana",
        ifEntryFilledTitle: "Jika entry terisi",
        firstEntryOnlyDescription: "Hanya entry pertama · {lot} lot",
        filledEntrySummary:
          "1 posisi · {lot} lot · margin {margin} · rugi di SL {risk} ({riskPercentage}% dari dana bebas), profit bruto TP2 {profit} ({profitPercentage}% dari dana bebas).",
        whyNotAllLossLimitTitle: "Kenapa batas rugi tidak digunakan semua?",
        marginAndRiskExplanationLabel: "Penjelasan margin dan batas risiko",
        whyNotAllLossLimitDescription:
          "Dana harus cukup untuk menutup margin dan potensi rugi di Stop Loss. Jika lot ditambah, total kebutuhan dana bisa melewati batas plan.",
        estimateNotesTitle: "Catatan estimasi",
        estimateMayChangeLabel: "Hasil perhitungan dapat berubah",
        estimateNotesDescription:
          "Perhitungan hanya berdasarkan posisi yang terisi dan harga yang tercantum. Hasil aktual dapat berbeda karena spread, biaya transaksi, slippage, atau penutupan posisi lebih awal.",
        unusedPositionLabel: "Posisi {position} · {entry}",
        notUsedLabel: "Tidak dipakai",
        exceedsAccumulatedRiskLabel: "Melewati batas keras akumulasi rugi",
        conditionalFinancialPlanLabel: "Rencana finansial bersyarat",
        conditionalFinancialPlanDescription:
          "Kandidat ini hanya terblokir oleh dana atau batas rugi yang dimasukkan. Kandidat belum menjadi bagian dari rencana aktif.",
        marginUsedUntilHereLabel: "Margin terpakai sampai sini",
        totalRiskAtFinalStopLabel: "Total risiko di SL final",
        totalFundsAtFinalStopLabel: "Total dana yang dibutuhkan di SL final",
        additionalLossLimitLabel: "Tambahan batas rugi yang dibutuhkan",
        manualOrderWarning:
          "Tetap manual: harga bergerak melawan posisi saja bukan pemicu.",
        chooseScenarioUsageTitle: "Pilih satu skenario",
        chooseScenarioUsageDescription:
          "Pilih satu skenario naik atau turun sesuai keputusan kamu.",
        checkEntryUsageTitle: "Periksa level entry",
        checkEntryUsageDescription:
          "Entry di level yang tercantum pada trade plan.",
        confirmEntryUsageTitle: "Konfirmasi sebelum entry",
        confirmEntryUsageDescription:
          "Pastikan harga sudah menyentuh level, setup masih valid, belum ada invalidation, dan tidak ada risiko fundamental baru.",
        followStopTargetUsageTitle: "Ikuti Stop Loss dan target",
        followStopTargetUsageDescription:
          "Cut loss jika harga menyentuh Cut Loss / SL. Jangan memindahkan batas ini untuk menahan rugi.",
      },
    },
    performanceHistory: {
      title: "Riwayat & Performa Analisis",
      description:
        "Pantau rangkuman hasil dan perkembangan performa analisis Trade Pilot.",
      totalSummary: "{count} analisis total",
      summaryTabLabel: "Ringkasan",
      historyTabLabel: "Riwayat",
      allPeriodLabel: "Semua",
      history: {
        searchPlaceholder: "Cari instrumen, timeframe, atau status...",
        filterLabel: "Filter",
        filterTitle: "Filter status analisis",
        allStatusLabel: "Semua status",
        reanalyzeLabel: "Analisis Ulang",
        emptyTitle: "Riwayat tidak ditemukan",
        emptyDescription:
          "Coba ubah kata pencarian atau filter status yang dipilih.",
        pageLabel: "Halaman {current} dari {total}",
        showingLabel: "Menampilkan {start}–{end} dari {total}",
        previousLabel: "Sebelumnya",
        nextLabel: "Selanjutnya",
      },
      stats: {
        totalAnalysis: "Total analisis",
        stillValid: "Masih valid",
        expired: "Expired",
        stopLoss: "Stop Loss",
        takeProfitOne: "Take Profit 1",
        takeProfitTwo: "Take Profit 2",
        invalid: "Invalid",
      },
      consistentTimeframeLabel: "Timeframe paling konsisten",
      mostExpiredLabel: "Paling sering expired",
      mostStopLossLabel: "Paling sering kena SL",
      instrumentPerformanceTitle: "Performa per instrumen",
      instrumentPerformanceDescription:
        "Pilih instrumen untuk memfokuskan performa timeframe.",
      sampleLabel: "sampel",
      winRateLabel: "Win",
      viewHistoryLabel: "Lihat riwayat",
      timeframePerformanceTitle: "Performa per timeframe",
      timeframePerformanceDescription:
        "Win rate membandingkan TP dengan TP + SL. Setup expired hanya masuk ke completion rate.",
      timeframeColumnLabel: "Timeframe",
      sampleColumnLabel: "Sampel",
      validColumnLabel: "Masih valid",
      expiredColumnLabel: "Expired",
      winRateColumnLabel: "Win rate",
      completionColumnLabel: "Completion",
    },
    guide: {
      title: "Panduan Trade Pilot",
      description:
        "Pelajari cara membaca analisis dan menggunakan fitur Trade Pilot secara efektif.",
    },
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
    accountModeLabel: "Mode Akun",
    demoModeLabel: "Demo",
    realModeLabel: "Real",
    notificationCount: "1",
    notifications: {
      buttonLabel: "Buka notifikasi",
      title: "Notifikasi",
      unreadLabel: "{count} notifikasi belum dibaca",
      allReadLabel: "Semua notifikasi sudah dibaca",
      markAllReadLabel: "Tandai dibaca",
      unreadItemLabel: "Belum dibaca",
      items: [
        {
          id: "analysis-ready",
          title: "Analisis terbaru sudah siap",
          description:
            "Lihat arah market dan level skenario terbaru dari TradePilot.",
          timeLabel: "Baru saja",
          href: "/client-area/trade-pilot/analisis",
        },
        {
          id: "plan-reminder",
          title: "Trading Plan menunggu konfirmasi",
          description:
            "Periksa kembali level entry, Stop Loss, dan target sebelum digunakan.",
          timeLabel: "10 menit lalu",
          href: "/client-area/trade-pilot/analisis",
        },
        {
          id: "performance-update",
          title: "Riwayat performa diperbarui",
          description:
            "Ringkasan performa timeframe TradePilot terbaru sudah tersedia.",
          timeLabel: "Hari ini",
          href: "/client-area/trade-pilot/riwayat-performa",
        },
      ],
    },
    breadcrumb: "1003713406",
    navItems: [
      {
        label: "PRODUK",
        href: "/produk/prime",
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
        label: "Transaksi",
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
    viewOnly: {
      badge: "Secure",
      profileLabel: "Profil Nasabah",
      personalDescription: "Identitas dan informasi kontak utama",
      purposeDescription: "Profil investasi dan tujuan transaksi",
      emergencyDescription: "Kontak darurat yang dapat dihubungi",
      employmentDescription: "Informasi pekerjaan dan penghasilan",
      wealthDescription: "Aset dan portofolio kepemilikan",
      photoLabel: "Foto profil",
      accountIdLabel: "Nomor akun",
    },
    sections: {
      personal: "Data Pribadi",
      purpose: "Tujuan Pembukaan Rekening",
      emergency: "Data Darurat Yang Bisa Dihubungi",
      job: "Data Pekerjaan",
      wealth: "Data Kekayaan",
    },
    menuItems: {
      profile: "Profil",
      referral: "Referral Code",
      dailyStatement: "Daily Statement",
      withdrawal: "Withdrawal",
      deposit: "Deposit",
    },
    accountCenter: {
      statusLabel: "Status akun",
      servicesTitle: "Layanan akun",
      servicesDescription: "Pilih layanan yang ingin Anda lihat atau kelola.",
    },
    menuDescriptions: {
      profile: "Lihat identitas, kontak, pekerjaan, dan profil keuangan.",
      referral: "Fitur Referral Code sedang dinonaktifkan sementara.",
      dailyStatement: "Lihat ringkasan aktivitas dan laporan harian akun.",
      withdrawal: "Buka layanan pengajuan penarikan dana.",
      deposit: "Buka layanan informasi dan penyetoran dana.",
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
      sourceFunds: "Sumber Dana",
      estimatedTransaction: "Estimasi Nilai Transaksi",
      investmentExperience: "Pengalaman Investasi",
      investmentField: "Bidang Investasi",
      futuresExperience: "Pengalaman Transaksi Perdagangan Berjangka",
      familyAffiliation:
        "Memiliki keluarga yang bekerja di BAPPEBTI / Bursa Berjangka / Lembaga Kliring Berjangka",
      familyAffiliationDetail: "Keterangan",
      bankruptStatus: "Apakah Anda telah dinyatakan pailit oleh Pengadilan",
      emergencyName: "Nama",
      emergencyRelationship: "Hubungan",
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
      monthlyIncome: "Penghasilan Bulanan",
      annualIncome: "Penghasilan Pertahun",
      totalAssets: "Total Aset",
      propertyOwnership: "Kepemilikan Properti",
      vehicleOwnership: "Kepemilikan Kendaraan",
      houseLocation: "Rumah, Lokasi",
      njop: "Nilai Jual Objek Pajak (NJOP)",
      bankDeposit: "Deposit Bank",
      amount: "Jumlah",
      otherAssets: "Lainnya",
      otherInvestments: "Investasi Lainnya",
      bankAccount: "Rekening Bank",
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
  dailyStatementPage: {
    title: "Daily Statement",
    description:
      "Ringkasan posisi dan mutasi harian rekening perdagangan Anda.",
    downloadLabel: "Unduh Daily Statement",
    preparingLabel: "Menyiapkan PDF",
    tabs: {
      account: "Account Statement",
      open: "Open Position",
      settled: "Settled Statement",
    },
    labels: {
      accountNumber: "Account No.",
      aeCode: "AE Code",
      date: "Date",
      previousBalance: "Previous Balance",
      marginMovement: "Margin In/Out",
      storageRollover: "Storage/Rollover",
      profitLoss: "Profit/Loss",
      facilityFee: "Facility Fee",
      vat: "VAT",
      premiumDiscount: "Premium/Discount",
      interest: "Interest",
      adjustment: "Adjustment",
      newBalance: "New Balance",
      floatingPl: "Floating P/L",
      equity: "Equity",
      marginRequired: "Margin Required",
      effectiveMargin: "Effective Margin",
      equityRate: "Equity Rate",
      openPrice: "Open Price",
      marketPrice: "Market Price",
      closePrice: "Close Price",
    },
    openPositions: [
      {
        id: "open-xul10",
        symbol: "XUL10",
        side: "BUY",
        volume: "1.00 lot",
        openPrice: "$ 2,615.40",
        marketPrice: "$ 2,619.90",
        floatingPl: "+$ 450.00",
      },
      {
        id: "open-eu1010",
        symbol: "EU1010",
        side: "BUY",
        volume: "0.50 lot",
        openPrice: "$ 1.08320",
        marketPrice: "$ 1.08410",
        floatingPl: "+$ 45.00",
      },
    ],
    settledPositions: [
      {
        id: "settled-xul10",
        symbol: "XUL10",
        side: "BUY",
        volume: "2.00 lot",
        openPrice: "$ 2,594.20",
        closePrice: "$ 2,613.75",
        profitLoss: "+$ 3,910.00",
      },
      {
        id: "settled-hkk50",
        symbol: "HKK50_BBJ",
        side: "SELL",
        volume: "1.00 lot",
        openPrice: "$ 19,844.00",
        closePrice: "$ 19,812.00",
        profitLoss: "+$ 320.00",
      },
    ],
  },
  referralPage: {
    title: "Referral Code",
    description:
      "Ajak teman untuk bergabung dan nikmati reward dari aktivitas trading mereka.",
    hero: {
      eyebrow: "Referral Code",
      title: "Ajak Teman,\nDapatkan Reward",
      description:
        "Bagikan peluang ke jaringan kamu dan nikmati komisi dari teman yang aktif.",
      cta: "Daftar Sekarang",
    },
    accessTitle: "Kode dan link referral Anda",
    codeLabel: "Referral Code",
    linkLabel: "Link referral",
    copyLabel: "Salin kode",
    copyLinkLabel: "Salin link",
    copiedLabel: "Tersalin",
    stepsTitle: "Cara Kerja Referral Code",
    steps: [
      "Dapatkan link atau kode referal dari akun SG Solid Anda.",
      "Bagikan kepada calon pengguna.",
      "Pengguna mendaftar akun trading melalui referral Anda.",
      "Anda memperoleh komisi dari aktivitas trading sesuai ketentuan yang berlaku.",
    ],
    closing:
      "Segera bergabung dan mulai bagikan link Anda untuk mendapatkan keuntungan. Daftarkan diri Anda sekarang dan maksimalkan peluang melalui Referral Code.",
  },
  withdrawalHistoryPage: {
    title: "Riwayat Withdrawal",
    description:
      "Pantau status penarikan dana, rekening tujuan, dan referensi transaksi withdraw terbaru Anda.",
    summary: {
      totalCompleted: "Total Withdraw Selesai",
      activeRequests: "Permintaan Aktif",
      lastProcessed: "Terakhir Diproses",
      destinationBank: "Bank Tujuan Utama",
    },
    list: {
      requestId: "Request ID",
      requestDate: "Tanggal Request",
      processedDate: "Diproses",
      destination: "Tujuan Dana",
      amount: "Nominal",
      fee: "Biaya",
      netAmount: "Dana Bersih",
      reference: "Referensi",
      accountHolder: "Nama Pemilik Rekening",
      note: "Catatan",
    },
    status: {
      completed: "Berhasil",
      pending: "Menunggu",
      processing: "Diproses",
      rejected: "Ditolak",
    },
    emptyTitle: "Belum ada riwayat withdrawal.",
    emptyBody:
      "Permintaan withdrawal yang Anda buat akan tampil di halaman ini setelah tercatat di sistem.",
  },
  depositHistoryPage: {
    title: "Riwayat Deposit",
    description:
      "Lihat histori setoran dana, rekening pengirim, dan status kredit saldo ke akun trading Anda.",
    summary: {
      totalCompleted: "Total Deposit Berhasil",
      activeRequests: "Permintaan Aktif",
      lastProcessed: "Terakhir Diproses",
      sourceBank: "Bank Pengirim Utama",
    },
    list: {
      requestId: "Request ID",
      requestDate: "Tanggal Request",
      processedDate: "Diproses",
      source: "Sumber Dana",
      amount: "Nominal Transfer",
      fee: "Biaya",
      creditedAmount: "Dana Terkredit",
      reference: "Referensi",
      senderName: "Nama Pengirim",
      tradingAccount: "Akun Trading",
      note: "Catatan",
    },
    status: {
      completed: "Berhasil",
      pending: "Menunggu",
      processing: "Diproses",
      rejected: "Ditolak",
    },
    emptyTitle: "Belum ada riwayat deposit.",
    emptyBody:
      "Permintaan deposit Anda akan muncul di halaman ini setelah tercatat di sistem.",
  },
  marketSignalDetail: {
    updatedLabel: "Update",
    biasLabel: "Bias",
    biasUpLabel: "Potensi Menguat",
    biasDownLabel: "Potensi Melemah",
    bidPriceLabel: "Bid Price",
    askPriceLabel: "Ask Price",
    todayMovementLabel: "Pergerakan Hari Ini",
    latestSignalTitle: "Sinyal Terbaru",
    entryLabel: "Entry",
    takeProfitLabel: "Take Profit",
    stopLossLabel: "Stop Loss",
    sourceLabel: "Sumber",
    timeframeLabel: "Timeframe Analisis Signal",
    buyActionLabel: "Potensi Buy",
    sellActionLabel: "Potensi Sell",
    latestNewsTitle: "Berita Terbaru",
    historyTitle: "Riwayat Signal",
    transactionModal: {
      buyBadgeLabel: "Sinyal Buy",
      sellBadgeLabel: "Sinyal Sell",
      buyTitle: "Transaksi Buy Tersedia di Aplikasi",
      sellTitle: "Transaksi Sell Tersedia di Aplikasi",
      buyDescription:
        "Untuk membuka posisi Buy pada sinyal ini, silakan login melalui aplikasi Solid Gold Berjangka.",
      sellDescription:
        "Untuk membuka posisi Sell pada sinyal ini, silakan login melalui aplikasi Solid Gold Berjangka.",
      closeLabel: "Tutup",
    },
  },
  tradingView: {
    disclaimerLabel: "Disclaimer:",
    disclaimerTradingView:
      "Chart yang kami gunakan disediakan oleh TradingView, sebuah platform charting bagi para trader dan investor dari seluruh penjuru dunia. Temukan berbagai instrumen finansial seperti chart EURUSD, XAUUSD dan instrumen forex lainnya, dan juga peralatan seperti kalender ekonomi, berita finansial, dan masih banyak lagi yang tersedia secara gratis dan dapat membantu dalam aktivitas trading dan investasi Anda.",
  },
  fundTransferModal: {
    closeLabel: "Tutup",
    depositTitle: "Oops! Deposit Belum Bisa Dilakukan di Website",
    withdrawalTitle: "Oops! Withdrawal Belum Bisa Dilakukan di Website",
    depositDescription:
      "Jangan khawatir, Anda tetap dapat melakukan deposit dengan mudah melalui aplikasi.",
    withdrawalDescription:
      "Jangan khawatir, Anda tetap dapat melakukan withdrawal dengan mudah melalui aplikasi.",
  },
};
