import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import type { LiveQuotePayload, LiveQuoteTick } from "@/lib/live-quotes";
import {
  getLiveQuoteDisplay,
  getSortedSymbols,
  QUOTE_ORDER,
} from "@/lib/live-quotes";
import type { NewsFeedArticle } from "@/lib/news.shared";

import { formatLocaleDateTime, type AppLocale } from "@/locales";
import type {
  AccountSnapshot,
  AccountMode,
  ActionId,
  ArticleItem,
  BreakingNewsItem,
  ClientAreaBannerRecord,
  ClientAreaHeroSlide,
  DashboardCopy,
  MarketPrice,
  PositionItem,
  TabId,
  TransactionHistoryItem,
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
  PositionItem,
  SlideGraphic,
  SlideItem,
  TabId,
  TransactionHistoryItem,
} from "@/components/organisms/client-area.types";

type ClientAreaAccountModeData = {
  currentAccount: AccountSnapshot;
  positions: PositionItem[];
  transactionHistory: TransactionHistoryItem[];
};

export const TABS: TabId[] = [
  "home",
  "market",
  "transaction",
  "news",
  "account",
];
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

type ClientAreaTradingViewSymbolKey = (typeof QUOTE_ORDER)[number];

export type ClientAreaTradingViewPreset = {
  id: string;
  label: string;
  marketCode: ClientAreaTradingViewSymbolKey;
  symbol: string;
};

const CLIENT_AREA_TRADING_VIEW_SYMBOL_BY_MARKET_CODE: Record<
  ClientAreaTradingViewSymbolKey,
  string
> = {
  XUL10: "OANDA:XAUUSD",
  BCO10_BBJ: "TVC:UKOIL",
  HKK50_BBJ: "VANTAGE:HK50",
  JPK50_BBJ: "SPREADEX:NIKKEI",
  DX1010_BBJ: "CAPITALCOM:DXY",
  AU1010_BBJ: "OANDA:AUDUSD",
  EU1010_BBJ: "OANDA:EURUSD",
  GU1010_BBJ: "OANDA:GBPUSD",
  UC1010_BBJ: "OANDA:USDCAD",
  UJ1010_BBJ: "OANDA:USDJPY",
  UI1010_BBJ: "FX_IDC:USDIDR",
};

const CLIENT_AREA_TRADING_VIEW_PRESETS: ClientAreaTradingViewPreset[] =
  QUOTE_ORDER.map((marketCode) => ({
    id: marketCode.toLowerCase(),
    label: marketCode,
    marketCode,
    symbol: CLIENT_AREA_TRADING_VIEW_SYMBOL_BY_MARKET_CODE[marketCode],
  }));

export function getClientAreaTradingViewPresets() {
  return CLIENT_AREA_TRADING_VIEW_PRESETS;
}

export function getClientAreaTradingViewPresetById(presetId: string) {
  return CLIENT_AREA_TRADING_VIEW_PRESETS.find(
    (preset) => preset.id === presetId,
  );
}

export function getClientAreaTradingViewPresetByMarketCode(marketCode: string) {
  return CLIENT_AREA_TRADING_VIEW_PRESETS.find(
    (preset) => preset.marketCode === marketCode,
  );
}

