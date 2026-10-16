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
  produkRegulerPage: {
    title: string;
    description: string;
    breadcrumb: string;
    hero: {
      eyebrow: string;
      title: string;
      description: string;
      primaryCta: string;
      secondaryCta: string;
      badges: string[];
    };
    benefitsTitle: string;
    benefitsDescription: string;
    benefits: Array<{
      title: string;
      description: string;
    }>;
    cta: {
      title: string;
      description: string;
      buttonLabel: string;
    };
  };
  produkPrimePage: {
    title: string;
    description: string;
    breadcrumb: string;
    hero: {
      eyebrow: string;
      title: string;
      description: string;
      primaryCta: string;
      secondaryCta: string;
      badges: string[];
    };
    benefitsTitle: string;
    benefitsDescription: string;
    benefits: Array<{
      title: string;
      description: string;
    }>;
    cta: {
      title: string;
      description: string;
      buttonLabel: string;
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
    download: string;
    downloadCsv: string;
    downloadPdf: string;
    date: string;
    category: string;
    open: string;
    high: string;
    low: string;
    close: string;
    note: string;
    bankHoliday: string;
    noNote: string;
    rangeLabel: string;
    rangeFrom: string;
    rangeTo: string;
    rangeReset: string;
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
  marketAcademyPage: {
    meta: {
      title: string;
      description: string;
    };
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
  marketAcademyBrowser: {
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
  marketAcademyDetailPage: {
    marketAcademy: string;
    relatedTitle: string;
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
  promoDetailPage: {
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
  promoPage: {
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
  privacyPolicyPage: {
    title: string;
    description: string;
    breadcrumb: string;
    hero: {
      eyebrow: string;
      title: string;
      description: string;
    };
    content: {
      updatedLabel: string;
      emptyTitle: string;
      emptyBody: string;
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
    viewOnlyDisclaimer: {
      label: string;
      body: string;
    };
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
      errorUnavailable: string;
      errorRequired: string;
      errorInvalidCredentials: string;
      errorSessionConfiguration: string;
      errorCaptchaRequired: string;
      errorCaptchaFailed: string;
      errorNetwork: string;
      errorTimeout: string;
      errorSessionExpired: string;
      errorServer: string;
      highlightsTitle: string;
      highlights: string[];
      securityTitle: string;
      securityBody: string;
    };
    otp: {
      title: string;
      description: string;
      codeLabel: string;
      codePlaceholder: string;
      submitLabel: string;
      submitting: string;
      resendLabel: string;
      resending: string;
      resendSuccess: string;
      backToLogin: string;
      errorRequired: string;
      errorInvalidCode: string;
      errorSessionExpired: string;
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
    livePriceTicker: {
      label: string;
      newsLabel: string;
    };
    tradePilotPage: {
      access: {
        deniedTitle: string;
        deniedDescription: string;
        missingDemoTitle: string;
        missingDemoDescription: string;
        missingRealTitle: string;
        missingRealDescription: string;
        mockDataLabel: string;
      };
      navigation: {
        label: string;
        items: {
          analysis: string;
          performanceHistory: string;
          guide: string;
        };
      };
      analysis: {
        title: string;
        description: string;
        quotaValue: string;
        quotaLabel: string;
        sessionValue: string;
        sessionLabel: string;
        instrumentPickerTitle: string;
        searchPlaceholder: string;
        favoritesLabel: string;
        addFavoriteLabel: string;
        setAlertLabel: string;
        analysisActionLabel: string;
        analysisLoadingLabel: string;
        insufficientCreditMessage: string;
        analysisErrorMessage: string;
        noAnalysisTitle: string;
        noAnalysisDescription: string;
        demoModeLabel: string;
        realModeLabel: string;
        instrumentLabel: string;
        currentPriceLabel: string;
        timeframeLabel: string;
        indicatorLabel: string;
        chartSettingsLabel: string;
        fullscreenLabel: string;
        exitFullscreenLabel: string;
        screenshotLabel: string;
        captureInProgressLabel: string;
        captureUnsupportedMessage: string;
        captureFailedMessage: string;
        fullscreenUnsupportedMessage: string;
        instrumentNames: {
          gold: string;
          brent: string;
          hangSeng: string;
          nikkei: string;
        };
        analysisResult: {
          relevanceLabel: string;
          pendingLabel: string;
          sessionWindowLabel: string;
          highestLiquidityLabel: string;
          bullishLabel: string;
          bearishLabel: string;
          sidewaysLabel: string;
          changeTimeframeTitle: string;
          changeTimeframeDescription: string;
          compareRiskLabel: string;
          directionBiasTitle: string;
          neutralWaitLabel: string;
          timeframeContextLabel: string;
          bearishBiasLabel: string;
          neutralBiasLabel: string;
          bullishBiasLabel: string;
          tendencyDisclaimer: string;
          confidenceLabel: string;
          overallRiskLabel: string;
          mediumRiskLabel: string;
          learnLabel: string;
          confidenceReasonTitle: string;
          confidenceReasonDescription: string;
          fullReasonLabel: string;
          analyzedAtLabel: string;
          refreshAnalysisLabel: string;
          priceChartTitle: string;
          updatedAtLabel: string;
          viewFullChartLabel: string;
          resetLabel: string;
          shareChartLabel: string;
          suggestedLevelsTitle: string;
          recommendedSideLabel: string;
          waitLabel: string;
          suggestedLevelsDescription: string;
          buyScenarioLabel: string;
          sellScenarioLabel: string;
          entryLabel: string;
          aboveLabel: string;
          belowLabel: string;
          breakoutHint: string;
          breakdownHint: string;
          stopLossLabel: string;
          takeProfitOneLabel: string;
          takeProfitTwoLabel: string;
          riskRewardLabel: string;
          reasonLabel: string;
          buyReason: string;
          sellReason: string;
          copyLevelsLabel: string;
          copiedLabel: string;
        };
        technicalIndicators: {
          title: string;
          description: string;
          dataLabel: string;
          candleCountLabel: string;
          priceLabel: string;
          lastBarLabel: string;
          twentyBarsLabel: string;
          signalSummaryLabel: string;
          oscillatorLabel: string;
          movingAverageLabel: string;
          movingAveragesLabel: string;
          leaningBullishLabel: string;
          leaningBearishLabel: string;
          bullishLabel: string;
          bearishLabel: string;
          neutralLabel: string;
          buyLabel: string;
          sellLabel: string;
          waitLabel: string;
        };
        priceAlert: {
          title: string;
          description: string;
          toggleLabel: string;
          statusLabel: string;
          activeLabel: string;
          inactiveLabel: string;
          entryLabel: string;
          stopLossLabel: string;
          takeProfitOneLabel: string;
          takeProfitTwoLabel: string;
          triggeredLabel: string;
          cancelledLabel: string;
        };
        footer: {
          eyebrow: string;
          title: string;
          description: string;
          googlePlayAlt: string;
          appStoreAlt: string;
          logoAlt: string;
          supportTitle: string;
          supportDescription: string;
          disclaimerLabel: string;
          disclaimerDescription: string;
          legalNavigationLabel: string;
          privacyLabel: string;
          termsLabel: string;
          helpLabel: string;
          deleteAccountLabel: string;
          tiktokLabel: string;
          copyright: string;
        };
        fundamentalContext: {
          title: string;
          description: string;
          refreshLabel: string;
          latestNewsLabel: string;
          economicCalendarLabel: string;
          learnLabel: string;
          items: Array<{
            title: string;
            source: string;
            publishedAt: string;
          }>;
        };
        marketContextSummary: {
          eyebrow: string;
          bearishTitle: string;
          bullishTitle: string;
          sellLabel: string;
          buyLabel: string;
          bearishDescription: string;
          bullishDescription: string;
          bearishNote: string;
          bullishNote: string;
        };
        tradingPlan: {
          title: string;
          description: string;
          lotUnitLabel: string;
          accountTypeLabel: string;
          microAccountLabel: string;
          microAccountDesc: string;
          miniAccountLabel: string;
          miniAccountDesc: string;
          regularAccountLabel: string;
          regularAccountDesc: string;
          tradingCapitalLabel: string;
          lossLimitLabel: string;
          riskStyleLabel: string;
          conservativeLabel: string;
          moderateLabel: string;
          aggressiveLabel: string;
          intradayNote: string;
          snapshotLabel: string;
          snapshotValue: string;
          createRecommendationLabel: string;
          selectDirectionLabel: string;
          waitStatusLabel: string;
          limitedOptionsLabel: string;
          waitDescription: string;
          waitGuidance: string;
          minimumStopRiskLabel: string;
          warningTitle: string;
          warningDescription: string;
          buyScenarioLabel: string;
          buyScenarioDescription: string;
          buyScenarioGuidance: string;
          sellScenarioLabel: string;
          sellScenarioDescription: string;
          sellScenarioGuidance: string;
          brokerFundsUntilStopLabel: string;
          understandDetailsLabel: string;
          understandDetailsDescription: string;
          cancellationConditionsLabel: string;
          alternateScenarioPendingLabel: string;
          savePlanLabel: string;
          shareLabel: string;
          entryPositionLabel: string;
          initialEntryDescription: string;
          stopLossLabel: string;
          finalStopLossDescription: string;
          riskBudgetLabel: string;
          riskBudgetDescription: string;
          targetProfitLabel: string;
          takeProfitOneShortLabel: string;
          takeProfitTwoShortLabel: string;
          riskStyleDescriptions: {
            conservative: string;
            moderate: string;
            aggressive: string;
          };
          planSummaryLabel: string;
          planDetailsLabel: string;
          unusedCandidatesLabel: string;
          recommendationUsageLabel: string;
          entryAndLotTitle: string;
          allEntriesFilledDescription: string;
          initialEntryLabel: string;
          riskSectionTitle: string;
          finalStopLossLabel: string;
          maximumLossEstimateLabel: string;
          targetProfitSectionTitle: string;
          takeProfitOneLabel: string;
          takeProfitTwoLabel: string;
          estimatedProfitLabel: string;
          riskContextTitle: string;
          usableRiskBudgetLabel: string;
          guardrailDescription: string;
          proposedLossLimitLabel: string;
          initialEntryOnlyNote: string;
          otherCalculationDetailsLabel: string;
          weightedAverageEntryLabel: string;
          usedMarginLabel: string;
          marginAndStopLossLabel: string;
          initialPositionTitle: string;
          entryFromPlanDescription: string;
          positionMarginLabel: string;
          positionRiskAtStopLabel: string;
          fundsNeededAtFinalStopLabel: string;
          remainingFundsLabel: string;
          ifEntryFilledTitle: string;
          firstEntryOnlyDescription: string;
          filledEntrySummary: string;
          whyNotAllLossLimitTitle: string;
          marginAndRiskExplanationLabel: string;
          whyNotAllLossLimitDescription: string;
          estimateNotesTitle: string;
          estimateMayChangeLabel: string;
          estimateNotesDescription: string;
          unusedPositionLabel: string;
          notUsedLabel: string;
          exceedsAccumulatedRiskLabel: string;
          conditionalFinancialPlanLabel: string;
          conditionalFinancialPlanDescription: string;
          marginUsedUntilHereLabel: string;
          totalRiskAtFinalStopLabel: string;
          totalFundsAtFinalStopLabel: string;
          additionalLossLimitLabel: string;
          manualOrderWarning: string;
          chooseScenarioUsageTitle: string;
          chooseScenarioUsageDescription: string;
          checkEntryUsageTitle: string;
          checkEntryUsageDescription: string;
          confirmEntryUsageTitle: string;
          confirmEntryUsageDescription: string;
          followStopTargetUsageTitle: string;
          followStopTargetUsageDescription: string;
        };
      };
      performanceHistory: {
        title: string;
        description: string;
        totalSummary: string;
        summaryTabLabel: string;
        historyTabLabel: string;
        allPeriodLabel: string;
        history: {
          searchPlaceholder: string;
          filterLabel: string;
          filterTitle: string;
          allStatusLabel: string;
          reanalyzeLabel: string;
          emptyTitle: string;
          emptyDescription: string;
          pageLabel: string;
          showingLabel: string;
          previousLabel: string;
          nextLabel: string;
        };
        stats: {
          totalAnalysis: string;
          stillValid: string;
          expired: string;
          stopLoss: string;
          takeProfitOne: string;
          takeProfitTwo: string;
          invalid: string;
        };
        consistentTimeframeLabel: string;
        mostExpiredLabel: string;
        mostStopLossLabel: string;
        instrumentPerformanceTitle: string;
        instrumentPerformanceDescription: string;
        sampleLabel: string;
        winRateLabel: string;
        viewHistoryLabel: string;
        timeframePerformanceTitle: string;
        timeframePerformanceDescription: string;
        timeframeColumnLabel: string;
        sampleColumnLabel: string;
        validColumnLabel: string;
        expiredColumnLabel: string;
        winRateColumnLabel: string;
        completionColumnLabel: string;
      };
      guide: {
        title: string;
        description: string;
      };
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
      accountModeLabel: string;
      demoModeLabel: string;
      realModeLabel: string;
      notificationCount: string;
      notifications: {
        buttonLabel: string;
        title: string;
        unreadLabel: string;
        allReadLabel: string;
        markAllReadLabel: string;
        unreadItemLabel: string;
        items: Array<{
          id: string;
          title: string;
          description: string;
          timeLabel: string;
          href: string;
        }>;
      };
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
      viewOnly: {
        badge: string;
        profileLabel: string;
        personalDescription: string;
        purposeDescription: string;
        emergencyDescription: string;
        employmentDescription: string;
        wealthDescription: string;
        photoLabel: string;
        accountIdLabel: string;
      };
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
        dailyStatement: string;
        withdrawal: string;
        deposit: string;
      };
      accountCenter: {
        statusLabel: string;
        servicesTitle: string;
        servicesDescription: string;
      };
      menuDescriptions: {
        profile: string;
        referral: string;
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
        sourceFunds: string;
        estimatedTransaction: string;
        investmentExperience: string;
        investmentField: string;
        futuresExperience: string;
        familyAffiliation: string;
        familyAffiliationDetail: string;
        bankruptStatus: string;
        emergencyName: string;
        emergencyRelationship: string;
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
        monthlyIncome: string;
        annualIncome: string;
        totalAssets: string;
        propertyOwnership: string;
        vehicleOwnership: string;
        houseLocation: string;
        njop: string;
        bankDeposit: string;
        amount: string;
        otherAssets: string;
        otherInvestments: string;
        bankAccount: string;
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
    dailyStatementPage: {
      title: string;
      description: string;
      downloadLabel: string;
      preparingLabel: string;
      tabs: {
        account: string;
        open: string;
        settled: string;
      };
      labels: Record<string, string>;
      openPositions: Array<{
        id: string;
        symbol: string;
        side: string;
        volume: string;
        openPrice: string;
        marketPrice: string;
        floatingPl: string;
      }>;
      settledPositions: Array<{
        id: string;
        symbol: string;
        side: string;
        volume: string;
        openPrice: string;
        closePrice: string;
        profitLoss: string;
      }>;
    };
    referralPage: {
      title: string;
      description: string;
      hero: {
        eyebrow: string;
        title: string;
        description: string;
        cta: string;
      };
      accessTitle: string;
      codeLabel: string;
      linkLabel: string;
      copyLabel: string;
      copyLinkLabel: string;
      copiedLabel: string;
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
    marketSignalDetail: {
      updatedLabel: string;
      biasLabel: string;
      biasUpLabel: string;
      biasDownLabel: string;
      bidPriceLabel: string;
      askPriceLabel: string;
      todayMovementLabel: string;
      latestSignalTitle: string;
      entryLabel: string;
      takeProfitLabel: string;
      stopLossLabel: string;
      sourceLabel: string;
      timeframeLabel: string;
      buyActionLabel: string;
      sellActionLabel: string;
      latestNewsTitle: string;
      historyTitle: string;
      transactionModal: {
        buyBadgeLabel: string;
        sellBadgeLabel: string;
        buyTitle: string;
        sellTitle: string;
        buyDescription: string;
        sellDescription: string;
        closeLabel: string;
      };
    };
    tradingView: {
      disclaimerLabel: string;
      disclaimerTradingView: string;
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
