import type { AppLocale } from "./config";

export type NewsArticle = {
  slug: string;
  category: string;
  publishedAt: string;
  readTime: string;
  title: string;
  summary: string;
  body: string[];
  tags: string[];
};

export type MarketPulseItem = {
  label: string;
  value: string;
  change: string;
  note: string;
};

export type MarketCalendarEvent = {
  time: string;
  market: string;
  impact: "high" | "medium" | "low";
  event: string;
  previous: string;
  forecast: string;
};

export type ExchangeRateItem = {
  pair: string;
  rate: string;
  change: string;
  context: string;
};

export type MarketResourcePageIntro = {
  meta: {
    title: string;
    description: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
  };
};

export type NewsPageContent = {
  newsPage: MarketResourcePageIntro;
  calendarPage: MarketResourcePageIntro;
  ratesPage: MarketResourcePageIntro;
  featured: {
    label: string;
    title: string;
    summary: string;
    publishedAt: string;
    readTime: string;
    takeaways: string[];
  };
  marketPulse: {
    title: string;
    subtitle: string;
    items: MarketPulseItem[];
  };
  latest: {
    eyebrow: string;
    title: string;
    subtitle: string;
    articles: NewsArticle[];
  };
  calendar: {
    eyebrow: string;
    title: string;
    subtitle: string;
    events: MarketCalendarEvent[];
  };
  rates: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: ExchangeRateItem[];
  };
  cta: {
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
  };
};

