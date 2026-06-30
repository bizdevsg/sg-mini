import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import type { LiveQuotePayload, LiveQuoteTick } from "@/lib/live-quotes";
import type { NewsFeedArticle } from "@/lib/news.shared";

import { formatLocaleDateTime, type AppLocale } from "@/locales";
import type {
  AccountMode,
  ActionId,
  ArticleItem,
  BreakingNewsItem,
  ClientAreaBannerRecord,
  ClientAreaHeroSlide,
  DashboardCopy,
  MarketPrice,
  TabId,
} from "@/components/organisms/client-area.types";

export type {
  AccountMode,
  AccountSnapshot,
  ActionId,
  ArticleItem,
  BreakingNewsItem,
  ClientAreaBannerRecord,
  ClientAreaHeroSlide,
  DashboardCopy,
  MarketPrice,
  SlideGraphic,
  SlideItem,
  TabId,
  TransactionItem,
} from "@/components/organisms/client-area.types";

export const TABS: TabId[] = ["home", "market", "transaction", "news", "account"];
export const ACTION_IDS: ActionId[] = [
  "education",
  "products",
  "withdraw",
  "deposit",
  "temporary",
];

export function resolveLocalizedHref(locale: AppLocale, href = "/") {
  if (href === "/") {
    return `/${locale}`;
  }

  if (href.startsWith(`/${locale}`)) {
    return href;
  }

  return href.startsWith("/") ? `/${locale}${href}` : href;
}

export function resolveClientAreaTabHref(locale: AppLocale, tab: TabId) {
  if (tab === "home") {
    return resolveLocalizedHref(locale, "/client-area");
  }

  return resolveLocalizedHref(locale, `/client-area/${tab}`);
}

