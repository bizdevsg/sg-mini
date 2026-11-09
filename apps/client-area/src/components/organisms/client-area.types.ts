import type { IconProp } from "@fortawesome/fontawesome-svg-core";

export type TabId =
  | "home"
  | "market"
  | "trade-pilot"
  | "news"
  | "ebook"
  | "account";
export type AccountMode = "demo" | "real";
export type ActionId =
  | "education"
  | "products"
  | "withdraw"
  | "deposit"
  | "temporary";
export type SlideGraphic = "padlock" | "education" | "gift";

export type SlideItem = {
  badge: string;
  badgeIcon: IconProp;
  title: string;
  description: string;
  graphicType: SlideGraphic;
};

export type ClientAreaBannerRecord = {
  id: number;
  slug?: string;
  image: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ClientAreaHeroSlide = SlideItem & {
  id: string;
  href?: string;
  imageUrl?: string;
};

export type BreakingNewsItem = {
  id?: string;
  title: string;
  timeAgo: string;
};

export type ArticleItem = {
  id?: string;
  slug?: string;
  imageUrl?: string;
  category: string;
  title: string;
  excerpt: string;
  timeAgo: string;
};

export type PositionItem = {
  id: string;
  symbol: string;
  instrument: string;
  side: "buy" | "sell";
  orderNumber?: string;
  volume: string;
  openPrice: string;
  currentPrice: string;
  floatingPl: string;
  /** Raw floating P/L behind `floatingPl`, for totals and colouring. */
  floatingValue?: number | null;
  storageFee?: string;
  facilityFee?: string;
  vat?: string;
  openedAt: string;
};

export type TransactionHistoryItem = {
  id: string;
  /** Not shown anywhere in the UI; the API gives no such field, so it is optional. */
  type?: "credit" | "debit";
  instrument: string;
  symbol: string;
  statusLabel: string;
  statusTone?: "profit" | "loss" | "warning" | "muted";
  orderNumber: string;
  volume: string;
  date: string;
  time: string;
  sideLabel?: string;
  sidePrice?: string;
  openLabel?: string;
  openPrice?: string;
  closeLabel?: string;
  closePrice?: string;
  currentPrice?: string;
  facilityFee?: string;
  vat?: string;
  profitLoss?: string;
};

export type AccountSnapshot = {
  typeLabel: string;
};

export type DashboardCopy = {
  breakingLabel: string;
  languageLabel: string;
  referenceLabel: string;
  quickDepositLabel: string;
  quickTradeLabel: string;
  sentimentLabel: string;
  buyersLabel: string;
  sellersLabel: string;
  marketWatchTitle: string;
  economicCalendarTitle: string;
  economicCalendarEmpty: string;
  economicCalendarHighImpactLabel: string;
  viewMoreLabel: string;
  transactionTitle: string;
  transactionHistoryTitle: string;
  newsTitle: string;
  accountTitle: string;
  marketTableHeaders: {
    symbol: string;
    name: string;
    bid: string;
    ask: string;
    change: string;
    action: string;
  };
  slides: SlideItem[];
  demoAccount: AccountSnapshot;
  realAccount: AccountSnapshot;
  modalTitles: Record<ActionId, string>;
  modalDescriptions: Record<ActionId, string>;
};

export type MarketPrice = {
  symbol: string;
  name: string;
  code?: string;
  bid: number | null;
  ask: number | null;
  change: number | null;
  price?: string;
  sell?: string;
  buy?: string;
  open?: string;
  high?: string;
  low?: string;
  time?: string;
  dateTime?: string;
};

