import type { IconProp } from "@fortawesome/fontawesome-svg-core";

export type TabId = "home" | "market" | "transaction" | "news" | "account";
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
  image: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ClientAreaHeroSlide = SlideItem & {
  id: string;
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
  volume: string;
  openPrice: string;
  currentPrice: string;
  floatingPl: string;
  openedAt: string;
};

export type TransactionHistoryItem = {
  id: string;
  type: "credit" | "debit";
  title: string;
  subtitle: string;
  amount: string;
};

export type AccountSnapshot = {
  typeLabel: string;
  accountId: string;
  accountOwner: string;
  email: string;
  status: string;
  broker: string;
  liquidationType: string;
  balance: number;
  floatingPl: number;
  floatingDelta: string;
  equity: number;
  equityDelta: string;
  marginRequired: number;
  effectiveMargin: number;
  callMarginPlace: number;
  equityRatio: number;
  autoLiquidation: number;
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
  economicCalendarFallbackLabel: string;
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
  breakingNews: BreakingNewsItem[];
  articles: ArticleItem[];
  demoAccount: AccountSnapshot;
  realAccount: AccountSnapshot;
  positions: PositionItem[];
  transactionHistory: TransactionHistoryItem[];
  modalTitles: Record<ActionId, string>;
  modalDescriptions: Record<ActionId, string>;
};

export type MarketPrice = {
  symbol: string;
  name: string;
  code?: string;
  bid: number;
  ask: number;
  change: number;
  price?: string;
  sell?: string;
  buy?: string;
  open?: string;
  high?: string;
  low?: string;
  time?: string;
  dateTime?: string;
};