export function formatUsd(value: number) {
  return `$ ${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatSignedPercent(value: number) {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function formatSignedUsd(value: number) {
  const prefix = value >= 0 ? "+" : "-";
  return `${prefix}$${Math.abs(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatClock(locale: AppLocale) {
  const formatter = new Intl.DateTimeFormat(
    locale === "id" ? "id-ID" : "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Jakarta",
    },
  );

  return `${formatter.format(new Date())} WIB`;
}

function parsePublishedTimestamp(value: string) {
  const directTimestamp = new Date(value).getTime();

  if (Number.isFinite(directTimestamp)) {
    return directTimestamp;
  }

  const normalizedTimestamp = new Date(value.replace(" ", "T")).getTime();

  return Number.isFinite(normalizedTimestamp) ? normalizedTimestamp : null;
}

export function formatClientAreaNewsTimeAgo(
  publishedAt: string,
  locale: AppLocale,
) {
  const publishedTimestamp = parsePublishedTimestamp(publishedAt);

  if (publishedTimestamp === null) {
    return formatLocaleDateTime(publishedAt, locale);
  }

  const diffMs = Math.max(0, Date.now() - publishedTimestamp);
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) {
    return locale === "id" ? "Baru saja" : "Just now";
  }

  if (diffMinutes < 60) {
    return locale === "id"
      ? `${diffMinutes} menit lalu`
      : `${diffMinutes} mins ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return locale === "id" ? `${diffHours} jam lalu` : `${diffHours} hours ago`;
  }

  const diffDays = Math.floor(diffHours / 24);

  if (diffDays < 7) {
    return locale === "id" ? `${diffDays} hari lalu` : `${diffDays} days ago`;
  }

  return formatLocaleDateTime(publishedAt, locale);
}

export function mapNewsFeedArticleToBreakingNews(
  article: NewsFeedArticle,
  locale: AppLocale,
): BreakingNewsItem {
  return {
    id: article.id,
    title: article.title,
    timeAgo: formatClientAreaNewsTimeAgo(article.publishedAt, locale),
  };
}

export function mapNewsFeedArticleToClientAreaArticle(
  article: NewsFeedArticle,
  locale: AppLocale,
): ArticleItem {
  return {
    id: article.id,
    slug: article.slug,
    category: article.displayCategory.toUpperCase(),
    title: article.title,
    excerpt: article.summary,
    timeAgo: formatClientAreaNewsTimeAgo(article.publishedAt, locale),
  };
}

export function getDashboardCopy(locale: AppLocale): DashboardCopy {
  if (locale === "id") {
    return {
      breakingLabel: "Breaking News",
      liveLabel: "SGB LIVE",
      languageLabel: "IDN",
      referenceLabel: "Ref dashboard client",
      quickDepositLabel: "Quick Deposit",
      quickTradeLabel: "Quick Trade",
      sentimentLabel: "Market Sentiment",
      buyersLabel: "BUYERS",
      sellersLabel: "SELLERS",
      marketWatchTitle: "Market Watchlist",
      transactionTitle: "Riwayat Transaksi",
      newsTitle: "Market News & Insights",
      accountTitle: "Profil & Pengaturan Akun",
      recommendationsLabel: "Rekomendasi",
      marketTableHeaders: {
        symbol: "Symbol",
        name: "Nama",
        bid: "Bid",
        ask: "Ask",
        change: "Perubahan",
        action: "Aksi",
      },
      slides: [
        {
          badge: "Keamanan Dana Terjamin",
          badgeIcon: ["fas", "shield-halved"],
          title: "Dana Trading Aman Dengan SEGREGATED ACCOUNT",
          description: "di PT Solid Gold Berjangka",
          graphicType: "padlock",
        },
        {
          badge: "Edukasi Gratis",
          badgeIcon: ["fas", "graduation-cap"],
          title: "Kuasai Pasar Emas Dengan Webinar Eksklusif",
          description: "Daftar gratis langsung melalui modul Education kami",
          graphicType: "education",
        },
        {
          badge: "Promo Spesial",
          badgeIcon: ["fas", "gift"],
          title: "Nikmati Komisi Terendah & Spread Menarik",
          description: "Hubungi tim dukungan kami untuk detail akun Pro",
          graphicType: "gift",
        },
      ],
      breakingNews: [
        {
          title:
            "Minyak berjangka mengakhiri sesi dan bulan lebih tinggi, tetapi turun di kuartal ini.",
          timeAgo: "2 menit lalu",
        },
        {
          title:
            "Suku bunga Federal Reserve berpotensi turun bulan depan, emas mulai rebound tinggi.",
          timeAgo: "5 menit lalu",
        },
        {
          title:
            "Laporan inflasi global menjadi katalis utama pergerakan logam mulia hari ini.",
          timeAgo: "12 menit lalu",
        },
      ],
      articles: [
        {
          category: "COMMODITIES",
          title:
            "Minyak berjangka mengakhiri sesi dan bulan lebih tinggi, tetapi turun di kuartal ini",
          excerpt:
            "Minyak mentah Brent menetap di atas $80 per barel pada hari Jumat, menopang pergerakan positif jangka pendek.",
          timeAgo: "2 menit lalu",
        },
        {
          category: "GOLD",
          title:
            "Harga emas menahan level support di tengah spekulasi suku bunga Federal Reserve",
          excerpt:
            "Emas bergerak di atas $2550 ditopang ekspektasi pasar terhadap arah kebijakan moneter terbaru.",
          timeAgo: "15 menit lalu",
        },
      ],
      demoAccount: {
        typeLabel: "Akun Demo",
        accountId: "BBH10158",
        accountOwner: "Demo User BBH10158",
        email: "user.sgb@demo-trading.com",
        status: "KYC Verified",
        broker: "PT Solid Gold Berjangka",
        liquidationType: "Auto-Stop Out at 3407.50",
        balance: 50000,
        floatingPl: -3730,
        floatingDelta: "+2.98",
        equity: 47117,
        equityDelta: "+0.87",
        marginRequired: 2000,
        effectiveMargin: 105038.3,
        callMarginPlace: 0,
        equityRatio: 2725.96,
        autoLiquidation: 3407.5,
      },
      realAccount: {
        typeLabel: "Akun Real",
        accountId: "SGB88102",
        accountOwner: "Real User SGB88102",
        email: "live.sgb@solidgold.co.id",
        status: "Active Live",
        broker: "PT Solid Gold Berjangka",
        liquidationType: "Auto-Stop Out at 500.00",
        balance: 12500,
        floatingPl: 420,
        floatingDelta: "+1.42",
        equity: 12920,
        equityDelta: "+0.33",
        marginRequired: 1000,
        effectiveMargin: 31200,
        callMarginPlace: 0,
        equityRatio: 1292,
        autoLiquidation: 500,
      },
      transactions: [
        {
          id: "loss",
          type: "debit",
          title: "Loss / Floating Adjust",
          subtitle: "Hari ini, 09:02 WIB",
          amount: "-$3,730.00",
        },
        {
          id: "funding",
          type: "credit",
          title: "System Demo Funding",
          subtitle: "Kemarin, 14:35 WIB",
          amount: "+$50,000.00",
        },
      ],
      modalTitles: {
        education: "Portal Edukasi SGB",
        products: "Produk Keuangan SGB",
        withdraw: "Withdraw Dana Berjangka",
        deposit: "Deposit Dana Aman",
        temporary: "Temporary Mode",
      },
      modalDescriptions: {
        education:
          "Belajar dasar-dasar trading komoditi, analisis pasar teknikal, dan strategi entry secara gratis.",
        products:
          "Kami menawarkan instrumen investasi unggulan berlisensi resmi untuk trader retail dan profesional.",
        withdraw:
          "Tarik profit atau dana modal dari rekening terpisah Anda dengan prosedur yang aman.",
        deposit:
          "Simulasi top-up dana langsung untuk menyokong margin dan kelancaran eksekusi akun.",
        temporary:
          "Gunakan menu ini untuk melacak status transaksi gantung atau verifikasi dokumen sementara.",
      },
    };
  }

  return {
    breakingLabel: "Breaking News",
    liveLabel: "SGB LIVE",
    languageLabel: "ENG",
    referenceLabel: "Client dashboard reference",
    quickDepositLabel: "Quick Deposit",
    quickTradeLabel: "Quick Trade",
    sentimentLabel: "Market Sentiment",
    buyersLabel: "BUYERS",
    sellersLabel: "SELLERS",
    marketWatchTitle: "Market Watchlist",
    transactionTitle: "Transaction History",
    newsTitle: "Market News & Insights",
    accountTitle: "Account Profile & Settings",
    recommendationsLabel: "Recommendations",
    marketTableHeaders: {
      symbol: "Symbol",
      name: "Name",
      bid: "Bid",
      ask: "Ask",
      change: "Change",
      action: "Action",
    },
    slides: [
      {
        badge: "Fund Security",
        badgeIcon: ["fas", "shield-halved"],
        title: "Your Trading Funds Stay Safer With SEGREGATED ACCOUNT",
        description: "under PT Solid Gold Berjangka",
        graphicType: "padlock",
      },
      {
        badge: "Free Education",
        badgeIcon: ["fas", "graduation-cap"],
        title: "Master Gold Trading With Exclusive Live Webinars",
        description: "Register directly from our Education module",
        graphicType: "education",
      },
      {
        badge: "Special Offer",
        badgeIcon: ["fas", "gift"],
        title: "Enjoy Tighter Spreads And Lower Trading Costs",
        description: "Contact support to unlock our Pro account setup",
        graphicType: "gift",
      },
    ],
    breakingNews: [
      {
        title:
          "Crude futures ended the session and month higher, but the quarter still closed softer.",
        timeAgo: "2 mins ago",
      },
      {
        title:
          "Federal Reserve rate cut expectations are back in focus as gold finds fresh support.",
        timeAgo: "5 mins ago",
      },
      {
        title:
          "Global inflation data remains the main catalyst for precious metals price action today.",
        timeAgo: "12 mins ago",
      },
    ],
    articles: [
      {
        category: "COMMODITIES",
        title:
          "Crude futures ended the session and month higher, but the quarter still closed softer",
        excerpt:
          "Brent crude settled above $80 per barrel on Friday, helping support short-term upside momentum.",
        timeAgo: "2 mins ago",
      },
      {
        category: "GOLD",
        title:
          "Gold prices continue holding support amid fresh Federal Reserve rate-cut speculation",
        excerpt:
          "Gold hovered above $2550 as markets reassessed the latest expectations for monetary easing.",
        timeAgo: "15 mins ago",
      },
    ],
    demoAccount: {
      typeLabel: "Demo Account",
      accountId: "BBH10158",
      accountOwner: "Demo User BBH10158",
      email: "user.sgb@demo-trading.com",
      status: "KYC Verified",
      broker: "PT Solid Gold Berjangka",
      liquidationType: "Auto-Stop Out at 3407.50",
      balance: 50000,
      floatingPl: -3730,
      floatingDelta: "+2.98",
      equity: 47117,
      equityDelta: "+0.87",
      marginRequired: 2000,
      effectiveMargin: 105038.3,
      callMarginPlace: 0,
      equityRatio: 2725.96,
      autoLiquidation: 3407.5,
    },
    realAccount: {
      typeLabel: "Real Account",
      accountId: "SGB88102",
      accountOwner: "Real User SGB88102",
      email: "live.sgb@solidgold.co.id",
      status: "Active Live",
      broker: "PT Solid Gold Berjangka",
      liquidationType: "Auto-Stop Out at 500.00",
      balance: 12500,
      floatingPl: 420,
      floatingDelta: "+1.42",
      equity: 12920,
      equityDelta: "+0.33",
      marginRequired: 1000,
      effectiveMargin: 31200,
      callMarginPlace: 0,
      equityRatio: 1292,
      autoLiquidation: 500,
    },
    transactions: [
      {
        id: "loss",
        type: "debit",
        title: "Loss / Floating Adjust",
        subtitle: "Today, 09:02 WIB",
        amount: "-$3,730.00",
      },
      {
        id: "funding",
        type: "credit",
        title: "System Demo Funding",
        subtitle: "Yesterday, 14:35 WIB",
        amount: "+$50,000.00",
      },
    ],
    modalTitles: {
      education: "SGB Education Portal",
      products: "SGB Financial Products",
      withdraw: "Futures Withdrawal",
      deposit: "Secure Deposit",
      temporary: "Temporary Mode",
    },
    modalDescriptions: {
      education:
        "Learn futures trading basics, technical market analysis, and practical execution workflows for free.",
      products:
        "We offer licensed trading instruments for retail and professional traders with structured support.",
      withdraw:
        "Withdraw profit or capital from your segregated account flow using the registered banking setup.",
      deposit:
        "Simulate an instant account top-up to support available margin and trading continuity.",
      temporary:
        "Use this section to track pending transactions or temporary document verification status.",
    },
  };
}

type ClientAreaMarketFeed = MarketPrice & {
  liveSymbol: string;
};

const CLIENT_AREA_MARKET_FEEDS: ClientAreaMarketFeed[] = [
  {
    symbol: "GOLD",
    name: "XAU10_BBJ",
    bid: 2550.21,
    ask: 2551.45,
    change: 0.56,
    liveSymbol: "XUL10",
  },
  {
    symbol: "CRUDE OIL",
    name: "CL_COAL",
    bid: 78.45,
    ask: 78.5,
    change: -1.12,
    liveSymbol: "BCO10_BBJ",
  },
  {
    symbol: "SILVER",
    name: "XAGUSD_BBJ",
    bid: 30.12,
    ask: 30.16,
    change: 0.28,
    liveSymbol: "XAGUSD",
  },
];

function parseLiveQuoteNumber(value: string | undefined) {
  if (!value) {
    return null;
  }

  const normalizedValue = Number.parseFloat(value);
  return Number.isFinite(normalizedValue) ? normalizedValue : null;
}

function resolveLiveQuoteChange(tick: LiveQuoteTick, fallbackChange: number) {
  const price = parseLiveQuoteNumber(tick.price);
  const openPrice = parseLiveQuoteNumber(tick.oprice);

  if (price === null || openPrice === null || openPrice === 0) {
    return fallbackChange;
  }

  return Number((((price - openPrice) / openPrice) * 100).toFixed(2));
}

export function getClientAreaMarketPrices(quotes: LiveQuotePayload): MarketPrice[] {
  return CLIENT_AREA_MARKET_FEEDS.map(({ liveSymbol, ...fallback }) => {
    const tick = quotes[liveSymbol];

    if (!tick) {
      return fallback;
    }

    return {
      ...fallback,
      bid: parseLiveQuoteNumber(tick.buy) ?? fallback.bid,
      ask: parseLiveQuoteNumber(tick.sell) ?? fallback.ask,
      change: resolveLiveQuoteChange(tick, fallback.change),
    };
  });
}

export function getInitialPrices(): MarketPrice[] {
  return CLIENT_AREA_MARKET_FEEDS.map(({ liveSymbol: _liveSymbol, ...item }) => ({
    ...item,
  }));
}

export function getQuickActionIconMap(): Record<ActionId, IconProp> {
  return {
    education: ["fas", "book-open"],
    products: ["fas", "box-open"],
    withdraw: ["fas", "arrow-up-from-bracket"],
    deposit: ["fas", "circle-down"],
    temporary: ["fas", "clipboard-question"],
  };
}

export function getSidebarIconMap(): Record<TabId, IconProp> {
  return {
    home: ["fas", "house"],
    market: ["fas", "chart-line"],
    transaction: ["fas", "wallet"],
    news: ["fas", "newspaper"],
    account: ["fas", "user-gear"],
  };
}

export function resolveSignalBadge(change: number) {
  return change >= 0
    ? {
        className: "text-emerald-500",
        icon: ["fas", "arrow-up"] as IconProp,
      }
    : {
        className: "text-rose-500",
        icon: ["fas", "arrow-down"] as IconProp,
      };
}

export function buildClientAreaHeroSlides(
  copy: DashboardCopy,
  banners: ClientAreaBannerRecord[],
): ClientAreaHeroSlide[] {
  if (!banners.length) {
    return copy.slides.map((slide, index) => ({
      ...slide,
      id: `fallback-${index}`,
    }));
  }

  return banners.map((banner, index) => ({
    ...copy.slides[index % copy.slides.length],
    id: String(banner.id),
    imageUrl: banner.image_url,
  }));
}
