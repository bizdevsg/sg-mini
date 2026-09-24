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
    accountLabel: "Account number or email",
    accountPlaceholder: "Enter your account number or email",
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
    errorRequired:
      "Enter your account number or email together with your password.",
    errorInvalidCredentials:
      "The account number, email, or password you entered is incorrect. Please review your details and try again.",
    errorSessionConfiguration:
      "Sign-in cannot continue because the server session configuration is incomplete. Set CLIENT_AREA_SESSION_SECRET first.",
    errorCaptchaRequired:
      "Security verification was not completed. Please try again.",
    errorCaptchaFailed:
      "reCAPTCHA verification failed. Please retry the security check.",
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
    notificationCount: "1",
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
      referral: "SG Solid Referral",
      documentApproval: "Approval Document",
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
      profile: "View your identity, contact, employment, and financial profile.",
      referral: "Access your referral code and SG Solid program information.",
      documentApproval: "Review approval documents associated with your account.",
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
  approvalDocumentPage: {
    title: "Approval Documents",
    description:
      "Review and download copies of approval forms associated with your account.",
    downloadLabel: "Download",
    preparingLabel: "Preparing",
    accountHolderLabel: "Client name",
    accountNumberLabel: "Account number",
    generatedAtLabel: "Downloaded at",
    pdfNotice:
      "This document is a digital copy for the account currently active in the Client Area.",
    documents: [
      { id: "cdds-01", code: "Form PBK. CDDS. 01", title: "Futures Brokerage Company Profile" },
      { id: "cdds-02-1", code: "Form PBK. CDDS. 02.1", title: "Statement of Completion of Futures Trading Simulation" },
      { id: "cdds-02-2", code: "Form PBK. CDDS. 02.2", title: "Statement of Experience in Conducting Futures Trading Transactions" },
      { id: "cdds-03-1", code: "Form PBK. CDDS. 03", title: "Disclosure Statement" },
      { id: "cdds-04", code: "Form PBK. CDDS. 04", title: "Transaction Account Opening Application" },
      { id: "cdds-03-2", code: "Form PBK. CDDS. 03", title: "Disclosure Statement" },
      { id: "cdds-05", code: "Form PBK. CDDS. 05", title: "Risk Disclosure Document" },
      { id: "cdds-03-3", code: "Form PBK. CDDS. 03", title: "Disclosure Statement" },
      { id: "cdds-06", code: "Form PBK. CDDS. 06", title: "Mandate Agreement" },
      { id: "cdds-07", code: "Form PBK. CDDS. 07", title: "List of Futures Contracts, Derivative Contracts, Other Derivative Contracts, and Trading Rules" },
      { id: "cdds-08", code: "Form PBK. CDDS. 08", title: "Statement of Responsibility for the Client Transaction Access Code (Personal Access Password)" },
    ],
  },
  dailyStatementPage: {
    title: "Daily Statement",
    description: "A daily summary of your trading account positions and balance movements.",
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
      { id: "open-xul10", symbol: "XUL10", side: "BUY", volume: "1.00 lot", openPrice: "$ 2,615.40", marketPrice: "$ 2,619.90", floatingPl: "+$ 450.00" },
      { id: "open-eu1010", symbol: "EU1010", side: "BUY", volume: "0.50 lot", openPrice: "$ 1.08320", marketPrice: "$ 1.08410", floatingPl: "+$ 45.00" },
    ],
    settledPositions: [
      { id: "settled-xul10", symbol: "XUL10", side: "BUY", volume: "2.00 lot", openPrice: "$ 2,594.20", closePrice: "$ 2,613.75", profitLoss: "+$ 3,910.00" },
      { id: "settled-hkk50", symbol: "HKK50_BBJ", side: "SELL", volume: "1.00 lot", openPrice: "$ 19,844.00", closePrice: "$ 19,812.00", profitLoss: "+$ 320.00" },
    ],
  },
  referralPage: {
    title: "Referral Code",
    description:
      "Invite friends to join and earn rewards from their trading activity.",
    hero: {
      eyebrow: "SG Solid Referral Program",
      title: "Invite Friends,\nEarn Rewards",
      description:
        "Share the opportunity with your network and enjoy commissions from active referrals.",
      cta: "Register Now",
      brandAlt: "PT Solid Gold Berjangka",
      visualAlt: "SG Solid referral program visual",
    },
    stepsTitle: "How The SG Solid Referral Program Works",
    steps: [
      "Get your referral link or code from your SG Solid account.",
      "Share it with potential users.",
      "The user registers a trading account through your referral.",
      "You receive commissions from their trading activity based on the applicable terms.",
    ],
    closing:
      "Join the Referral Program and start sharing your link to unlock more opportunities. Register now and maximize your earning potential with the SG Solid Referral Program.",
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
