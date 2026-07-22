import type { SecurityItem, SpreadItem, Stat } from "@/types/landing";

export type HomeWhyChooseItemId = "legal" | "experience" | "support" | "ebook";

export type AppMessages = {
  app: {
    title: string;
    description: string;
    brandName: string;
    brandWordmark: string;
    homeLabel: string;
    breadcrumbLabel: string;
  };
  navbar: {
    login: string;
    openAccount: string;
    switchLocaleLabel: string;
    switchLocaleIconAlt: string;
    openMenuLabel: string;
    closeMenuLabel: string;
    scrollToTopLabel: string;
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
    subTitle: string;
    cta: string;
    demoLoginCta: string;
    demoDisclaimer: string;
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
  benefitSection: {
    items: Array<{
      eyebrow: string;
      title: string;
      description: string;
      imageAlt: string;
    }>;
  };
  homeWhyChoose: {
    eyebrow: string;
    titleLead: string;
    titleBody: string;
    description: string;
    items: Array<{
      id: HomeWhyChooseItemId;
      title: string;
      body: string;
    }>;
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
    eyebrow: string;
    title: string;
    subtitle: string;
    cta: string;
  };
  liveQuotePage: {
    breadcrumb: string;
    exchangeRate: {
      eyebrow: string;
      title: string;
      amountLabel: string;
      fromLabel: string;
      toLabel: string;
      searchCurrencyPlaceholder: string;
      noCurrencyFound: string;
      matrixToggleLabel: string;
      calculatorToggleLabel: string;
      matrixTitle: string;
      matrixBaseLabel: string;
      matrixUnitLabel: string;
      outputLabel: string;
      swapLabel: string;
      updatedLabel: string;
      unavailable: string;
    };
  };
  ebookPage: {
    title: string;
    description: string;
    breadcrumb: string;
    parentLabel: string;
    detailCta: string;
    previewCta: string;
    downloadCta: string;
    backToCategoriesCta: string;
    closeCta: string;
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
    announcements: {
      management: string;
      latest: string;
      emptyTitle: string;
      emptyBody: string;
      close: string;
      defaultTitle: string;
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
    numberLabel: string;
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
    loading: string;
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
    share: {
      facebook: string;
      x: string;
      whatsapp: string;
      copy: string;
      copied: string;
    };
  };
  bannerSlideshow: {
    regionLabel: string;
    slideButtonLabel: string;
    slideImageAlt: string;
    previousLabel: string;
    nextLabel: string;
    detailCta: string;
  };
  bannerDetailPage: {
    breadcrumb: string;
    eyebrow: string;
    updatedLabel: string;
    backLabel: string;
    emptyContent: string;
  };
  termsConditionsPage: {
    title: string;
    description: string;
    breadcrumb: string;
    hero: {
      eyebrow: string;
      title: string;
      description: string;
      primaryCta: string;
    };
    list: {
      title: string;
      description: string;
      readMore: string;
      emptyTitle: string;
      emptyBody: string;
      untitledFallback: string;
    };
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
    complaintLinks: {
      onlineComplaint: string;
      emailComplaint: string;
    };
    hero: {
      eyebrow: string;
      title: string;
      description: string;
    };
    overview: {
      eyebrow: string;
      title: string;
      description: string;
      companyLabel: string;
      addressLabel: string;
      updatedLabel: string;
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
      callTitle: string;
      callDescription: string;
      emailTitle: string;
      emailDescription: string;
      complaintTitle: string;
      complaintDescription: string;
      complaintValue: string;
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
  faqPage: {
    title: string;
    description: string;
    breadcrumb: string;
    hero: {
      eyebrow: string;
      title: string;
      description: string;
    };
    sections: Array<{
      title: string;
      description: string;
      items: Array<{
        question: string;
        answer: string;
      }>;
    }>;
    helpCard: {
      title: string;
      description: string;
      primaryCta: string;
      secondaryCta: string;
    };
  };
  clientArea: {
    pageTitle: string;
    pageDescription: string;
    login: {
      badge: string;
      title: string;
      description: string;
      accountLabel: string;
      accountPlaceholder: string;
      passwordLabel: string;
      passwordPlaceholder: string;
      rememberMe: string;
      forgotPassword: string;
      primaryCta: string;
      secondaryCta: string;
      submitting: string;
      helper: string;
      captchaTitle: string;
      captchaHelper: string;
      demoCredentialsTitle: string;
      demoCredentialsAccount: string;
      demoCredentialsPassword: string;
      errorRequired: string;
      errorInvalidCredentials: string;
      errorCaptchaRequired: string;
      errorCaptchaFailed: string;
      highlightsTitle: string;
      highlights: string[];
      securityTitle: string;
      securityBody: string;
    };
    user: {
      name: string;
      role: string;
      accountId: string;
      status: string;
    };
    sidebar: {
      label: string;
      backToWebsite: string;
      tradeCta: string;
      navItems: Array<{
        id: string;
        label: string;
        href: string;
      }>;
    };
    topbar: {
      supportLabel: string;
      supportPhone: string;
      logoutLabel: string;
      logoutModal: {
        title: string;
        description: string;
        cancelLabel: string;
        confirmLabel: string;
        submittingLabel: string;
      };
      primaryCta: string;
      accountMode: string;
      notificationCount: string;
      breadcrumb: string;
      navItems: Array<{
        label: string;
        href: string;
      }>;
    };
    accountPanel: {
      eyebrow: string;
      title: string;
      primaryCta: string;
      items: Array<{
        id: string;
        label: string;
        value: string;
      }>;
    };
    promoPanel: {
      eyebrow: string;
      title: string;
      description: string;
      cta: string;
    };
    quickActions: {
      items: Array<{
        id: string;
        label: string;
      }>;
    };
    shortcutPanel: {
      items: Array<{
        id: string;
        label: string;
      }>;
    };
    signalsPanel: {
      title: string;
      cta: string;
      items: Array<{
        symbol: string;
        title: string;
        time: string;
        bias: "buy" | "sell" | "neutral";
      }>;
    };
    servicePanel: {
      title: string;
      items: Array<{
        description: string;
        label: string;
        cta: string;
      }>;
    };
    accountPage: {
      activeAccount: string;
      backLabel: string;
      pendingSectionNote: string;
      saveLabel: string;
      sections: {
        personal: string;
        purpose: string;
        emergency: string;
        job: string;
        wealth: string;
      };
      menuItems: {
        profile: string;
        referral: string;
        documentApproval: string;
        dailyStatement: string;
        withdrawal: string;
        deposit: string;
      };
      fields: {
        fullName: string;
        email: string;
        birthPlace: string;
        birthDate: string;
        identityNumber: string;
        taxNumber: string;
        gender: string;
        maritalStatus: string;
        spouseName: string;
        homeAddress: string;
        rt: string;
        rw: string;
        province: string;
        city: string;
        subdistrict: string;
        postalCode: string;
        phone: string;
        openingPurpose: string;
        investmentExperience: string;
        investmentField: string;
        futuresExperience: string;
        familyAffiliation: string;
        familyAffiliationDetail: string;
        bankruptStatus: string;
        emergencyName: string;
        emergencyAddress: string;
        emergencyNeighborhood: string;
        emergencyProvince: string;
        emergencyCity: string;
        emergencySubdistrict: string;
        emergencyPostalCode: string;
        emergencyPhone: string;
        occupation: string;
        companyName: string;
        businessSector: string;
        position: string;
        yearsWorking: string;
        previousOffice: string;
        officeAddress: string;
        officePostalCode: string;
        officePhone: string;
        annualIncome: string;
        houseLocation: string;
        njop: string;
        bankDeposit: string;
        amount: string;
        otherAssets: string;
        occupationOther: string;
      };
      options: {
        binary: Array<{
          value: string;
          label: string;
        }>;
        purpose: Array<{
          value: string;
          label: string;
        }>;
        investmentExperience: Array<{
          value: string;
          label: string;
        }>;
        occupation: Array<{
          value: string;
          label: string;
        }>;
        annualIncome: Array<{
          value: string;
          label: string;
        }>;
      };
    };
    referralPage: {
      title: string;
      description: string;
      hero: {
        eyebrow: string;
        title: string;
        description: string;
        cta: string;
        brandAlt: string;
        visualAlt: string;
      };
      stepsTitle: string;
      steps: string[];
      closing: string;
    };
    withdrawalHistoryPage: {
      title: string;
      description: string;
      summary: {
        totalCompleted: string;
        activeRequests: string;
        lastProcessed: string;
        destinationBank: string;
      };
      list: {
        requestId: string;
        requestDate: string;
        processedDate: string;
        destination: string;
        amount: string;
        fee: string;
        netAmount: string;
        reference: string;
        accountHolder: string;
        note: string;
      };
      status: {
        completed: string;
        pending: string;
        processing: string;
        rejected: string;
      };
      emptyTitle: string;
      emptyBody: string;
    };
    depositHistoryPage: {
      title: string;
      description: string;
      summary: {
        totalCompleted: string;
        activeRequests: string;
        lastProcessed: string;
        sourceBank: string;
      };
      list: {
        requestId: string;
        requestDate: string;
        processedDate: string;
        source: string;
        amount: string;
        fee: string;
        creditedAmount: string;
        reference: string;
        senderName: string;
        tradingAccount: string;
        note: string;
      };
      status: {
        completed: string;
        pending: string;
        processing: string;
        rejected: string;
      };
      emptyTitle: string;
      emptyBody: string;
    };
    tradingView: {
      disclaimerLabel: string;
      disclaimerBeforeProvider: string;
      disclaimerAfterProvider: string;
    };
    fundTransferModal: {
      closeLabel: string;
      depositTitle: string;
      withdrawalTitle: string;
      depositDescription: string;
      withdrawalDescription: string;
    };
  };
  cookieConsent: {
    badge: string;
    title: string;
    description: string;
    essentialTag: string;
    preferenceTag: string;
    dismissLabel: string;
    acceptLabel: string;
  };
  footer: {
    companyName: string;
    logoAlt: string;
    desc: string;
    disclaimerLabel: string;
    disclaimerBody: string;
    brandTitle: string;
    brandItems: Array<{
      label: string;
      href: string;
    }>;
    legalTitle: string;
    legalItems: {
      label: string;
      number: string;
    }[];
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
