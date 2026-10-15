import type { AppMessages } from "../../shared/messages";

export const enClientArea: AppMessages["clientArea"] = {
  pageTitle: "Client Area",
  pageDescription:
    "A post-login home view with account summary, quick actions, and product signals.",
  viewOnlyDisclaimer: {
    label: "Disclaimer:",
    body: "All information, data, charts, and features displayed in the Client Area are view-only and cannot be used to execute transactions.",
  },
  login: {
    badge: "Client Portal",
    title: "Sign in Client Area",
    description:
      "Account authentication is being prepared and is not yet available on the website.",
    accountLabel: "Email",
    accountPlaceholder: "Enter your email",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    rememberMe: "Remember me on this device",
    forgotPassword: "Forgot password?",
    primaryCta: "Sign-in unavailable",
    secondaryCta: "Contact support",
    submitting: "Verifying access...",
    helper:
      "Use the official application or contact support for account access.",
    captchaTitle: "Security verification",
    captchaHelper:
      "Complete the reCAPTCHA challenge before entering the client area.",
    demoCredentialsTitle: "Account access",
    demoCredentialsAccount: "Website sign-in is not available yet.",
    demoCredentialsPassword: "",
    errorUnavailable:
      "The client area is currently disabled from the admin system. Please try again later.",
    errorRequired: "Enter your email and password.",
    errorInvalidCredentials:
      "The email or password you entered is incorrect. Please review your details and try again.",
    errorSessionConfiguration:
      "Sign-in cannot continue because the server session configuration is incomplete. Set CLIENT_AREA_SESSION_SECRET first.",
    errorCaptchaRequired:
      "Security verification was not completed. Please try again.",
    errorCaptchaFailed:
      "reCAPTCHA verification failed. Please retry the security check.",
    errorNetwork:
      "Unable to reach the login server. Check your internet connection and try again.",
    errorTimeout:
      "The login server took too long to respond. Please try again in a moment.",
    errorSessionExpired:
      "Your login session has expired. Reload the page and sign in again.",
    errorServer:
      "The login server is unavailable or returned a response that could not be processed. Please try again in a moment.",
    highlightsTitle: "What you can monitor",
    highlights: [
      "Real-time balance, equity, and floating P/L summary.",
      "Fast access to deposit, withdrawal, education, and products.",
      "Dedicated market watch, news, and transaction history sections.",
    ],
    securityTitle: "Account security",
    securityBody:
      "Only sign in through official domains and never share your OTP or password with anyone.",
  },
  otp: {
    title: "OTP Verification",
    description:
      "Your account needs additional verification. We've sent an OTP code to your registered number/device.",
    codeLabel: "OTP code",
    codePlaceholder: "Enter the 6-digit OTP code",
    submitLabel: "VERIFY",
    submitting: "Verifying code...",
    resendLabel: "Resend code",
    resending: "Resending...",
    resendSuccess: "A new OTP code has been sent.",
    backToLogin: "Back to login",
    errorRequired: "Enter your OTP code.",
    errorInvalidCode:
      "The OTP code is incorrect or has expired. Please try again.",
    errorSessionExpired:
      "The verification session has expired. Please sign in again.",
  },
  user: {
    name: "Anita",
    role: "My Demo Account",
    accountId: "1003713406",
    status: "Demo",
  },
  sidebar: {
    label: "Client navigation",
    backToWebsite: "Back to main website",
    tradeCta: "Trade",
    navItems: [
      {
        id: "home",
        label: "Home",
        href: "#overview",
      },
      {
        id: "market",
        label: "Market",
        href: "#market",
      },
      {
        id: "trade-pilot",
        label: "Trade Pilot",
        href: "/client-area/trade-pilot/analisis",
      },
      {
        id: "transaction",
        label: "Transaction",
        href: "#actions",
      },
      {
        id: "news",
        label: "News",
        href: "/news",
      },
      {
        id: "ebook",
        label: "Ebook",
        href: "/ebook",
      },
      {
        id: "account",
        label: "Account",
        href: "#account",
      },
    ],
  },
  livePriceTicker: {
    label: "Live prices and latest news",
    newsLabel: "News",
  },
  tradePilotPage: {
    access: {
      deniedTitle: "Trade Pilot is not available yet",
      deniedDescription:
        "This signed-in user does not have a verified Demo or Real account. Trade Pilot does not use or store account numbers.",
      missingDemoTitle: "Sorry, you do not have a Demo account yet",
      missingDemoDescription:
        "Select your verified Real account to use Trade Pilot in Real mode.",
      missingRealTitle: "Sorry, you do not have a Real account yet",
      missingRealDescription:
        "Select your Demo account to keep using Trade Pilot, or open a Real account first.",
      mockDataLabel: "Simulated data",
    },
    navigation: {
      label: "Trade Pilot navigation",
      items: {
        analysis: "Analysis",
        performanceHistory: "Performance History",
        guide: "Guide",
      },
    },
    analysis: {
      title: "Market Analysis",
      description:
        "Analyze real-time price movements with interactive charts and current market data.",
      quotaValue: "10/30 Days",
      quotaLabel: "Analysis Quota",
      sessionValue: "Sydney - Tokyo",
      sessionLabel: "Active Session",
      instrumentPickerTitle: "Select Instrument",
      searchPlaceholder: "Search instruments...",
      favoritesLabel: "Favorites",
      addFavoriteLabel: "Add favorite instrument",
      setAlertLabel: "Set Alert",
      analysisActionLabel: "Analyze",
      analysisLoadingLabel: "Analyzing...",
      insufficientCreditMessage:
        "The analysis credit for this mode is depleted.",
      analysisErrorMessage:
        "The analysis could not be created. Please try again.",
      noAnalysisTitle: "No analysis result yet",
      noAnalysisDescription:
        "Select an instrument and timeframe, then press Analyze. Results are currently deterministic simulations.",
      demoModeLabel: "Demo",
      realModeLabel: "Real",
      instrumentLabel: "Instrument:",
      currentPriceLabel: "Current price:",
      timeframeLabel: "Timeframe:",
      indicatorLabel: "Indicator",
      chartSettingsLabel: "Chart settings",
      fullscreenLabel: "Show fullscreen",
      exitFullscreenLabel: "Exit fullscreen",
      screenshotLabel: "Capture chart",
      captureInProgressLabel: "Capturing chart",
      captureUnsupportedMessage: "This browser does not support chart capture.",
      captureFailedMessage:
        "The chart could not be captured. Select the Client Area tab when the browser asks for a screen source.",
      fullscreenUnsupportedMessage:
        "Fullscreen mode is not supported by this browser.",
      instrumentNames: {
        gold: "Gold / U.S. Dollar",
        brent: "Brent Crude Oil",
        hangSeng: "Hang Seng Index",
        nikkei: "Nikkei 225 Index",
      },
      analysisResult: {
        relevanceLabel: "Relevant for approximately 4 more hours",
        pendingLabel: "Pending",
        sessionWindowLabel: "Tokyo • London",
        highestLiquidityLabel: "highest liquidity",
        bullishLabel: "Bullish",
        bearishLabel: "Bearish",
        sidewaysLabel: "Sideways",
        changeTimeframeTitle: "Change Timeframe",
        changeTimeframeDescription:
          "Same instrument, different timeframe — select one to analyze it immediately.",
        compareRiskLabel: "Compare Risk",
        directionBiasTitle: "Direction Bias",
        neutralWaitLabel: "Neutral / Wait",
        timeframeContextLabel: "For timeframe",
        bearishBiasLabel: "Strong bearish bias",
        neutralBiasLabel: "Neutral / Wait",
        bullishBiasLabel: "Strong bullish bias",
        tendencyDisclaimer:
          "Analytical tendency — not an instruction to buy or sell",
        confidenceLabel: "Confidence",
        overallRiskLabel: "Overall Risk",
        mediumRiskLabel: "Medium Risk",
        learnLabel: "Learn",
        confidenceReasonTitle: "Why Isn't Confidence Higher?",
        confidenceReasonDescription:
          "Price movement and changing market sessions can add volatility, so confidence in the technical scenario remains limited.",
        fullReasonLabel: "View Full Reason",
        analyzedAtLabel: "Analyzed",
        refreshAnalysisLabel: "Refresh Analysis",
        priceChartTitle: "Price Chart",
        updatedAtLabel: "Updated",
        viewFullChartLabel: "View full chart",
        resetLabel: "Reset",
        shareChartLabel: "Share chart",
        suggestedLevelsTitle: "Suggested Levels",
        recommendedSideLabel: "Recommended side",
        waitLabel: "Wait",
        suggestedLevelsDescription:
          "Entry, Stop Loss, and Take Profit levels for Buy and Sell scenarios based on the price range when the analysis was created.",
        buyScenarioLabel: "Buy Scenario",
        sellScenarioLabel: "Sell Scenario",
        entryLabel: "Entry",
        aboveLabel: "above",
        belowLabel: "below",
        breakoutHint: "after a breakout of the session high",
        breakdownHint: "after a breakdown of the session low",
        stopLossLabel: "Stop Loss",
        takeProfitOneLabel: "Take Profit 1",
        takeProfitTwoLabel: "Take Profit 2",
        riskRewardLabel: "Risk : Reward",
        reasonLabel: "Reason",
        buyReason:
          "Breakout confirmation above resistance with continued price momentum.",
        sellReason:
          "Breakdown confirmation below support with continued selling pressure.",
        copyLevelsLabel: "Copy levels",
        copiedLabel: "Levels copied",
      },
      technicalIndicators: {
        title: "Technical Indicators",
        description:
          "Live indicators • Saved analyses and plans do not update automatically",
        dataLabel: "Data",
        candleCountLabel: "13,744 candles",
        priceLabel: "Price",
        lastBarLabel: "Latest bar",
        twentyBarsLabel: "20 bars",
        signalSummaryLabel: "Signal summary",
        oscillatorLabel: "Oscillator",
        movingAverageLabel: "Moving Avg",
        movingAveragesLabel: "Moving Averages",
        leaningBullishLabel: "Leaning Bullish",
        leaningBearishLabel: "Leaning Bearish",
        bullishLabel: "Bullish",
        bearishLabel: "Bearish",
        neutralLabel: "Neutral",
        buyLabel: "Buy",
        sellLabel: "Sell",
        waitLabel: "Wait",
      },
      priceAlert: {
        title: "Price alerts",
        description:
          "Get a push notification when the live price reaches each AI level.",
        toggleLabel: "Enable or disable price alerts",
        statusLabel: "Alert",
        activeLabel: "Active",
        inactiveLabel: "Inactive",
        entryLabel: "Entry",
        stopLossLabel: "Stop Loss",
        takeProfitOneLabel: "Take Profit 1",
        takeProfitTwoLabel: "Take Profit 2",
        triggeredLabel: "Triggered",
        cancelledLabel: "Cancelled",
      },
      footer: {
        eyebrow: "Get TradePilot on",
        title: "Available on iOS and Android",
        description:
          "Monitor the market, view recommendations, and manage your watchlist anytime.",
        googlePlayAlt: "Get TradePilot on Google Play",
        appStoreAlt: "Get TradePilot on the App Store",
        logoAlt: "TradePilot logo",
        supportTitle:
          "TradePilot is a decision-support tool, not financial advice or a trading service.",
        supportDescription:
          "Decisions and risks remain yours. Past performance does not guarantee future results.",
        disclaimerLabel: "Disclaimer:",
        disclaimerDescription:
          "All information, data, charts, and features displayed in the Client Area are view-only and cannot be used to execute transactions.",
        legalNavigationLabel: "TradePilot legal links",
        privacyLabel: "Privacy Policy",
        termsLabel: "Terms of Service",
        helpLabel: "Help",
        deleteAccountLabel: "Delete Account",
        tiktokLabel: "Visit TradePilot.id on TikTok",
        copyright: "Solid Gold Berjangka. TradePilot. All rights reserved.",
      },
      fundamentalContext: {
        title: "Fundamental Context",
        description: "News and events related to this analysis.",
        refreshLabel: "Refresh fundamentals",
        latestNewsLabel: "Latest News",
        economicCalendarLabel: "Economic Calendar",
        learnLabel: "Learn",
        items: [
          {
            title:
              "US Bond Yields Keep Climbing — But Retail Traders Still Can't Get Enough Stocks",
            source: "Yahoo Finance",
            publishedAt: "about 1 hour ago",
          },
          {
            title:
              "Gold Remains Under Pressure as the Dollar and US Yields Weigh on Prices",
            source: "Newsmaker.id",
            publishedAt: "about 4 hours ago",
          },
          {
            title:
              "Japan's Finance Minister Supports BoJ Rate Hikes and Inflation Target",
            source: "Newsmaker.id",
            publishedAt: "about 4 hours ago",
          },
          {
            title: "Markets Await US Economic Data Amid Rising Bond Yields",
            source: "Newsmaker.id",
            publishedAt: "about 5 hours ago",
          },
          {
            title: "Gold Trades Sideways Ahead of the London Session Open",
            source: "Newsmaker.id",
            publishedAt: "about 6 hours ago",
          },
        ],
      },
      marketContextSummary: {
        eyebrow: "Market Context Summary",
        bearishTitle: "Leaning Bearish",
        bullishTitle: "Leaning Bullish",
        sellLabel: "Sell",
        buyLabel: "Buy",
        bearishDescription:
          "7 of 11 indicators are leaning bearish, while 3 are bullish and 1 is neutral.",
        bullishDescription:
          "7 of 11 indicators are leaning bullish, while 3 are bearish and 1 is neutral.",
        bearishNote:
          "Current data favors a downside scenario — confirm with price action before making a decision.",
        bullishNote:
          "Current data favors an upside scenario — confirm with price action before making a decision.",
      },
      tradingPlan: {
        title: "Adaptive Trading Plan",
        description:
          "Entry, lot size, and risk simulation based on this analysis.",
        lotUnitLabel: "lot",
        accountTypeLabel: "Account Type",
        microAccountLabel: "Micro",
        microAccountDesc: "Minimum 0,01 lot · margin $10",
        miniAccountLabel: "Mini",
        miniAccountDesc: "Minimum 0,10 lot · margin $100",
        regularAccountLabel: "Regular",
        regularAccountDesc: "Minimum 1,00 lot · margin $1.000",
        tradingCapitalLabel: "Trading capital",
        lossLimitLabel: "Loss limit",
        riskStyleLabel: "Risk Style",
        conservativeLabel: "Conservative",
        moderateLabel: "Moderate",
        aggressiveLabel: "Aggressive",
        intradayNote:
          "This calculation only covers intraday positions (day trades); overnight positions are not included.",
        snapshotLabel: "Analysis candle snapshot captured",
        snapshotValue: "2/10/2026, 09:10:15",
        createRecommendationLabel: "Create Recommendation",
        selectDirectionLabel: "Choose One Direction",
        waitStatusLabel: "Wait",
        limitedOptionsLabel: "Limited options only",
        waitDescription:
          "The minimum lot risk exceeds the selected risk target, although it remains below the loss limit. Do not enter.",
        waitGuidance:
          "Wait for another setup with a maximum minimum-lot risk of $225; do not move the stop.",
        minimumStopRiskLabel: "Minimum risk at stop",
        warningTitle: "No safe plan is available yet",
        warningDescription:
          "Neither side currently has an approved safe plan. Review the status and minimum lot figures for each side below; diagnostic figures are not a valid entry plan. Only adjust financial inputs when independently affordable and acceptable, or wait and skip the setup.",
        buyScenarioLabel: "Upside Scenario (Buy)",
        buyScenarioDescription:
          "The upside (Buy) scenario is adjusted for risk and available funds. Confirm the latest chart before entry.",
        buyScenarioGuidance:
          "Monitor entry around {entry}. Enter only after the setup is confirmed; do not move the stop.",
        sellScenarioLabel: "Downside Scenario (Sell)",
        sellScenarioDescription:
          "The downside (Sell) scenario is adjusted for risk and available funds. Confirm the latest chart before entry.",
        sellScenarioGuidance:
          "Monitor entry around {entry}. Enter only after the setup is confirmed; do not move the stop.",
        brokerFundsUntilStopLabel: "Broker Funds Until Stop",
        understandDetailsLabel: "Understand the details",
        understandDetailsDescription:
          "Review the complete explanation, calculations for each position, and the logic behind this recommendation.",
        cancellationConditionsLabel: "3 cancellation conditions",
        savePlanLabel: "Save Plan",
        shareLabel: "Share",
        entryPositionLabel: "Entry (1 position)",
        initialEntryDescription: "Initial entry price",
        stopLossLabel: "Stop Loss",
        finalStopLossDescription: "One final SL",
        riskBudgetLabel: "Risk budget",
        riskBudgetDescription: "{percentage}% of the {limit} limit",
        targetProfitLabel: "Profit Target",
        takeProfitOneShortLabel: "TP1",
        takeProfitTwoShortLabel: "TP2",
        riskStyleDescriptions: {
          conservative: "Lower risk",
          moderate: "Balanced risk",
          aggressive: "Higher risk",
        },
        planSummaryLabel: "Plan Summary",
        planDetailsLabel: "Plan Details",
        unusedCandidatesLabel: "Unused layer candidates",
        recommendationUsageLabel: "How to use this recommendation",
        entryAndLotTitle: "Entry price & lot per position",
        allEntriesFilledDescription:
          "When all entries are filled: 1 position · {lot} lot",
        initialEntryLabel: "Position 1: Initial entry",
        riskSectionTitle: "Risk",
        finalStopLossLabel: "One final Stop Loss",
        maximumLossEstimateLabel: "Estimated maximum loss",
        targetProfitSectionTitle: "Profit target",
        takeProfitOneLabel: "Take Profit 1",
        takeProfitTwoLabel: "Take Profit 2",
        estimatedProfitLabel: "Estimated profit",
        riskContextTitle: "Risk context",
        usableRiskBudgetLabel: "Usable risk budget",
        guardrailDescription: "{percentage}% of the loss limit after guardrail",
        proposedLossLimitLabel: "Reserved loss limit",
        initialEntryOnlyNote:
          "This scenario is for the initial entry only; no additional layer is recommended.",
        otherCalculationDetailsLabel: "Other calculation details",
        weightedAverageEntryLabel: "Weighted average entry",
        usedMarginLabel: "Margin used",
        marginAndStopLossLabel: "Day margin + loss at SL",
        initialPositionTitle: "Position 1 · Initial entry",
        entryFromPlanDescription: "Entry from the {account} Plan",
        positionMarginLabel: "Position margin",
        positionRiskAtStopLabel: "Position risk at SL",
        fundsNeededAtFinalStopLabel: "Funds required at final SL",
        remainingFundsLabel: "Remaining funds",
        ifEntryFilledTitle: "When the entry is filled",
        firstEntryOnlyDescription: "Initial entry only · {lot} lot",
        filledEntrySummary:
          "1 position · {lot} lot · {margin} margin · {risk} loss at SL ({riskPercentage}% of free funds), TP2 gross profit {profit} ({profitPercentage}% of free funds).",
        whyNotAllLossLimitTitle: "Why isn't the entire loss limit used?",
        marginAndRiskExplanationLabel: "Margin and risk-limit explanation",
        whyNotAllLossLimitDescription:
          "Funds must be sufficient to cover margin and the potential Stop Loss. Increasing the lot size may push the total funding requirement beyond the plan limit.",
        estimateNotesTitle: "Estimate notes",
        estimateMayChangeLabel: "Calculation results may change",
        estimateNotesDescription:
          "Calculations are based only on filled positions and the listed prices. Actual results may differ due to spread, transaction fees, slippage, or earlier position closure.",
        unusedPositionLabel: "Position {position} · {entry}",
        notUsedLabel: "Not used",
        exceedsAccumulatedRiskLabel: "Exceeds the hard accumulated-loss limit",
        conditionalFinancialPlanLabel: "Conditional financial plan",
        conditionalFinancialPlanDescription:
          "This candidate is blocked only by the entered funds or loss limit. It is not yet part of the active plan.",
        marginUsedUntilHereLabel: "Margin used up to this point",
        totalRiskAtFinalStopLabel: "Total risk at final SL",
        totalFundsAtFinalStopLabel: "Total funds required at final SL",
        additionalLossLimitLabel: "Additional loss limit required",
        manualOrderWarning:
          "Manual only: price moving against the position is not a trigger by itself.",
        chooseScenarioUsageTitle: "Choose one scenario",
        chooseScenarioUsageDescription:
          "Choose either the upside or downside scenario based on your decision.",
        checkEntryUsageTitle: "Check the entry level",
        checkEntryUsageDescription:
          "Enter at the level listed in the trade plan.",
        confirmEntryUsageTitle: "Confirm before entry",
        confirmEntryUsageDescription:
          "Ensure price has reached the level, the setup remains valid, no invalidation has occurred, and no new fundamental risk is present.",
        followStopTargetUsageTitle: "Follow the Stop Loss and targets",
        followStopTargetUsageDescription:
          "Cut the loss if price reaches the Cut Loss / SL. Do not move this limit to hold a losing position.",
      },
    },
    performanceHistory: {
      title: "Performance History",
      description:
        "Review Trade Pilot analysis results and performance development over time.",
      totalSummary: "58 total analyses",
      summaryTabLabel: "Summary",
      historyTabLabel: "History",
      allPeriodLabel: "All",
      stats: {
        totalAnalysis: "Total analyses",
        stillValid: "Still valid",
        expired: "Expired",
        stopLoss: "Stop Loss",
        takeProfitOne: "Take Profit 1",
        takeProfitTwo: "Take Profit 2",
        invalid: "Invalid",
      },
      consistentTimeframeLabel: "Most consistent timeframe",
      mostExpiredLabel: "Most frequently expired",
      mostStopLossLabel: "Most frequently hit SL",
      instrumentPerformanceTitle: "Performance by instrument",
      instrumentPerformanceDescription:
        "Select an instrument to focus its timeframe performance.",
      sampleLabel: "samples",
      winRateLabel: "Win",
      viewHistoryLabel: "View history",
      timeframePerformanceTitle: "Performance by timeframe",
      timeframePerformanceDescription:
        "Win rate compares TP against TP + SL. Expired setups only count toward the completion rate.",
      timeframeColumnLabel: "Timeframe",
      sampleColumnLabel: "Samples",
      validColumnLabel: "Still valid",
      expiredColumnLabel: "Expired",
      winRateColumnLabel: "Win rate",
      completionColumnLabel: "Completion",
    },
    guide: {
      title: "Trade Pilot Guide",
      description:
        "Learn how to read the analysis and use Trade Pilot features effectively.",
    },
  },
  topbar: {
    supportLabel: "Download MIFX App",
    supportPhone: "021-50996650",
    logoutLabel: "Log Out",
    logoutModal: {
      title: "Log out from Client Area?",
      description:
        "You will be signed out from the current session and returned to the login page.",
      cancelLabel: "Cancel",
      confirmLabel: "Yes, log out",
      submittingLabel: "Logging out...",
    },
    primaryCta: "Open Live Account",
    accountMode: "Demo",
    accountModeLabel: "Account Mode",
    demoModeLabel: "Demo",
    realModeLabel: "Real",
    notificationCount: "1",
    notifications: {
      buttonLabel: "Open TradePilot notifications",
      title: "TradePilot Notifications",
      unreadLabel: "{count} unread notifications",
      allReadLabel: "All notifications have been read",
      markAllReadLabel: "Mark all read",
      unreadItemLabel: "Unread",
      items: [
        {
          id: "analysis-ready",
          title: "Your latest analysis is ready",
          description:
            "View the latest market direction and scenario levels from TradePilot.",
          timeLabel: "Just now",
          href: "/client-area/trade-pilot/analisis",
        },
        {
          id: "plan-reminder",
          title: "Trading Plan awaiting confirmation",
          description:
            "Review the entry, Stop Loss, and target levels before using the plan.",
          timeLabel: "10 minutes ago",
          href: "/client-area/trade-pilot/analisis",
        },
        {
          id: "performance-update",
          title: "Performance history updated",
          description:
            "The latest TradePilot timeframe performance summary is now available.",
          timeLabel: "Today",
          href: "/client-area/trade-pilot/riwayat-performa",
        },
      ],
    },
    breadcrumb: "1003713406",
    navItems: [
      {
        label: "PRODUCTS",
        href: "/produk/multilateral",
      },
      {
        label: "EDUCATION",
        href: "/education/cara-memulai",
      },
      {
        label: "NEWS",
        href: "/news",
      },
      {
        label: "ABOUT",
        href: "/about",
      },
    ],
  },
  accountPanel: {
    eyebrow: "My Demo Account",
    title: "1003713406",
    primaryCta: "Change Demo Balance",
    items: [
      {
        id: "balance",
        label: "Balance",
        value: "$78.23",
      },
      {
        id: "equity",
        label: "Equity",
        value: "$78.23",
      },
    ],
  },
  promoPanel: {
    eyebrow: "MIFX Priority",
    title: "Exclusive benefits and priority access for active clients.",
    description:
      "Use this featured banner area for campaign content, loyalty offers, or post-login education highlights.",
    cta: "Learn more",
  },
  quickActions: {
    items: [
      {
        id: "education",
        label: "Ebook",
      },
      {
        id: "products",
        label: "Product",
      },
      {
        id: "withdraw",
        label: "Withdraw",
      },
      {
        id: "deposit",
        label: "Deposit",
      },
      {
        id: "temporary",
        label: "Transaction",
      },
    ],
  },
  shortcutPanel: {
    items: [
      {
        id: "signal",
        label: "Trading Signal",
      },
      {
        id: "mover",
        label: "Top Mover",
      },
      {
        id: "trending",
        label: "Trending",
      },
      {
        id: "products",
        label: "Products",
      },
      {
        id: "education",
        label: "Education",
      },
      {
        id: "rewards",
        label: "Rewards",
      },
      {
        id: "deposit",
        label: "Deposit",
      },
      {
        id: "more",
        label: "More",
      },
    ],
  },
  signalsPanel: {
    title: "Recommendations",
    cta: "See all",
    items: [
      {
        symbol: "XAUUSD",
        title: "Gold",
        time: "15:56 WIB",
        bias: "sell",
      },
      {
        symbol: "EURUSD",
        title: "EURUSD",
        time: "16:01 WIB",
        bias: "buy",
      },
      {
        symbol: "USDJPY",
        title: "USDJPY",
        time: "16:05 WIB",
        bias: "buy",
      },
      {
        symbol: "GBPUSD",
        title: "GBPUSD",
        time: "16:04 WIB",
        bias: "buy",
      },
      {
        symbol: "OIL",
        title: "Oil",
        time: "16:07 WIB",
        bias: "sell",
      },
    ],
  },
  servicePanel: {
    title: "Client Services",
    items: [
      {
        label: "Live Quote",
        description:
          "Track real-time prices to prepare faster entry decisions.",
        cta: "Open market feed",
      },
      {
        label: "Economic Calendar",
        description:
          "Review high-impact events that may affect daily volatility.",
        cta: "View schedule",
      },
      {
        label: "Client Service Help",
        description:
          "Contact support for login, transaction, or verification issues.",
        cta: "Contact support",
      },
    ],
  },
  accountPage: {
    activeAccount: "Active account",
    backLabel: "Back",
    pendingSectionNote:
      "The details for this section will be added next. For now only Personal Data has been finalized.",
    saveLabel: "Save",
    viewOnly: {
      badge: "Secure",
      profileLabel: "Client Profile",
      personalDescription: "Primary identity and contact information",
      purposeDescription: "Investment profile and transaction objectives",
      emergencyDescription: "Emergency contact information",
      employmentDescription: "Employment and income information",
      wealthDescription: "Assets and ownership portfolio",
      photoLabel: "Profile photo",
      accountIdLabel: "Account number",
    },
    sections: {
      personal: "Personal Data",
      purpose: "Account Opening Purpose",
      emergency: "Emergency Contact",
      job: "Employment Data",
      wealth: "Wealth Data",
    },
    menuItems: {
      profile: "Profile",
      referral: "Referral Code",
      dailyStatement: "Daily Statement",
      withdrawal: "Withdrawal",
      deposit: "Deposit",
    },
    accountCenter: {
      statusLabel: "Account status",
      servicesTitle: "Account services",
      servicesDescription: "Choose the service you want to view or manage.",
    },
    menuDescriptions: {
      profile:
        "View your identity, contact, employment, and financial profile.",
      referral: "The Referral Code feature is temporarily disabled.",
      dailyStatement: "View account activity summaries and daily statements.",
      withdrawal: "Open the fund withdrawal request service.",
      deposit: "Open deposit information and funding services.",
    },
    fields: {
      fullName: "Full Name",
      email: "Email",
      birthPlace: "Place of Birth",
      birthDate: "Date of Birth",
      identityNumber: "Identity Number (ID / Passport)",
      taxNumber: "Tax Number",
      gender: "Gender",
      maritalStatus: "Marital Status",
      spouseName: "Spouse Name",
      homeAddress: "Home Address",
      rt: "RT",
      rw: "RW",
      province: "Province",
      city: "City / Regency",
      subdistrict: "Subdistrict",
      postalCode: "Postal Code",
      phone: "Mobile Number",
      openingPurpose: "Account Opening Purpose",
      sourceFunds: "Source of Funds",
      estimatedTransaction: "Estimated Transaction Value",
      investmentExperience: "Investment Experience",
      investmentField: "Investment Field",
      futuresExperience: "Futures Trading Experience",
      familyAffiliation:
        "Do you have a family member working at BAPPEBTI / Futures Exchange / Clearing Institution",
      familyAffiliationDetail: "Details",
      bankruptStatus: "Have you ever been declared bankrupt by a court",
      emergencyName: "Name",
      emergencyRelationship: "Relationship",
      emergencyAddress: "Home Address",
      emergencyNeighborhood: "RT / RW",
      emergencyProvince: "Province",
      emergencyCity: "City / Regency",
      emergencySubdistrict: "Subdistrict",
      emergencyPostalCode: "Postal Code",
      emergencyPhone: "Phone Number",
      occupation: "Occupation",
      companyName: "Company Name",
      businessSector: "Business Sector",
      position: "Position",
      yearsWorking: "Years Working",
      previousOffice: "Previous Office",
      officeAddress: "Office Address",
      officePostalCode: "Postal Code",
      officePhone: "Office Phone",
      monthlyIncome: "Monthly Income",
      annualIncome: "Annual Income",
      totalAssets: "Total Assets",
      propertyOwnership: "Property Ownership",
      vehicleOwnership: "Vehicle Ownership",
      houseLocation: "House, Location",
      njop: "Tax Object Sales Value",
      bankDeposit: "Bank Deposit",
      amount: "Amount",
      otherAssets: "Other Assets",
      otherInvestments: "Other Investments",
      bankAccount: "Bank Account",
      occupationOther: "Other, specify",
    },
    options: {
      binary: [
        {
          value: "yes",
          label: "Yes",
        },
        {
          value: "no",
          label: "No",
        },
      ],
      purpose: [
        {
          value: "hedging",
          label: "Hedging",
        },
        {
          value: "speculation",
          label: "Speculation",
        },
        {
          value: "other",
          label: "Other,",
        },
      ],
      investmentExperience: [
        {
          value: "yes",
          label: "Yes, Field:",
        },
        {
          value: "no",
          label: "No",
        },
      ],
      occupation: [
        {
          value: "private",
          label: "Private Employee",
        },
        {
          value: "entrepreneur",
          label: "Entrepreneur",
        },
        {
          value: "homemaker",
          label: "Homemaker",
        },
        {
          value: "professional",
          label: "Professional",
        },
        {
          value: "government",
          label: "Government Employee",
        },
        {
          value: "stateOwned",
          label: "State-Owned Employee",
        },
        {
          value: "student",
          label: "Student",
        },
        {
          value: "other",
          label: "Other, specify",
        },
      ],
      annualIncome: [
        {
          value: "100to250",
          label: "Between IDR 100 - 250 Million",
        },
        {
          value: "250to500",
          label: "Between IDR 250 - 500 Million",
        },
        {
          value: "gt500",
          label: "Above IDR 500 Million",
        },
      ],
    },
  },
  dailyStatementPage: {
    title: "Daily Statement",
    description:
      "A daily summary of your trading account positions and balance movements.",
    downloadLabel: "Download Daily Statement",
    preparingLabel: "Preparing PDF",
    tabs: {
      account: "Account Statement",
      open: "Open Position",
      settled: "Settled Statement",
    },
    labels: {
      accountNumber: "Account No.",
      aeCode: "AE Code",
      date: "Date",
      previousBalance: "Previous Balance",
      marginMovement: "Margin In/Out",
      storageRollover: "Storage/Rollover",
      profitLoss: "Profit/Loss",
      facilityFee: "Facility Fee",
      vat: "VAT",
      premiumDiscount: "Premium/Discount",
      interest: "Interest",
      adjustment: "Adjustment",
      newBalance: "New Balance",
      floatingPl: "Floating P/L",
      equity: "Equity",
      marginRequired: "Margin Required",
      effectiveMargin: "Effective Margin",
      equityRate: "Equity Rate",
      openPrice: "Open Price",
      marketPrice: "Market Price",
      closePrice: "Close Price",
    },
    openPositions: [
      {
        id: "open-xul10",
        symbol: "XUL10",
        side: "BUY",
        volume: "1.00 lot",
        openPrice: "$ 2,615.40",
        marketPrice: "$ 2,619.90",
        floatingPl: "+$ 450.00",
      },
      {
        id: "open-eu1010",
        symbol: "EU1010",
        side: "BUY",
        volume: "0.50 lot",
        openPrice: "$ 1.08320",
        marketPrice: "$ 1.08410",
        floatingPl: "+$ 45.00",
      },
    ],
    settledPositions: [
      {
        id: "settled-xul10",
        symbol: "XUL10",
        side: "BUY",
        volume: "2.00 lot",
        openPrice: "$ 2,594.20",
        closePrice: "$ 2,613.75",
        profitLoss: "+$ 3,910.00",
      },
      {
        id: "settled-hkk50",
        symbol: "HKK50_BBJ",
        side: "SELL",
        volume: "1.00 lot",
        openPrice: "$ 19,844.00",
        closePrice: "$ 19,812.00",
        profitLoss: "+$ 320.00",
      },
    ],
  },
  referralPage: {
    title: "Referral Code",
    description:
      "Invite friends to join and earn rewards from their trading activity.",
    hero: {
      eyebrow: "Referral Code",
      title: "Invite Friends,\nEarn Rewards",
      description:
        "Share the opportunity with your network and enjoy commissions from active referrals.",
      cta: "Register Now",
    },
    accessTitle: "Your referral code and link",
    codeLabel: "Referral Code",
    linkLabel: "Referral link",
    copyLabel: "Copy code",
    copyLinkLabel: "Copy link",
    copiedLabel: "Copied",
    stepsTitle: "How Referral Code Works",
    steps: [
      "Get your referral link or code from your SG Solid account.",
      "Share it with potential users.",
      "The user registers a trading account through your referral.",
      "You receive commissions from their trading activity based on the applicable terms.",
    ],
    closing:
      "Join and start sharing your link to unlock more opportunities. Register now and maximize your earning potential with Referral Code.",
  },
  withdrawalHistoryPage: {
    title: "Withdrawal History",
    description:
      "Monitor your latest withdrawal requests, destination bank account, and processing references from one place.",
    summary: {
      totalCompleted: "Completed Withdrawals",
      activeRequests: "Active Requests",
      lastProcessed: "Last Processed",
      destinationBank: "Primary Destination Bank",
    },
    list: {
      requestId: "Request ID",
      requestDate: "Requested At",
      processedDate: "Processed At",
      destination: "Destination",
      amount: "Amount",
      fee: "Fee",
      netAmount: "Net Amount",
      reference: "Reference",
      accountHolder: "Account Holder",
      note: "Note",
    },
    status: {
      completed: "Completed",
      pending: "Pending",
      processing: "Processing",
      rejected: "Rejected",
    },
    emptyTitle: "There is no withdrawal history yet.",
    emptyBody:
      "Your withdrawal requests will appear here after they have been recorded by the system.",
  },
  depositHistoryPage: {
    title: "Deposit History",
    description:
      "Review your funding history, source bank account, and the credit status to your trading account.",
    summary: {
      totalCompleted: "Completed Deposits",
      activeRequests: "Active Requests",
      lastProcessed: "Last Processed",
      sourceBank: "Primary Source Bank",
    },
    list: {
      requestId: "Request ID",
      requestDate: "Requested At",
      processedDate: "Processed At",
      source: "Funding Source",
      amount: "Transfer Amount",
      fee: "Fee",
      creditedAmount: "Credited Amount",
      reference: "Reference",
      senderName: "Sender Name",
      tradingAccount: "Trading Account",
      note: "Note",
    },
    status: {
      completed: "Completed",
      pending: "Pending",
      processing: "Processing",
      rejected: "Rejected",
    },
    emptyTitle: "There is no deposit history yet.",
    emptyBody:
      "Your deposit requests will appear here after they have been recorded by the system.",
  },
  marketSignalDetail: {
    updatedLabel: "Updated",
    biasLabel: "Bias",
    biasUpLabel: "Upside Potential",
    biasDownLabel: "Downside Potential",
    bidPriceLabel: "Bid Price",
    askPriceLabel: "Ask Price",
    todayMovementLabel: "Today's Movement",
    latestSignalTitle: "Latest Signal",
    entryLabel: "Entry",
    takeProfitLabel: "Take Profit",
    stopLossLabel: "Stop Loss",
    sourceLabel: "Source",
    timeframeLabel: "Signal Analysis Timeframe",
    buyActionLabel: "Potential Buy",
    sellActionLabel: "Potential Sell",
    latestNewsTitle: "Latest News",
    historyTitle: "Signal History",
    transactionModal: {
      buyBadgeLabel: "Buy Signal",
      sellBadgeLabel: "Sell Signal",
      buyTitle: "Buy Transactions Are Available in the App",
      sellTitle: "Sell Transactions Are Available in the App",
      buyDescription:
        "To open a Buy position for this signal, please sign in through the Solid Gold Berjangka app.",
      sellDescription:
        "To open a Sell position for this signal, please sign in through the Solid Gold Berjangka app.",
      closeLabel: "Close",
    },
  },
  tradingView: {
    disclaimerLabel: "Disclaimer:",
    disclaimerTradingView:
      "Our chart is provided by TradingView, an international charting platform for traders and investors, providing high-performance market data such as EURUSD chart, XAUUSD and other forex instruments, as well as advanced tools for more comprehensive market analysis: detailed symbol charts, the latest financial news, economic calendar, and more – simply everything a prepared trader may need.",
  },
  fundTransferModal: {
    closeLabel: "Close",
    depositTitle: "Oops! Deposit Isn't Available on the Website Yet",
    withdrawalTitle: "Oops! Withdrawal Isn't Available on the Website Yet",
    depositDescription:
      "Don't worry, you can still make a deposit quickly and easily through the mobile app.",
    withdrawalDescription:
      "Don't worry! You can still complete your withdrawal quickly and easily through the mobile app.",
  },
};
