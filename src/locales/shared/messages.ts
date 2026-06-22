import type {
  SecurityItem,
  SpreadItem,
  Stat,
} from "@/types/landing";

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
  appPromoSection: {
    title: string;
    description: string;
    benefits: string[];
    imageAlt: string;
    googlePlayAlt: string;
    appStoreAlt: string;
  };
  homeEbookPromo: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: string;
    highlights: string[];
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
  aboutInformationPage: {
    breadcrumb: string;
    parentLabel: string;
    hero: {
      eyebrow: string;
      title: string;
      description: string;
      stats: Array<{
        label: string;
        value: string;
      }>;
    };
    overview: {
      eyebrow: string;
      title: string;
      description: string;
      cards: Array<{
        title: string;
        body: string;
      }>;
    };
    operations: {
      title: string;
      items: string[];
    };
    serviceInfo: {
      title: string;
      items: Array<{
        label: string;
        value: string;
      }>;
    };
    commitments: {
      title: string;
      items: string[];
    };
  };
  aboutBusinessLegalityPage: {
    breadcrumb: string;
    parentLabel: string;
    hero: {
      eyebrow: string;
      title: string;
      description: string;
    };
    overview: {
      eyebrow: string;
      title: string;
      description: string;
      cards: Array<{
        title: string;
        body: string;
      }>;
    };
    licenses: {
      title: string;
      description: string;
      items: Array<{
        authority: string;
        number: string;
        note: string;
      }>;
    };
    memberships: {
      title: string;
      description: string;
      items: Array<{
        authority: string;
        number: string;
        note: string;
      }>;
    };
    commitments: {
      title: string;
      description: string;
      items: string[];
    };
  };
  productPage: {
    breadcrumb: string;
    productsLabel: string;
    categoryLabel: string;
    countLabel: string;
    sourceLabel: string;
    viewDetailCta: string;
    backToCatalogCta: string;
    descriptionTitle: string;
    specificationTitle: string;
    emptyTitle: string;
    emptyBody: string;
    categories: {
      multilateral: {
        title: string;
        description: string;
        eyebrow: string;
        summary: string;
      };
      bilateral: {
        title: string;
        description: string;
        eyebrow: string;
        summary: string;
      };
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
  bannerSlideshow: {
    regionLabel: string;
    slideButtonLabel: string;
    slideImageAlt: string;
    previousLabel: string;
    nextLabel: string;
  };
  fraudAlertPage: {
    title: string;
    description: string;
    breadcrumb: string;
    hero: {
      eyebrow: string;
      title: string;
      description: string;
    };
    alertBoxTitle: string;
    alertBoxBody: string;
    redFlagsTitle: string;
    redFlags: string[];
    verificationTitle: string;
    verificationSteps: string[];
    responseTitle: string;
    responseSteps: string[];
    reminderTitle: string;
    reminderBody: string;
    primaryCta: string;
    secondaryCta: string;
  };
  contactPage: {
    title: string;
    description: string;
    breadcrumb: string;
    breadcrumbs: {
      supportCenter: string;
    };
    hero: {
      eyebrow: string;
      title: string;
      description: string;
    };
    form: {
      title: string;
      description: string;
      nameLabel: string;
      namePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      phoneLabel: string;
      phonePlaceholder: string;
      subjectLabel: string;
      subjectPlaceholder: string;
      messageLabel: string;
      messagePlaceholder: string;
      captchaLabel: string;
      captchaAction: string;
      submit: string;
      submitting: string;
      helper: string;
      success: string;
      successReportLabel: string;
      error: string;
    };
    headOffice: {
      title: string;
      address: string;
      email: string;
      phone: string;
      phoneHref: string;
      fax: string;
      complaintPhone: string;
      complaintPhoneHref: string;
    };
    map: {
      title: string;
      description: string;
      iframeTitle: string;
      directionsCta: string;
      directionsUrl: string;
    };
    support: {
      title: string;
      description: string;
      hoursLabel: string;
      hoursValue: string;
      callTitle: string;
      callDescription: string;
      emailTitle: string;
      emailDescription: string;
      complaintTitle: string;
      complaintDescription: string;
      faxTitle: string;
      faxDescription: string;
    };
    offices: {
      title: string;
      description: string;
      phoneLabel: string;
      emailLabel: string;
      faxLabel: string;
      items: Array<{
        name: string;
        address: string;
        phone?: string;
        phoneHref?: string;
        email?: string;
        fax?: string;
      }>;
    };
  };
  footer: {
    brandTitle: string;
    brandItems: Array<{
      label: string;
      href: string;
    }>;
    helpTitle: string;
    helpItems: Array<{
      label: string;
      href: string;
    }>;
    legalItems: string[];
    socials: Array<{
      name: string;
      url: string;
      icon: string;
    }>;
    copyrightProtected: string;
    komdigiAlt: string;
    tsiAlt: string;
  };
  loadingOverlay: {
    title: string;
    description: string;
  };
};
