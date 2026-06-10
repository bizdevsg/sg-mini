import type {
  SecurityItem,
  SpreadItem,
  Stat,
} from "@/components/content/landing-content";

export type AppMessages = {
  app: {
    title: string;
    description: string;
    brandName: string;
    brandWordmark: string;
    homeLabel: string;
  };
  navbar: {
    login: string;
    openAccount: string;
    switchLocaleLabel: string;
    switchLocaleIconAlt: string;
    openMenuLabel: string;
    closeMenuLabel: string;
    menuGroups: Array<{
      label: string;
      href?: string;
      items?: Array<{
        label: string;
        href?: string;
      }>;
    }>;
  };
  hero: {
    titleLead: string;
    titleBody: string;
    cta: string;
    visualAlt: string;
  };
  regulator: {
    eyebrow: string;
  };
  trustStats: {
    title: string;
    subtitle: string;
    stats: Stat[];
  };
  security: {
    title: string;
    subtitle: string;
    cards: SecurityItem[];
  };
  spread: {
    title: string;
    subtitle: string;
    cta: string;
    items: SpreadItem[];
    labels: {
      product: string;
      targetSpread: string;
      transactionSize: string;
      freeSwap: string;
    };
  };
  finalCta: {
    title: string;
    subTitle: string;
    cta: string;
    companyTitle: string;
    companyItems: string[];
    helpTitle: string;
    helpItems: string[];
  };
  liveQuoteSection: {
    title: string;
    subtitle: string;
    cta: string;
  };
  liveQuotePage: {
    breadcrumb: string;
  };
  ebookPage: {
    title: string;
    description: string;
    breadcrumb: string;
    hero: {
      eyebrow: string;
      title: string;
      description: string;
      primaryCta: string;
      secondaryCta: string;
    };
    libraryTitle: string;
    librarySubtitle: string;
    items: Array<{
      title: string;
      description: string;
      format: string;
      level: string;
      topics: string[];
    }>;
    benefitsTitle: string;
    benefits: string[];
  };
  liveQuoteTable: {
    feedLabel: string;
    empty: string;
    firstTick: string;
    lastUpdated: string;
    fields: {
      symbol: string;
      price: string;
      sell: string;
      buy: string;
      open: string;
      high: string;
      low: string;
      time: string;
      dateTime: string;
    };
    connectionStatus: {
      connecting: string;
      live: string;
      reconnecting: string;
      error: string;
    };
    trend: {
      up: string;
      down: string;
      neutral: string;
    };
  };
  aboutPage: {
    hero: {
      eyebrow: string;
      title: string;
      description: string;
      facts: {
        foundedLabel: string;
        foundedValue: string;
        focusLabel: string;
        focusValue: string;
        operationsLabel: string;
        operationsValue: string;
      };
    };
    companyProfile: {
      eyebrow: string;
      logoAlt: string;
      title: string;
      paragraphs: [string, string];
    };
    visiMisi: {
      eyebrow: string;
      missionTitle: string;
      visionTitle: string;
      missionItems: string[];
      visionItems: string[];
      summary: string;
    };
    awards: {
      eyebrow: string;
      title: string;
      description: string;
      items: Array<{
        title: string;
        subtitle: string;
        imageSrc: string;
        imageAlt: string;
      }>;
    };
    regulation: {
      eyebrow: string;
      title: string;
      highlightedTitle: string;
      description: string;
    };
  };
  economicCalendarPage: {
    title: string;
    description: string;
    breadcrumb: string;
  };
  economicCalendarBrowser: {
    tabs: {
      today: string;
      thisWeek: string;
      nextWeek: string;
      previousWeek: string;
    };
    statusUnavailable: string;
    time: string;
    country: string;
    impact: string;
    event: string;
    previous: string;
    forecast: string;
    actual: string;
    source: string;
    measures: string;
    effect: string;
    frequency: string;
    nextRelease: string;
    notes: string;
    whyCare: string;
    date: string;
    noHistory: string;
    empty: string;
    unavailable: string;
    collapse: string;
    expand: string;
    today: string;
    previousPage: string;
    nextPage: string;
    page: string;
    of: string;
  };
  historicalDataPage: {
    title: string;
    description: string;
    breadcrumb: string;
  };
  historicalDataBrowser: {
    records: string;
    categories: string;
    latestDate: string;
    empty: string;
    date: string;
    category: string;
    open: string;
    high: string;
    low: string;
    close: string;
    note: string;
    bankHoliday: string;
    noNote: string;
    previous: string;
    next: string;
    page: string;
    of: string;
    showing: string;
    to: string;
    ofRecords: string;
  };
  newsPage: {
    breadcrumb: string;
    listTitle: string;
    allCategories: string;
    filter: string;
    searchPlaceholder: string;
    emptyTitle: string;
    emptyBody: string;
    pagination: {
      previous: string;
      next: string;
      summary: string;
    };
  };
  newsBrowser: {
    categories: Record<string, string>;
    filterModal: {
      title: string;
      subtitle: string;
      sortBy: string;
      newest: string;
      oldest: string;
      period: string;
      all: string;
      today: string;
      week: string;
      month: string;
      apply: string;
      reset: string;
      close: string;
    };
    summary: {
      category: string;
      available: string;
      fallback: string;
      articlesInCategory: string;
    };
    pagination: {
      template: string;
    };
    emptyFiltered: string;
    readArticle: string;
  };
  newsDetailPage: {
    news: string;
    relatedNews: string;
    latestNews: string;
    readTimeUnit: string;
  };
  footer: {
    brandTitle: string;
    brandItems: string[];
    helpTitle: string;
    helpItems: string[];
    legalItems: string[];
    socials: string[];
    copyrightProtected: string;
    komdigiAlt: string;
    tsiAlt: string;
  };
  loadingOverlay: {
    title: string;
    description: string;
  };
};