export function resolveClientAreaMarketChartHref(
  locale: AppLocale,
  marketCode: string,
) {
  const preset = getClientAreaTradingViewPresetByMarketCode(marketCode);

  if (!preset) {
    return resolveLocalizedHref(locale, "/client-area/market");
  }

  return resolveLocalizedHref(locale, `/client-area/market/${preset.id}`);
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

export function getClientAreaAccountModeData(
  copy: DashboardCopy,
  accountMode: AccountMode,
): ClientAreaAccountModeData {
  if (accountMode === "real") {
    return {
      currentAccount: copy.realAccount,
      positions: copy.realPositions,
      transactionHistory: copy.realTransactionHistory,
    };
  }

  return {
    currentAccount: copy.demoAccount,
    positions: copy.demoPositions,
    transactionHistory: copy.demoTransactionHistory,
  };
}

export function getClientAreaEconomicCalendarPreview<
  T extends {
    impactScore: number;
    date?: string | null;
    displayTime?: string;
  },
>(events: T[]) {
  const highImpactEvents: T[] = [];
  const mediumImpactEvents: T[] = [];
  const lowImpactEvents: T[] = [];

  for (const event of events) {
    if (event.impactScore >= 3) {
      highImpactEvents.push(event);
      continue;
    }

    if (event.impactScore === 2) {
      mediumImpactEvents.push(event);
      continue;
    }

    lowImpactEvents.push(event);
  }

  let remainingSlots = 3;
  const highQuota = Math.min(highImpactEvents.length, remainingSlots);
  remainingSlots -= highQuota;

  const mediumQuota = Math.min(mediumImpactEvents.length, remainingSlots);
  remainingSlots -= mediumQuota;

  const lowQuota = Math.min(lowImpactEvents.length, remainingSlots);

  let remainingHighQuota = highQuota;
  let remainingMediumQuota = mediumQuota;
  let remainingLowQuota = lowQuota;
  const selectedEvents: T[] = [];

  for (const event of events) {
    if (selectedEvents.length >= 3) {
      break;
    }

    if (event.impactScore >= 3 && remainingHighQuota > 0) {
      selectedEvents.push(event);
      remainingHighQuota -= 1;
      continue;
    }

    if (event.impactScore === 2 && remainingMediumQuota > 0) {
      selectedEvents.push(event);
      remainingMediumQuota -= 1;
      continue;
    }

    if (event.impactScore <= 1 && remainingLowQuota > 0) {
      selectedEvents.push(event);
      remainingLowQuota -= 1;
    }
  }

  return {
    events: selectedEvents,
    isHighImpactOnly:
      selectedEvents.length > 0 &&
      selectedEvents.every((event) => event.impactScore >= 3),
  };
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
    imageUrl: article.imageSrc,
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
      languageLabel: "IDN",
      referenceLabel: "Ref dashboard client",
      quickDepositLabel: "Quick Deposit",
      quickTradeLabel: "Quick Trade",
      sentimentLabel: "Market Sentiment",
      buyersLabel: "BUYERS",
      sellersLabel: "SELLERS",
      marketWatchTitle: "Market Watchlist",
      economicCalendarTitle: "Kalender Ekonomi",
      economicCalendarEmpty: "Belum ada agenda ekonomi untuk ditampilkan.",
      economicCalendarHighImpactLabel: "High Impact",
      viewMoreLabel: "View More...",
      transactionTitle: "Transaksi",
      transactionHistoryTitle: "Transaction History",
      newsTitle: "Market News & Insights",
      accountTitle: "Profil & Pengaturan Akun",
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
          imageUrl: "/assets/img-card-2.png",
          category: "COMMODITIES",
          title:
            "Minyak berjangka mengakhiri sesi dan bulan lebih tinggi, tetapi turun di kuartal ini",
          excerpt:
            "Minyak mentah Brent menetap di atas $80 per barel pada hari Jumat, menopang pergerakan positif jangka pendek.",
          timeAgo: "2 menit lalu",
        },
        {
          imageUrl: "/assets/img-card-3.png",
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
      demoPositions: [
        {
          id: "xul10-buy",
          symbol: "XUL10",
          instrument: "Gold",
          side: "buy",
          orderNumber: "1234567890",
          volume: "1.20 Lot",
          openPrice: "4,058.20",
          currentPrice: "4,070.66",
          floatingPl: "+$1,495.20",
          storageFee: "$ 0.00",
          facilityFee: "$ -15.00*",
          vat: "$ -1.65",
          openedAt: "Hari ini, 09:02 WIB",
        },
        {
          id: "hkk50-sell",
          symbol: "HKK50_BBJ",
          instrument: "Hang Seng",
          side: "sell",
          orderNumber: "2345678901",
          volume: "1.00 Lot",
          openPrice: "23,110",
          currentPrice: "23,061",
          floatingPl: "+$490.00",
          storageFee: "$ 0.00",
          facilityFee: "$ -10.00*",
          vat: "$ -1.10",
          openedAt: "Hari ini, 10:41 WIB",
        },
        {
          id: "bco10-sell",
          symbol: "BCO10_BBJ",
          instrument: "Crude Oil",
          side: "sell",
          orderNumber: "3456789012",
          volume: "0.50 Lot",
          openPrice: "78.90",
          currentPrice: "79.12",
          floatingPl: "-$110.00",
          storageFee: "$ 0.00",
          facilityFee: "$ -6.50*",
          vat: "$ -0.72",
          openedAt: "Kemarin, 15:18 WIB",
        },
      ],
      realPositions: [
        {
          id: "xul10-real-buy",
          symbol: "XUL10",
          instrument: "Gold",
          side: "buy",
          orderNumber: "4567890123",
          volume: "0.40 Lot",
          openPrice: "4,051.10",
          currentPrice: "4,070.66",
          floatingPl: "+$782.40",
          storageFee: "$ 0.00",
          facilityFee: "$ -5.00*",
          vat: "$ -0.55",
          openedAt: "Hari ini, 08:24 WIB",
        },
        {
          id: "uj1010-real-sell",
          symbol: "UJ1010_BBJ",
          instrument: "USD/JPY",
          side: "sell",
          orderNumber: "5678901234",
          volume: "0.30 Lot",
          openPrice: "159.220",
          currentPrice: "159.040",
          floatingPl: "+$540.00",
          storageFee: "$ 0.00",
          facilityFee: "$ -4.50*",
          vat: "$ -0.49",
          openedAt: "Hari ini, 13:16 WIB",
        },
      ],
      demoTransactionHistory: [
        {
          id: "history-gold-profit-1",
          type: "credit",
          instrument: "Gold",
          symbol: "XUL10_BBJ",
          statusLabel: "Liq : $ 4557.80",
          statusTone: "profit",
          orderNumber: "2345678901",
          volume: "1 Lot",
          date: "06 Juli 2026",
          time: "14:10:00",
          sideLabel: "Sell Date",
          sidePrice: "06 Juli 2026",
          closeLabel: "Sell Price",
          closePrice: "$ 4557.80",
          facilityFee: "$ -15.00",
          vat: "$ -1.65",
          profitLoss: "$ 1.90",
        },
        {
          id: "history-gold-canceled-1",
          type: "debit",
          instrument: "Gold",
          symbol: "XUL10_BBJ",
          statusLabel: "Canceled SELL",
          statusTone: "warning",
          orderNumber: "8765432100",
          volume: "1 Lot",
          date: "06 Juli 2026",
          time: "14:15:00",
          sideLabel: "Sell Date",
          sidePrice: "06 Juli 2026",
          closeLabel: "Sell Price",
          closePrice: "$ 4590.60 / $ 4586.60",
          facilityFee: "$ -15.00",
          vat: "$ -1.65",
          profitLoss: "-",
        },
        {
          id: "history-gold-buy-profit-1",
          type: "credit",
          instrument: "Gold",
          symbol: "XUL10_BBJ",
          statusLabel: "BUY $ 4560.20",
          statusTone: "profit",
          orderNumber: "78901234567",
          volume: "1 Lot",
          date: "06 Juli 2026",
          time: "15:03:00",
          sideLabel: "Buy",
          sidePrice: "$ 4560.20",
          closeLabel: "Buy Price",
          closePrice: "$ 4560.20",
          facilityFee: "$ -15.00",
          vat: "$ -1.65",
          profitLoss: "$ 3.40",
        },
        {
          id: "history-gold-loss-1",
          type: "debit",
          instrument: "Gold",
          symbol: "XUL10_BBJ",
          statusLabel: "Liq : $ 4548.40",
          statusTone: "loss",
          orderNumber: "5647382910",
          volume: "1 Lot",
          date: "05 Juli 2026",
          time: "11:24:00",
          sideLabel: "Buy Date",
          sidePrice: "05 Juli 2026",
          closeLabel: "Buy Price",
          closePrice: "$ 4552.10",
          facilityFee: "$ -15.00",
          vat: "$ -1.65",
          profitLoss: "-$ 3.70",
        },
        {
          id: "history-gold-canceled-2",
          type: "debit",
          instrument: "Gold",
          symbol: "XUL10_BBJ",
          statusLabel: "Canceled BUY",
          statusTone: "warning",
          orderNumber: "9081726354",
          volume: "0.50 Lot",
          date: "05 Juli 2026",
          time: "15:42:00",
          sideLabel: "Buy Date",
          sidePrice: "05 Juli 2026",
          closeLabel: "Buy Price",
          closePrice: "$ 4549.60 / $ 4551.20",
          facilityFee: "$ -7.50",
          vat: "$ -0.83",
          profitLoss: "-",
        },
      ],
      realTransactionHistory: [
        {
          id: "real-history-gold-liq",
          type: "credit",
          instrument: "Gold",
          symbol: "XUL10_BBJ",
          statusLabel: "Liq : $ 4557.80",
          statusTone: "profit",
          orderNumber: "5432167890",
          volume: "1 Lot",
          date: "06 Juli 2026",
          time: "14:10:00",
          sideLabel: "Buy Date",
          sidePrice: "06 Juli 2026",
          openLabel: "Buy Price",
          openPrice: "$ 4555.90",
          facilityFee: "$ -15.00",
          vat: "$ -1.65",
          profitLoss: "$ 1.90",
        },
        {
          id: "real-history-gold-loss",
          type: "debit",
          instrument: "Gold",
          symbol: "XUL10_BBJ",
          statusLabel: "Liq : $ 4550.40",
          statusTone: "loss",
          orderNumber: "6989809024",
          volume: "1 Lot",
          date: "05 Juli 2026",
          time: "10:12:00",
          sideLabel: "Buy Date",
          sidePrice: "05 Juli 2026",
          closeLabel: "Buy Price",
          closePrice: "$ 4555.80",
          facilityFee: "$ -15.00",
          vat: "$ -1.65",
          profitLoss: "-$ 5.40",
        },
        {
          id: "real-history-gold-canceled-sell",
          type: "debit",
          instrument: "Gold",
          symbol: "XUL10_BBJ",
          statusLabel: "Canceled SELL",
          statusTone: "warning",
          orderNumber: "6543219870",
          volume: "1 Lot",
          date: "05 Juli 2026",
          time: "11:48:00",
          sideLabel: "Sell Date",
          sidePrice: "05 Juli 2026",
          closeLabel: "Sell Price",
          closePrice: "$ 4550.00 / $ 4548.90",
          facilityFee: "$ -15.00",
          vat: "$ -1.65",
          profitLoss: "-",
        },
        {
          id: "real-history-gold-profit-buy",
          type: "credit",
          instrument: "Gold",
          symbol: "XUL10_BBJ",
          statusLabel: "BUY $ 4551.10",
          statusTone: "profit",
          orderNumber: "7812456903",
          volume: "0.50 Lot",
          date: "04 Juli 2026",
          time: "09:36:00",
          sideLabel: "Buy",
          sidePrice: "$ 4551.10",
          closeLabel: "Buy Price",
          closePrice: "$ 4551.10",
          facilityFee: "$ -7.50",
          vat: "$ -0.83",
          profitLoss: "$ 2.35",
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
    languageLabel: "ENG",
    referenceLabel: "Client dashboard reference",
    quickDepositLabel: "Quick Deposit",
    quickTradeLabel: "Quick Trade",
    sentimentLabel: "Market Sentiment",
    buyersLabel: "BUYERS",
    sellersLabel: "SELLERS",
    marketWatchTitle: "Market Watchlist",
    economicCalendarTitle: "Economic Calendar",
    economicCalendarEmpty: "No economic events are available right now.",
    economicCalendarHighImpactLabel: "High Impact",
    viewMoreLabel: "View More...",
    transactionTitle: "Transaction",
    transactionHistoryTitle: "Transaction History",
    newsTitle: "Market News & Insights",
    accountTitle: "Account Profile & Settings",
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
        imageUrl: "/assets/img-card-2.png",
        category: "COMMODITIES",
        title:
          "Crude futures ended the session and month higher, but the quarter still closed softer",
        excerpt:
          "Brent crude settled above $80 per barrel on Friday, helping support short-term upside momentum.",
        timeAgo: "2 mins ago",
      },
      {
        imageUrl: "/assets/img-card-3.png",
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
    demoPositions: [
      {
        id: "xul10-buy",
        symbol: "XUL10",
        instrument: "Gold",
        side: "buy",
        orderNumber: "1234567890",
        volume: "1.20 Lot",
        openPrice: "4,058.20",
        currentPrice: "4,070.66",
        floatingPl: "+$1,495.20",
        storageFee: "$ 0.00",
        facilityFee: "$ -15.00*",
        vat: "$ -1.65",
        openedAt: "Today, 09:02 WIB",
      },
      {
        id: "hkk50-sell",
        symbol: "HKK50_BBJ",
        instrument: "Hang Seng",
        side: "sell",
        orderNumber: "2345678901",
        volume: "1.00 Lot",
        openPrice: "23,110",
        currentPrice: "23,061",
        floatingPl: "+$490.00",
        storageFee: "$ 0.00",
        facilityFee: "$ -10.00*",
        vat: "$ -1.10",
        openedAt: "Today, 10:41 WIB",
      },
      {
        id: "bco10-sell",
        symbol: "BCO10_BBJ",
        instrument: "Crude Oil",
        side: "sell",
        orderNumber: "3456789012",
        volume: "0.50 Lot",
        openPrice: "78.90",
        currentPrice: "79.12",
        floatingPl: "-$110.00",
        storageFee: "$ 0.00",
        facilityFee: "$ -6.50*",
        vat: "$ -0.72",
        openedAt: "Yesterday, 15:18 WIB",
      },
    ],
    realPositions: [
      {
        id: "xul10-real-buy",
        symbol: "XUL10",
        instrument: "Gold",
        side: "buy",
        orderNumber: "4567890123",
        volume: "0.40 Lot",
        openPrice: "4,051.10",
        currentPrice: "4,070.66",
        floatingPl: "+$782.40",
        storageFee: "$ 0.00",
        facilityFee: "$ -5.00*",
        vat: "$ -0.55",
        openedAt: "Today, 08:24 WIB",
      },
      {
        id: "uj1010-real-sell",
        symbol: "UJ1010_BBJ",
        instrument: "USD/JPY",
        side: "sell",
        orderNumber: "5678901234",
        volume: "0.30 Lot",
        openPrice: "159.220",
        currentPrice: "159.040",
        floatingPl: "+$540.00",
        storageFee: "$ 0.00",
        facilityFee: "$ -4.50*",
        vat: "$ -0.49",
        openedAt: "Today, 13:16 WIB",
      },
    ],
    demoTransactionHistory: [
      {
        id: "history-gold-profit",
        type: "credit",
        instrument: "Gold",
        symbol: "XUL10_BBJ",
        statusLabel: "Liq : $ 4557.80",
        statusTone: "profit",
        orderNumber: "2345678901",
        volume: "1 Lot",
        date: "06 July 2026",
        time: "14:10:00",
        sideLabel: "Sell Date",
        sidePrice: "06 July 2026",
        closeLabel: "Sell Price",
        closePrice: "$ 4557.80",
        facilityFee: "$ -15.00",
        vat: "$ -1.65",
        profitLoss: "$ 1.90",
      },
      {
        id: "history-gold-canceled",
        type: "debit",
        instrument: "Gold",
        symbol: "XUL10_BBJ",
        statusLabel: "Canceled SELL",
        statusTone: "warning",
        orderNumber: "8765432100",
        volume: "1 Lot",
        date: "06 July 2026",
        time: "14:15:00",
        sideLabel: "Sell Date",
        sidePrice: "06 July 2026",
        closeLabel: "Sell Price",
        closePrice: "$ 4590.60 / $ 4586.60",
        facilityFee: "$ -15.00",
        vat: "$ -1.65",
        profitLoss: "-",
      },
      {
        id: "history-gold-buy",
        type: "credit",
        instrument: "Gold",
        symbol: "XUL10_BBJ",
        statusLabel: "BUY $ 4560.20",
        statusTone: "profit",
        orderNumber: "78901234567",
        volume: "1 Lot",
        date: "06 July 2026",
        time: "15:03:00",
        sideLabel: "Buy",
        sidePrice: "$ 4560.20",
        closeLabel: "Buy Price",
        closePrice: "$ 4560.20",
        facilityFee: "$ -15.00",
        vat: "$ -1.65",
        profitLoss: "$ 3.40",
      },
      {
        id: "history-gold-loss",
        type: "debit",
        instrument: "Gold",
        symbol: "XUL10_BBJ",
        statusLabel: "Liq : $ 4548.40",
        statusTone: "loss",
        orderNumber: "5647382910",
        volume: "1 Lot",
        date: "05 July 2026",
        time: "11:24:00",
        sideLabel: "Buy Date",
        sidePrice: "05 July 2026",
        closeLabel: "Buy Price",
        closePrice: "$ 4552.10",
        facilityFee: "$ -15.00",
        vat: "$ -1.65",
        profitLoss: "-$ 3.70",
      },
      {
        id: "history-gold-canceled-buy",
        type: "debit",
        instrument: "Gold",
        symbol: "XUL10_BBJ",
        statusLabel: "Canceled BUY",
        statusTone: "warning",
        orderNumber: "9081726354",
        volume: "0.50 Lot",
        date: "05 July 2026",
        time: "15:42:00",
        sideLabel: "Buy Date",
        sidePrice: "05 July 2026",
        closeLabel: "Buy Price",
        closePrice: "$ 4549.60 / $ 4551.20",
        facilityFee: "$ -7.50",
        vat: "$ -0.83",
        profitLoss: "-",
      },
    ],
    realTransactionHistory: [
      {
        id: "real-history-gold-liq",
        type: "credit",
        instrument: "Gold",
        symbol: "XUL10_BBJ",
        statusLabel: "Liq : $ 4557.80",
        statusTone: "profit",
        orderNumber: "5432167890",
        volume: "1 Lot",
        date: "06 July 2026",
        time: "14:10:00",
        sideLabel: "Buy Date",
        sidePrice: "06 July 2026",
        openLabel: "Buy Price",
        openPrice: "$ 4555.90",
        facilityFee: "$ -15.00",
        vat: "$ -1.65",
        profitLoss: "$ 1.90",
      },
      {
        id: "real-history-gold-loss",
        type: "debit",
        instrument: "Gold",
        symbol: "XUL10_BBJ",
        statusLabel: "Liq : $ 4550.40",
        statusTone: "loss",
        orderNumber: "6989809024",
        volume: "1 Lot",
        date: "05 July 2026",
        time: "10:12:00",
        sideLabel: "Buy Date",
        sidePrice: "05 July 2026",
        closeLabel: "Buy Price",
        closePrice: "$ 4555.80",
        facilityFee: "$ -15.00",
        vat: "$ -1.65",
        profitLoss: "-$ 5.40",
      },
      {
        id: "real-history-gold-canceled-sell",
        type: "debit",
        instrument: "Gold",
        symbol: "XUL10_BBJ",
        statusLabel: "Canceled SELL",
        statusTone: "warning",
        orderNumber: "6543219870",
        volume: "1 Lot",
        date: "05 July 2026",
        time: "11:48:00",
        sideLabel: "Sell Date",
        sidePrice: "05 July 2026",
        closeLabel: "Sell Price",
        closePrice: "$ 4550.00 / $ 4548.90",
        facilityFee: "$ -15.00",
        vat: "$ -1.65",
        profitLoss: "-",
      },
      {
        id: "real-history-gold-profit-buy",
        type: "credit",
        instrument: "Gold",
        symbol: "XUL10_BBJ",
        statusLabel: "BUY $ 4551.10",
        statusTone: "profit",
        orderNumber: "7812456903",
        volume: "0.50 Lot",
        date: "04 July 2026",
        time: "09:36:00",
        sideLabel: "Buy",
        sidePrice: "$ 4551.10",
        closeLabel: "Buy Price",
        closePrice: "$ 4551.10",
        facilityFee: "$ -7.50",
        vat: "$ -0.83",
        profitLoss: "$ 2.35",
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

type ClientAreaMarketFeed = {
  bid: number;
  ask: number;
  change: number;
  liveSymbol: string;
};

export type ClientAreaMarketCategory = "Commodity" | "Index" | "Forex";

const CLIENT_AREA_MARKET_CATEGORY_BY_SYMBOL: Record<
  string,
  ClientAreaMarketCategory
> = {
  XUL10: "Commodity",
  BCO10_BBJ: "Commodity",
  HKK50_BBJ: "Index",
  JPK50_BBJ: "Index",
  DX1010_BBJ: "Index",
  AU1010_BBJ: "Forex",
  EU1010_BBJ: "Forex",
  GU1010_BBJ: "Forex",
  UC1010_BBJ: "Forex",
  UJ1010_BBJ: "Forex",
  UI1010_BBJ: "Forex",
};

const CLIENT_AREA_FEATURED_MARKET_SYMBOLS: Record<
  ClientAreaMarketCategory,
  string[]
> = {
  Commodity: ["XUL10", "BCO10_BBJ"],
  Index: ["HKK50_BBJ", "JPK50_BBJ", "DX1010_BBJ"],
  Forex: [
    "EU1010_BBJ",
    "UJ1010_BBJ",
    "GU1010_BBJ",
    "AU1010_BBJ",
    "UC1010_BBJ",
    "UI1010_BBJ",
  ],
};

const CLIENT_AREA_MARKET_FEEDS: ClientAreaMarketFeed[] = [
  {
    bid: 2550.21,
    ask: 2551.45,
    change: 0.56,
    liveSymbol: "XUL10",
  },
  {
    bid: 78.45,
    ask: 78.5,
    change: -1.12,
    liveSymbol: "BCO10_BBJ",
  },
  {
    bid: 23069,
    ask: 23053,
    change: -0.16,
    liveSymbol: "HKK50_BBJ",
  },
  {
    bid: 1.1789,
    ask: 1.1785,
    change: 0.12,
    liveSymbol: "EU1010_BBJ",
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

function buildClientAreaMarketPrice(
  liveSymbol: string,
  values: {
    ask: number;
    bid: number;
    buy?: string;
    change: number;
    dateTime?: string;
    high?: string;
    low?: string;
    open?: string;
    price?: string;
    sell?: string;
    time?: string;
  },
): MarketPrice {
  const display = getLiveQuoteDisplay(liveSymbol);

  return {
    symbol: display.label,
    name: display.symbol ?? liveSymbol,
    code: liveSymbol,
    bid: values.bid,
    ask: values.ask,
    change: values.change,
    price: values.price,
    sell: values.sell,
    buy: values.buy,
    open: values.open,
    high: values.high,
    low: values.low,
    time: values.time,
    dateTime: values.dateTime,
  };
}

export function getClientAreaMarketCategory(
  symbol?: string,
): ClientAreaMarketCategory {
  if (!symbol) {
    return "Commodity";
  }

  return CLIENT_AREA_MARKET_CATEGORY_BY_SYMBOL[symbol] ?? "Forex";
}

export function getClientAreaMarketPrices(
  quotes: LiveQuotePayload,
): MarketPrice[] {
  return CLIENT_AREA_MARKET_FEEDS.map((fallback) => {
    const { liveSymbol } = fallback;
    const tick = quotes[liveSymbol];

    if (!tick) {
      return buildClientAreaMarketPrice(liveSymbol, fallback);
    }

    return buildClientAreaMarketPrice(liveSymbol, {
      bid: parseLiveQuoteNumber(tick.buy) ?? fallback.bid,
      ask: parseLiveQuoteNumber(tick.sell) ?? fallback.ask,
      change: resolveLiveQuoteChange(tick, fallback.change),
      price: tick.price,
      sell: tick.sell,
      buy: tick.buy,
      open: tick.oprice,
      high: tick.hprice,
      low: tick.lprice,
      time: tick.time,
      dateTime: tick.date_time,
    });
  });
}

export function getClientAreaAllMarketPrices(
  quotes: LiveQuotePayload,
): MarketPrice[] {
  return getSortedSymbols(quotes).map((symbol) => {
    const tick = quotes[symbol];
    const display = getLiveQuoteDisplay(symbol);

    return {
      symbol: display.label,
      name: display.symbol ?? symbol,
      code: symbol,
      bid: parseLiveQuoteNumber(tick.buy) ?? 0,
      ask: parseLiveQuoteNumber(tick.sell) ?? 0,
      change: resolveLiveQuoteChange(tick, 0),
      price: tick.price,
      sell: tick.sell,
      buy: tick.buy,
      open: tick.oprice,
      high: tick.hprice,
      low: tick.lprice,
      time: tick.time,
      dateTime: tick.date_time,
    };
  });
}

export function getClientAreaFeaturedMarketPrices(
  quotes: LiveQuotePayload,
): MarketPrice[] {
  const availablePrices = getClientAreaAllMarketPrices(quotes);

  if (availablePrices.length > 0) {
    return (
      Object.entries(CLIENT_AREA_FEATURED_MARKET_SYMBOLS) as Array<
        [ClientAreaMarketCategory, string[]]
      >
    )
      .map(([, symbols]) =>
        symbols
          .map((symbol) =>
            availablePrices.find((item) => (item.code ?? item.name) === symbol),
          )
          .find(Boolean),
      )
      .filter((item): item is MarketPrice => Boolean(item));
  }

  return (
    Object.entries(CLIENT_AREA_FEATURED_MARKET_SYMBOLS) as Array<
      [ClientAreaMarketCategory, string[]]
    >
  )
    .map(([, symbols]) =>
      symbols
        .map((symbol) =>
          CLIENT_AREA_MARKET_FEEDS.find((item) => item.liveSymbol === symbol),
        )
        .find(Boolean),
    )
    .filter((item): item is ClientAreaMarketFeed => Boolean(item))
    .map((item) => buildClientAreaMarketPrice(item.liveSymbol, item));
}

export function getInitialPrices(): MarketPrice[] {
  return CLIENT_AREA_MARKET_FEEDS.map((item) =>
    buildClientAreaMarketPrice(item.liveSymbol, item),
  );
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
