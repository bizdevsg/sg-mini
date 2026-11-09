import type { LucideIcon } from "lucide-react";
import type { LiveQuotePayload, LiveQuoteTick } from "@/lib/live-quotes";
import { getLiveQuoteDisplay, getSortedSymbols } from "@/lib/live-quotes";
import type { NewsFeedArticle } from "@/lib/news.shared";
import {
  House,
  ChartNoAxesCombined,
  Rocket,
  Newspaper,
  BookOpen,
  CircleUserRound,
  ArrowUp,
  ArrowDown,
  NotebookText,
  PackageSearch,
  BanknoteArrowDown,
  BanknoteArrowUp,
  BadgeDollarSign,
} from "lucide-react";

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
} from "@/components/organisms/client-area.types";

export type ClientAreaAdvertiseVisibilityMode = "auto" | "show" | "hide";

type ClientAreaAccountModeData = {
  currentAccount: AccountSnapshot;
};

export const TABS: TabId[] = [
  "home",
  "market",
  "news",
  "trade-pilot",
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

  if (tab === "trade-pilot") {
    return resolveLocalizedHref(locale, "/client-area/trade-pilot/analisis");
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

export function getClientAreaAccountModeData(
  copy: DashboardCopy,
  accountMode: AccountMode,
): ClientAreaAccountModeData {
  return {
    currentAccount: accountMode === "real" ? copy.realAccount : copy.demoAccount,
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

export function formatMarketSignalUpdateTime(
  updatedAt: string,
  locale: AppLocale,
) {
  const parsedDate = new Date(updatedAt);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  const formatter = new Intl.DateTimeFormat(
    locale === "id" ? "id-ID" : "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Jakarta",
    },
  );

  return `${formatter.format(parsedDate)} WIB`;
}

const MARKET_SIGNAL_CATEGORY_ICON_BY_SLUG: Record<string, string> = {
  gold: "/assets/icon/gold-icon.webp",
  silver: "/assets/icon/silver-icon.webp",
  oil: "/assets/icon/bco-icon.webp",
  dxy: "/assets/icon/dxy-icon.webp",
  audusd: "/assets/icon/aud-usd-icon.webp",
  eurusd: "/assets/icon/eur-usd-icon.webp",
  eurousd: "/assets/icon/eur-usd-icon.webp",
  gbpusd: "/assets/icon/gbp-usd-icon.webp",
  usdcad: "/assets/icon/usd-cad-icon.webp",
  usdchf: "/assets/icon/usd-chf-icon.webp",
  usdjpy: "/assets/icon/usd-jpy-icon.webp",
  usdidr: "/assets/icon/usd-idr-icon.webp",
  nikkei: "/assets/icon/jpk-icon.webp",
  hangseng: "/assets/icon/hkk-icon.webp",
};

export function resolveMarketSignalCategoryIconSrc(categorySlug: string) {
  return MARKET_SIGNAL_CATEGORY_ICON_BY_SLUG[categorySlug] ?? null;
}

const MARKET_SIGNAL_LIVE_QUOTE_SYMBOL_BY_SLUG: Record<string, string> = {
  gold: "XUL10",
  silver: "XAGUSD",
  oil: "BCO10_BBJ",
  dxy: "DX1010_BBJ",
  audusd: "AU1010_BBJ",
  eurusd: "EU1010_BBJ",
  eurousd: "EU1010_BBJ",
  gbpusd: "GU1010_BBJ",
  usdcad: "UC1010_BBJ",
  usdchf: "USDCHF",
  usdjpy: "UJ1010_BBJ",
  usdidr: "UI1010_BBJ",
  nikkei: "JPK50_BBJ",
  hangseng: "HKK50_BBJ",
};

export function resolveMarketSignalLiveQuoteSymbol(categorySlug: string) {
  return MARKET_SIGNAL_LIVE_QUOTE_SYMBOL_BY_SLUG[categorySlug] ?? null;
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
      accountTitle: "Profil Akun",
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
      demoAccount: { typeLabel: "Akun Demo" },
      realAccount: { typeLabel: "Akun Real" },
      modalTitles: {
        education: "Portal Edukasi SGB",
        products: "Produk Keuangan SGB",
        withdraw: "Withdraw Dana Berjangka",
        deposit: "Deposit Dana Aman",
        temporary: "Transaksi",
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
          "Pantau posisi terbuka dan riwayat trading Anda melalui halaman transaksi client area.",
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
    accountTitle: "Account Profile",
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
    demoAccount: { typeLabel: "Demo Account" },
    realAccount: { typeLabel: "Real Account" },
    modalTitles: {
      education: "SGB Education Portal",
      products: "SGB Financial Products",
      withdraw: "Futures Withdrawal",
      deposit: "Secure Deposit",
      temporary: "Transactions",
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
        "Track your open positions and trading history from the client area transaction page.",
    },
  };
}

export type ClientAreaMarketCategory = "Commodity" | "Index" | "Forex";

const CLIENT_AREA_MARKET_CATEGORY_BY_SYMBOL: Record<
  string,
  ClientAreaMarketCategory
> = {
  XUL10: "Commodity",
  XUL10_BBJ: "Commodity",
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

export const CLIENT_AREA_HOME_MARKET_SYMBOLS = [
  "XUL10",
  "BCO10_BBJ",
  "HKK50_BBJ",
  "JPK50_BBJ",
] as const;

function parseLiveQuoteNumber(value: string | undefined) {
  if (!value?.trim()) {
    return null;
  }

  const normalizedValue = Number(value.replace(/,/g, "").trim());
  return Number.isFinite(normalizedValue) ? normalizedValue : null;
}

function resolveLiveQuoteChange(tick: LiveQuoteTick) {
  const price = parseLiveQuoteNumber(tick.price);
  const openPrice = parseLiveQuoteNumber(tick.oprice);

  if (price === null || openPrice === null || openPrice === 0) {
    return null;
  }

  return Number((((price - openPrice) / openPrice) * 100).toFixed(2));
}

function buildClientAreaMarketPrice(
  liveSymbol: string,
  values: {
    ask: number | null;
    bid: number | null;
    buy?: string;
    change: number | null;
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
      bid: parseLiveQuoteNumber(tick.buy),
      ask: parseLiveQuoteNumber(tick.sell),
      change: resolveLiveQuoteChange(tick),
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

  return CLIENT_AREA_HOME_MARKET_SYMBOLS.map((symbol) => {
    const livePrice = availablePrices.find(
      (item) => (item.code ?? item.name) === symbol,
    );

    if (livePrice) return livePrice;

    return buildClientAreaMarketPrice(symbol, { ask: null, bid: null, change: null });
  });
}

export function getQuickActionIconMap(): Record<ActionId, LucideIcon> {
  return {
    education: NotebookText,
    products: PackageSearch,
    withdraw: BanknoteArrowDown,
    deposit: BanknoteArrowUp,
    temporary: BadgeDollarSign,
  };
}

export function getSidebarIconMap(): Record<TabId, LucideIcon> {
  return {
    home: House,
    market: ChartNoAxesCombined,
    "trade-pilot": Rocket,
    news: Newspaper,
    ebook: BookOpen,
    account: CircleUserRound,
  };
}

export function resolveSignalBadge(change: number): {
  className: string;
  icon: LucideIcon;
} {
  return change >= 0
    ? {
        className: "text-emerald-500",
        icon: ArrowUp,
      }
    : {
        className: "text-rose-500",
        icon: ArrowDown,
      };
}

export function buildClientAreaHeroSlides(
  copy: DashboardCopy,
  banners: ClientAreaBannerRecord[],
  locale: AppLocale,
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
    href: banner.slug
      ? resolveLocalizedHref(
          locale,
          `/promo/${encodeURIComponent(banner.slug)}`,
        )
      : undefined,
    imageUrl: banner.image_url,
  }));
}