const newsPageContent: Record<AppLocale, NewsPageContent> = {
  id: {
    newsPage: {
      meta: {
        title: "Berita Market Hari Ini",
        description:
          "Ringkasan berita pasar dan insight trading untuk trader SG Mini.",
      },
      hero: {
        eyebrow: "Newsroom SG Mini",
        title:
          "Berita market yang ringkas, cepat dibaca, dan relevan untuk keputusan trading.",
        description:
          "Pantau headline utama dan rangkuman market terbaru dalam halaman yang fokus untuk trader aktif.",
        primaryCta: "Lihat Berita Terkini",
        secondaryCta: "Kalender Ekonomi",
      },
    },
    calendarPage: {
      meta: {
        title: "Kalender Ekonomi Trading Hari Ini",
        description:
          "Pantau agenda ekonomi penting dan event berdampak tinggi untuk trader SG Mini.",
      },
      hero: {
        eyebrow: "Kalender Ekonomi",
        title:
          "Event ekonomi penting yang perlu masuk radar sebelum Anda ambil posisi.",
        description:
          "Gunakan halaman ini untuk memantau agenda makro, menyaring potensi volatilitas, dan merapikan manajemen risiko sebelum sesi aktif.",
        primaryCta: "Lihat Agenda Hari Ini",
        secondaryCta: "Historical Data",
      },
    },
    ratesPage: {
      meta: {
        title: "Historical Data Market",
        description:
          "Pantau pergerakan pasangan mata uang utama dan konteks pasar ringkas untuk trader SG Mini.",
      },
      hero: {
        eyebrow: "Historical Data",
        title:
          "Historical data market lintas instrumen dalam satu tampilan yang cepat dipindai sebelum analisa lebih lanjut.",
        description:
          "Lihat level penting pada pair yang paling sering dipantau, lengkap dengan konteks singkat untuk membantu membaca sentimen awal market.",
        primaryCta: "Lihat Historical Data",
        secondaryCta: "Lihat Berita",
      },
    },
    featured: {
      label: "Sorotan Hari Ini",
      title:
        "Dolar AS bergerak terbatas menjelang rilis inflasi, emas bertahan dekat area resistensi.",
      summary:
        "Pelaku pasar menahan posisi besar sambil menunggu data ekonomi berikutnya. Kondisi ini membuat pergerakan intraday lebih sensitif terhadap headline singkat dan perubahan yield obligasi.",
      publishedAt: "2026-06-08T08:15:00+07:00",
      readTime: "4 menit baca",
      takeaways: [
        "Fokus utama pasar masih tertuju pada inflasi AS dan arah suku bunga.",
        "Emas tetap diminati sebagai lindung nilai ketika volatilitas naik.",
        "Pasangan mayor cenderung bergerak dalam range pendek sebelum data keluar.",
      ],
    },
    marketPulse: {
      title: "Market Pulse",
      subtitle: "Snapshot cepat untuk memetakan sentimen sesi hari ini.",
      items: [
        {
          label: "Indeks Dolar",
          value: "104.18",
          change: "+0.12%",
          note: "Menguat tipis setelah yield tenor pendek naik.",
        },
        {
          label: "Emas Spot",
          value: "2,356.40",
          change: "-0.08%",
          note: "Tertahan di area resistensi setelah reli pekan lalu.",
        },
        {
          label: "Minyak WTI",
          value: "78.62",
          change: "+0.44%",
          note: "Didukung ekspektasi pasokan yang lebih ketat.",
        },
      ],
    },
    latest: {
      eyebrow: "Berita Terkini",
      title: "Update yang perlu masuk watchlist trader.",
      subtitle:
        "Setiap artikel diringkas untuk membantu screening ide trading tanpa membuka banyak tab.",
      articles: [
        {
          slug: "rupiah-open-mixed",
          category: "Forex",
          publishedAt: "2026-06-08T07:40:00+07:00",
          readTime: "3 menit baca",
          title:
            "Rupiah dibuka mixed, arus asing dan ekspektasi The Fed masih jadi penentu.",
          summary:
            "Pergerakan awal sesi domestik masih berhati-hati. Trader memantau kombinasi sentimen global dan permintaan valas korporasi.",
          body: [
            "Rupiah memulai sesi dengan pergerakan terbatas karena pasar domestik belum mendapat katalis baru yang cukup kuat untuk mendorong arah yang konsisten. Pelaku pasar masih menimbang sentimen global, terutama ekspektasi arah kebijakan The Fed dan perubahan yield obligasi AS.",
            "Di saat yang sama, permintaan valas dari pelaku korporasi menjaga perdagangan tetap aktif tetapi selektif. Dalam kondisi seperti ini, trader jangka pendek cenderung menunggu konfirmasi tambahan dari arus asing, stabilitas indeks dolar, dan pembukaan pasar regional sebelum mengambil posisi yang lebih agresif.",
          ],
          tags: ["USDIDR", "Sentimen Asia", "The Fed"],
        },
        {
          slug: "gold-range-breakout",
          category: "Komoditas",
          publishedAt: "2026-06-08T09:05:00+07:00",
          readTime: "5 menit baca",
          title:
            "Emas menunggu breakout baru, volume tipis membuat fake move lebih mungkin terjadi.",
          summary:
            "Zona resistance jangka pendek kembali diuji. Confirmation candle dan data makro menjadi filter utama untuk entry.",
          body: [
            "Emas kembali mendekati area resistance jangka pendek, tetapi volume transaksi yang belum solid membuat peluang breakout yang bersih masih terbatas. Dalam situasi seperti ini, pergerakan singkat di atas resistance berisiko berubah menjadi false breakout bila tidak diikuti partisipasi pasar yang lebih luas.",
            "Trader cenderung menempatkan confirmation candle, reaksi dolar AS, dan data makro sebagai filter utama sebelum masuk posisi. Pendekatan yang lebih disiplin diperlukan karena market yang tipis sering menghasilkan pergerakan cepat namun tidak bertahan lama.",
          ],
          tags: ["XAUUSD", "Risk Off", "Volatilitas"],
        },
        {
          slug: "asia-equity-tone",
          category: "Indeks",
          publishedAt: "2026-06-08T10:10:00+07:00",
          readTime: "4 menit baca",
          title:
            "Bursa Asia bergerak selektif, Nasdaq futures tetap jadi panduan risiko.",
          summary:
            "Kinerja saham teknologi global masih menjadi acuan, sementara pasar Asia cenderung merespons data domestik secara terpisah.",
          body: [
            "Perdagangan saham Asia bergerak selektif karena investor belum melihat alasan kuat untuk mendorong risk appetite secara merata. Sentimen terhadap sektor teknologi global masih menjadi acuan utama, sehingga Nasdaq futures tetap dipantau sebagai indikator awal arah risiko lintas pasar.",
            "Meski begitu, respons tiap bursa Asia tetap dipengaruhi faktor domestik masing-masing, mulai dari data ekonomi, kebijakan lokal, hingga arus dana asing. Akibatnya, pergerakan regional terlihat tidak sepenuhnya sinkron dan lebih menuntut pendekatan selektif dalam membaca korelasi risiko.",
          ],
          tags: ["Nasdaq", "Sentimen Risiko", "Asia"],
        },
        {
          slug: "oil-inventory-outlook",
          category: "Energi",
          publishedAt: "2026-06-08T11:20:00+07:00",
          readTime: "4 menit baca",
          title:
            "Minyak mentah menguat menjelang data persediaan mingguan dan update OPEC+.",
          summary:
            "Harga bertahan positif setelah pelaku pasar memperkirakan pasokan akan lebih ketat pada kuartal berikutnya.",
          body: [
            "Harga minyak mentah bergerak naik secara bertahap menjelang rilis data persediaan mingguan dan pembaruan dari OPEC+. Pasar mulai memasukkan kemungkinan bahwa pasokan akan tetap relatif ketat, terutama bila produsen utama mempertahankan disiplin output pada kuartal berikutnya.",
            "Meski tren jangka pendek terlihat konstruktif, pelaku pasar tetap berhati-hati terhadap potensi kejutan dari sisi inventori dan perubahan nada kebijakan produsen. Karena itu, reaksi harga setelah data rilis berpotensi lebih penting daripada arah awal perdagangan sebelum pengumuman.",
          ],
          tags: ["WTI", "OPEC+", "Inventory"],
        },
      ],
    },
    calendar: {
      eyebrow: "Kalender",
      title: "Agenda ekonomi yang berpotensi menggerakkan harga.",
      subtitle:
        "Prioritaskan event berdampak tinggi untuk manajemen risiko, terutama jika Anda trading intraday.",
      events: [
        {
          time: "09:30 WIB",
          market: "CNY",
          impact: "medium",
          event: "Consumer Price Index",
          previous: "0.3%",
          forecast: "0.4%",
        },
        {
          time: "16:00 WIB",
          market: "EUR",
          impact: "medium",
          event: "Sentix Investor Confidence",
          previous: "-2.5",
          forecast: "-1.2",
        },
        {
          time: "19:30 WIB",
          market: "USD",
          impact: "high",
          event: "Core Inflation Preview",
          previous: "0.2%",
          forecast: "0.3%",
        },
        {
          time: "21:00 WIB",
          market: "CAD",
          impact: "low",
          event: "Ivey PMI",
          previous: "51.2",
          forecast: "52.0",
        },
      ],
    },
    rates: {
      eyebrow: "Historical Data",
      title: "Pergerakan pasangan utama yang paling sering dipantau.",
      subtitle:
        "Gunakan level ini sebagai konteks awal sebelum berpindah ke chart dan eksekusi trading.",
      items: [
        {
          pair: "USD/IDR",
          rate: "16,245",
          change: "+0.21%",
          context: "Dolar tetap kuat selama permintaan safe haven bertahan.",
        },
        {
          pair: "EUR/USD",
          rate: "1.0842",
          change: "-0.11%",
          context:
            "Euro tertahan karena pasar menilai ulang laju pemangkasan suku bunga.",
        },
        {
          pair: "GBP/USD",
          rate: "1.2768",
          change: "+0.07%",
          context: "Sterling relatif stabil dengan volatilitas menurun.",
        },
        {
          pair: "USD/JPY",
          rate: "156.34",
          change: "+0.18%",
          context: "Pasangan ini sensitif terhadap perubahan yield AS.",
        },
      ],
    },
    cta: {
      title: "Butuh eksekusi yang lebih cepat setelah membaca market?",
      description:
        "Buka akun SG Mini untuk mengakses platform trading, live quote, dan pemantauan market dari satu ekosistem.",
      primaryCta: "Buka Akun",
      secondaryCta: "Lihat Beranda",
    },
  },
  en: {
    newsPage: {
      meta: {
        title: "Market News Today",
        description:
          "A compact market news page with concise insights for SG Mini traders.",
      },
      hero: {
        eyebrow: "SG Mini Newsroom",
        title: "Market news designed for fast reads and trading decisions.",
        description:
          "Track the latest headlines and concise market recaps in a page built for active traders.",
        primaryCta: "View Latest News",
        secondaryCta: "Economic Calendar",
      },
    },
    calendarPage: {
      meta: {
        title: "Today's Economic Calendar",
        description:
          "Track high-impact economic events and macro releases for SG Mini traders.",
      },
      hero: {
        eyebrow: "Economic Calendar",
        title:
          "The macro events that deserve attention before you take a trade.",
        description:
          "Use this page to monitor scheduled releases, anticipate volatility, and tighten your risk management before active sessions begin.",
        primaryCta: "View Today's Events",
        secondaryCta: "Historical Data",
      },
    },
    ratesPage: {
      meta: {
        title: "Market Historical Data",
        description:
          "Track historical market data across major instruments for SG Mini traders.",
      },
      hero: {
        eyebrow: "Historical Data",
        title:
          "Historical market data in one view you can scan before moving deeper into analysis.",
        description:
          "Review the most monitored pairs together with quick context to frame the market before you move into execution mode.",
        primaryCta: "View Historical Data",
        secondaryCta: "View News",
      },
    },
    featured: {
      label: "Today Highlight",
      title:
        "The US dollar holds steady ahead of inflation data while gold stays near resistance.",
      summary:
        "Market participants are keeping positions lighter before the next macro release. That makes intraday moves more reactive to short headlines and bond-yield shifts.",
      publishedAt: "2026-06-08T08:15:00+07:00",
      readTime: "4 min read",
      takeaways: [
        "US inflation and rate expectations remain the market's primary focus.",
        "Gold still attracts hedging demand when volatility picks up.",
        "Major FX pairs are likely to stay range-bound until the next data release.",
      ],
    },
    marketPulse: {
      title: "Market Pulse",
      subtitle: "A quick snapshot to frame today's trading sentiment.",
      items: [
        {
          label: "Dollar Index",
          value: "104.18",
          change: "+0.12%",
          note: "Slightly firmer as short-dated yields push higher.",
        },
        {
          label: "Spot Gold",
          value: "2,356.40",
          change: "-0.08%",
          note: "Holding below resistance after last week's rally.",
        },
        {
          label: "WTI Crude",
          value: "78.62",
          change: "+0.44%",
          note: "Supported by tighter supply expectations.",
        },
      ],
    },
    latest: {
      eyebrow: "Latest News",
      title: "Updates that deserve a spot on a trader's watchlist.",
      subtitle:
        "Each story is condensed to help you screen opportunities without opening a dozen tabs.",
      articles: [
        {
          slug: "rupiah-open-mixed",
          category: "Forex",
          publishedAt: "2026-06-08T07:40:00+07:00",
          readTime: "3 min read",
          title:
            "The rupiah opens mixed as foreign flows and Fed expectations stay in focus.",
          summary:
            "Early domestic trading remains cautious while traders balance global sentiment with corporate FX demand.",
          body: [
            "The rupiah started the session in a narrow range as domestic participants waited for stronger directional catalysts. Global sentiment remains anchored to Fed expectations and US yield moves, leaving regional currencies sensitive to even modest shifts in dollar positioning.",
            "At the same time, corporate foreign-exchange demand is keeping the market active without producing a decisive trend. In this setup, short-term traders are likely to wait for clearer confirmation from foreign flows, dollar stability, and broader regional price action before increasing exposure.",
          ],
          tags: ["USDIDR", "Asia Sentiment", "Fed"],
        },
        {
          slug: "gold-range-breakout",
          category: "Commodities",
          publishedAt: "2026-06-08T09:05:00+07:00",
          readTime: "5 min read",
          title:
            "Gold waits for a fresh breakout as light volume raises the risk of false moves.",
          summary:
            "Short-term resistance is back in play. Confirmation candles and macro data are the main entry filters.",
          body: [
            "Gold is testing short-term resistance once again, but the lack of strong participation makes a clean breakout harder to trust. Thin market conditions increase the chance that a push above resistance turns into a false move rather than the start of sustained follow-through.",
            "For that reason, traders are relying more heavily on confirmation candles, US dollar behavior, and incoming macro data before committing to fresh positions. In a low-volume environment, disciplined execution matters more because fast moves can reverse just as quickly.",
          ],
          tags: ["XAUUSD", "Risk Off", "Volatility"],
        },
        {
          slug: "asia-equity-tone",
          category: "Indices",
          publishedAt: "2026-06-08T10:10:00+07:00",
          readTime: "4 min read",
          title:
            "Asian equities trade selectively while Nasdaq futures continue to guide risk tone.",
          summary:
            "Global tech performance remains a reference point, even as Asian markets respond to local data on their own terms.",
          body: [
            "Asian equities are trading selectively as investors look for a stronger reason to reprice risk more broadly. Global technology sentiment still matters, which is why Nasdaq futures remain a leading reference point for early-session risk appetite.",
            "Even so, each Asian market is still reacting to its own domestic inputs, from local data to policy expectations and foreign participation. That keeps regional performance uneven and makes cross-market read-throughs less straightforward than in a fully synchronized risk-on session.",
          ],
          tags: ["Nasdaq", "Risk Sentiment", "Asia"],
        },
        {
          slug: "oil-inventory-outlook",
          category: "Energy",
          publishedAt: "2026-06-08T11:20:00+07:00",
          readTime: "4 min read",
          title:
            "Crude oil edges higher ahead of weekly inventory data and fresh OPEC+ signals.",
          summary:
            "Prices stay firm as traders continue to price in tighter supply conditions for the next quarter.",
          body: [
            "Crude oil is edging higher ahead of weekly inventory figures and another round of OPEC+ signaling. The market is gradually pricing in the idea that supply conditions could remain tight if major producers stay disciplined into the next quarter.",
            "That said, traders remain cautious about overcommitting before the data confirms the supply picture. The market reaction after the release may prove more important than the initial pre-data move, especially if inventories or producer guidance challenge the current tightening narrative.",
          ],
          tags: ["WTI", "OPEC+", "Inventory"],
        },
      ],
    },
    calendar: {
      eyebrow: "Calendar",
      title: "Economic events that can materially move price.",
      subtitle:
        "Prioritize high-impact releases for risk management, especially if you trade intraday.",
      events: [
        {
          time: "09:30 WIB",
          market: "CNY",
          impact: "medium",
          event: "Consumer Price Index",
          previous: "0.3%",
          forecast: "0.4%",
        },
        {
          time: "16:00 WIB",
          market: "EUR",
          impact: "medium",
          event: "Sentix Investor Confidence",
          previous: "-2.5",
          forecast: "-1.2",
        },
        {
          time: "19:30 WIB",
          market: "USD",
          impact: "high",
          event: "Core Inflation Preview",
          previous: "0.2%",
          forecast: "0.3%",
        },
        {
          time: "21:00 WIB",
          market: "CAD",
          impact: "low",
          event: "Ivey PMI",
          previous: "51.2",
          forecast: "52.0",
        },
      ],
    },
    rates: {
      eyebrow: "Historical Data",
      title: "Major pairs traders tend to monitor most closely.",
      subtitle:
        "Use these levels as context before switching into charts and execution mode.",
      items: [
        {
          pair: "USD/IDR",
          rate: "16,245",
          change: "+0.21%",
          context: "The dollar stays firm while safe-haven demand holds up.",
        },
        {
          pair: "EUR/USD",
          rate: "1.0842",
          change: "-0.11%",
          context:
            "The euro softens as traders reassess the pace of rate cuts.",
        },
        {
          pair: "GBP/USD",
          rate: "1.2768",
          change: "+0.07%",
          context: "Sterling remains relatively stable as volatility cools.",
        },
        {
          pair: "USD/JPY",
          rate: "156.34",
          change: "+0.18%",
          context: "This pair remains sensitive to changes in US yields.",
        },
      ],
    },
    cta: {
      title: "Need faster execution after reading the market?",
      description:
        "Open an SG Mini account to access trading tools, live quotes, and market monitoring in one workflow.",
      primaryCta: "Open Account",
      secondaryCta: "View Homepage",
    },
  },
};

export function getNewsPageContent(locale: AppLocale) {
  return newsPageContent[locale];
}
