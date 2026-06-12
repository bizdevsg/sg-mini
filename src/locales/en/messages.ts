import { getCdnAssetUrl } from "@/lib/env";

import type { AppMessages } from "../shared/messages";

export const enMessages: AppMessages = {
  app: {
    title: "SGB Mini",
    description:
      "SGB Mini landing page with live quotes, spread information, and trading content in English.",
    brandName: "Solid Gold Berjangka",
    brandWordmark: "Solid",
    homeLabel: "Back to homepage",
  },
  navbar: {
    login: "Login",
    openAccount: "Sign Up",
    switchLocaleLabel: "Switch to Indonesian",
    switchLocaleIconAlt: "Indonesia flag icon",
    openMenuLabel: "Open navigation menu",
    closeMenuLabel: "Close navigation menu",
    menuGroups: [
      {
        label: "Products",
        items: [
          {
            label: "Multilateral Products",
            href: "/produk/multilateral",
          },
          { label: "Bilateral Products", href: "/produk/bilateral" },
          { label: "Solid Gold App" },
          { label: "Live Quote", href: "/live-quote" },
        ],
      },
      {
        label: "Education",
        items: [
          { label: "Getting Started" },
          { label: "Ebook", href: "/ebook" },
        ],
      },
      {
        label: "News",
        items: [
          { label: "Latest News", href: "/news" },
          { label: "Economic Calendar", href: "/economic-calendar" },
          { label: "Historical Data", href: "/historical-data" },
        ],
      },
      {
        label: "About",
        href: "/about",
      },
    ],
  },
  hero: {
    titleLead: "Trusted for 20 Years",
    titleBody: "By Thousands of Indonesian Traders",
    cta: "Start Trading",
    visualAlt: "Trading app displayed on a mobile phone",
  },
  regulator: {
    eyebrow: "Officially regulated by",
  },
  trustStats: {
    title: "Trade on a Safe and Trusted Platform",
    subtitle:
      "SG Mini is a preferred platform for forex and commodities trading with one of the largest transaction volumes in Indonesia.",
    stats: [
      { value: "24/5", label: "Customer Support" },
      { value: "25", label: "Years of Experience" },
      { value: "15k+", label: "Positive Reviews" },
      { value: "50+", label: "Official Awards" },
    ],
  },
  security: {
    title: "Security and Legality",
    subtitle:
      "Trade more safely with segregated client funds, regulatory oversight, and internationally standardized security systems.",
    cards: [
      {
        title: "Trusted and Recognized",
        body: "A BAPPEBTI-regulated platform that has earned multiple industry awards.",
        variant: "featured",
        image: {
          src: getCdnAssetUrl("aed38b4d-ca53-447c-8250-59a03a7ea4eb.avif"),
          alt: "Illustration of awards and regulator oversight",
          width: 900,
          height: 640,
        },
      },
      {
        title: "Segregated Accounts and Fast Withdrawals",
        body: "Fast and easy deposits and withdrawals, with client funds stored in segregated accounts.",
        variant: "wallet",
        image: {
          src: getCdnAssetUrl("6b4283d4-5ae9-43be-94dc-25c845136019.png"),
          alt: "Wallet illustration for client fund storage",
          width: 1000,
          height: 1000,
        },
      },
      {
        title: "International Standard Security System",
        body: "Trade more securely on a platform certified with ISO 27001.",
        variant: "lock",
        image: {
          src: getCdnAssetUrl("0be6b5d6-eeda-4236-92c9-a1e119e30523.png"),
          alt: "Padlock illustration for security system",
          width: 1000,
          height: 1000,
        },
      },
    ],
  },
  spread: {
    title: "Maximize Profit Potential with Competitive Spreads",
    subtitle:
      "Maximize your profit potential with low spreads and commission costs.",
    cta: "Start Trading Now",
    items: [
      {
        product: "EURUSD",
        spread: "Starting from 0.3",
        size: "Starting from 0.01",
        swap: "Available",
      },
      {
        product: "GBPUSD",
        spread: "Starting from 0.9",
        size: "Starting from 0.01",
        swap: "Available",
      },
      {
        product: "USDJPY",
        spread: "Starting from 0.9",
        size: "Starting from 0.01",
        swap: "Available",
      },
      {
        product: "Gold",
        spread: "Starting from $0.29",
        size: "Starting from 0.01",
        swap: "Available",
      },
      {
        product: "Nasdaq",
        spread: "Starting from 1.1",
        size: "Starting from 0.01",
        swap: "Available",
      },
    ],
    labels: {
      product: "Product",
      targetSpread: "Target Spread",
      transactionSize: "Transaction Size",
      freeSwap: "Free Swap",
    },
  },
  finalCta: {
    title: "Now Is the Time to Trade Forex with MIFX",
    subTitle: "Trade Forex with SG Mini",
    cta: "Start Forex Trading",
    companyTitle: "MIFX",
    companyItems: [
      "About",
      "Our Products",
      "Live Quote",
      "Download Platform",
      "Referral Program",
      "Blog",
    ],
    helpTitle: "Help",
    helpItems: [
      "Support Center",
      "Contact Us",
      "Complaints",
      "Fraud Alert",
      "Bug Bounty",
    ],
  },
  liveQuoteSection: {
    title: "Live Quote",
    subtitle:
      "Track market price movement in real time through the internal live quote API.",
    cta: "See More",
  },
  liveQuotePage: {
    breadcrumb: "Live Quote",
  },
  ebookPage: {
    title: "Trading Ebook",
    description:
      "A curated ebook page to help traders understand market basics, risk management, and structured trading plans.",
    breadcrumb: "Ebook",
    hero: {
      eyebrow: "Learning Library",
      title: "Concise trading ebooks that stay practical and easy to revisit.",
      description:
        "This page brings together reading materials for both beginners and active traders who want a more structured understanding of the market.",
      primaryCta: "Open Account",
      secondaryCta: "Client Login",
    },
    libraryTitle: "Featured Ebooks",
    librarySubtitle:
      "Each topic is arranged to support the learning process from core foundations to strategy and risk control.",
    items: [
      {
        title: "Forex Trading Fundamentals",
        description:
          "Understand currency pairs, market sessions, essential terms, and the transaction flow every new trader should know.",
        format: "PDF Guide",
        level: "Beginner",
        topics: ["Pairs & Pips", "Market Sessions", "Order Basics"],
      },
      {
        title: "Risk Management for Traders",
        description:
          "A practical guide to limiting downside, sizing positions, protecting risk-reward ratios, and improving discipline.",
        format: "Risk Manual",
        level: "Intermediate",
        topics: ["Risk Reward", "Lot Sizing", "Trading Discipline"],
      },
      {
        title: "Reading Market Direction with More Structure",
        description:
          "Build a cleaner analysis process using price levels, momentum, and scenario-based trade planning.",
        format: "Strategy Notes",
        level: "Intermediate",
        topics: ["Market Structure", "Momentum", "Trade Plan"],
      },
    ],
    benefitsTitle: "What You Get",
    benefits: [
      "More structured reading material for independent learning.",
      "Shorter explanations focused on what matters most for active traders.",
      "Core topics covering basics, risk, and trading plan development in one place.",
    ],
  },
  liveQuoteTable: {
    feedLabel: "Realtime Market Feed",
    empty: "Waiting for live quote data from the websocket.",
    firstTick: "Waiting for first tick",
    lastUpdated: "Last updated",
    fields: {
      symbol: "Symbol",
      price: "Price",
      sell: "Sell",
      buy: "Buy",
      open: "Open",
      high: "High",
      low: "Low",
      time: "Time",
      dateTime: "Date Time",
    },
    connectionStatus: {
      connecting: "Connecting",
      live: "Live",
      reconnecting: "Reconnecting",
      error: "Connection Error",
    },
    trend: {
      up: "Up",
      down: "Down",
      neutral: "Neutral",
    },
  },
  aboutPage: {
    hero: {
      eyebrow: "About Solid Gold Berjangka",
      title:
        "A futures brokerage firm with a clear legal foundation and a long operating track record in Indonesia.",
      description:
        "This profile summarizes who we are, the company's direction, key achievements, and the legal foundation behind PT. Solid Gold Berjangka's operations.",
      facts: {
        foundedLabel: "Founded",
        foundedValue: "2002",
        focusLabel: "Primary Focus",
        focusValue: "Futures Trading",
        operationsLabel: "Operations",
        operationsValue: "Jakarta, Semarang, Makassar",
      },
    },
    companyProfile: {
      eyebrow: "Company Profile",
      logoAlt: "PT. Solid Gold Berjangka",
      title: "PT. Solid Gold Berjangka",
      paragraphs: [
        "Established in 2002, PT Solid Gold Berjangka (SGB) is a futures brokerage company registered with and supervised by BAPPEBTI. With more than two decades of experience, SGB has become one of the key players in Indonesia's commodity futures trading industry.",
        "SGB is a member of the Jakarta Futures Exchange (JFX) and Kliring Berjangka Indonesia (Persero), while continuing to expand its services through operational offices in Jakarta, Semarang, and Makassar.",
      ],
    },
    visiMisi: {
      eyebrow: "Company Direction",
      missionTitle: "Company Mission",
      visionTitle: "Company Vision",
      missionItems: [
        "To become a futures brokerage company with an international scale",
        "To become a market leader, both regionally and internationally",
      ],
      visionItems: [
        "To develop and advance futures trading in Indonesia so it can contribute positively to the national economy from both micro and macro perspectives",
        "To empower futures trading in Indonesia and help all parties who need it to use it as a hedging instrument",
      ],
      summary:
        "Through this vision and mission, PT. Solid Gold Berjangka strives to help advance futures trading in Indonesia and create a positive impact on the national economy from both macro and micro perspectives.",
    },
    awards: {
      eyebrow: "Achievements",
      title: "Awards",
      description:
        "A selection of recognitions that reflect the company's consistency in trading activity and contribution to the industry.",
      items: [
        {
          title: "KBI Award 2014",
          subtitle: "2nd Best Clearing Member",
          imageSrc:
            "https://cdn.pandalingua.my.id/sgb/assets/a4690a59-8cb5-40d0-a2bf-8ce723f1f926.avif",
          imageAlt: "2nd Best Clearing Member Award 2014",
        },
        {
          title: "JFX Award 2011",
          subtitle: "Highest Bilateral Transaction Volume",
          imageSrc:
            "https://cdn.pandalingua.my.id/sgb/assets/bbe0962d-abab-4ba7-90fc-2ee7434d1fdf.avif",
          imageAlt:
            "Award for the 2nd Highest Bilateral Transaction Volume in 2011",
        },
      ],
    },
    regulation: {
      eyebrow: "Legality",
      title: "Registered, supervised, and connected with",
      highlightedTitle: "official Indonesian institutions",
      description:
        "PT. Solid Gold Berjangka operates on the basis of official licenses and memberships with relevant regulators, exchanges, and clearing institutions.",
    },
  },
  productPage: {
    breadcrumb: "Products",
    productsLabel: "Product Catalog",
    categoryLabel: "Exchange Category",
    countLabel: "Products",
    sourceLabel: "Source",
    viewDetailCta: "View Details",
    backToCatalogCta: "Back to Catalog",
    descriptionTitle: "Product Description",
    specificationTitle: "Product Specifications",
    emptyTitle: "No products are available yet.",
    emptyBody: "Please check back again shortly.",
    categories: {
      multilateral: {
        title: "Multilateral",
        description:
          "Official multilateral products listed from the Solid Gold product catalog.",
        eyebrow: "JFX Category",
        summary:
          "These multilateral products contain official contract specifications together with trading and delivery details for exchange-traded instruments.",
      },
      bilateral: {
        title: "Bilateral",
        description:
          "Official bilateral products listed from the Solid Gold product catalog.",
        eyebrow: "SPA Category",
        summary:
          "These bilateral products summarize trading specifications, margins, commissions, and transaction parameters for active bilateral instruments.",
      },
    },
  },
  economicCalendarPage: {
    title: "Economic Calendar",
    description:
      "Track major economic events for today, this week, next week, and the previous week in one economic calendar page.",
    breadcrumb: "Economic Calendar",
  },
  economicCalendarBrowser: {
    tabs: {
      today: "Today",
      thisWeek: "This Week",
      nextWeek: "Next Week",
      previousWeek: "Previous Week",
    },
    statusUnavailable: "Unavailable",
    time: "Time",
    country: "Country",
    impact: "Impact",
    event: "Event",
    previous: "Previous",
    forecast: "Forecast",
    actual: "Actual",
    source: "Source",
    measures: "Indicator",
    effect: "Usual Effect",
    frequency: "Frequency",
    nextRelease: "Next Release",
    notes: "Notes",
    whyCare: "Why It Matters",
    date: "Date",
    noHistory: "No history is available for this event yet.",
    empty: "No events are available for this calendar range.",
    unavailable: "This calendar range is currently unavailable from the API.",
    collapse: "Collapse",
    expand: "View details",
    today: "Today",
    previousPage: "Previous",
    nextPage: "Next",
    page: "Page",
    of: "of",
  },
  historicalDataPage: {
    title: "Historical Data",
    description:
      "Track multi-category market historical data for SG Mini price analysis.",
    breadcrumb: "Historical Data",
  },
  historicalDataBrowser: {
    records: "Records",
    categories: "Categories",
    latestDate: "Latest Date",
    empty: "No historical data is available for the selected filter.",
    date: "Date",
    category: "Category",
    open: "Open",
    high: "High",
    low: "Low",
    close: "Close",
    note: "Note",
    bankHoliday: "Bank Holiday",
    noNote: "-",
    previous: "Previous",
    next: "Next",
    page: "Page",
    of: "of",
    showing: "Showing",
    to: "to",
    ofRecords: "of",
  },
  newsPage: {
    breadcrumb: "News",
    listTitle: "Categories",
    allCategories: "All Categories",
    filter: "Filter",
    searchPlaceholder: "Search news...",
    emptyTitle: "No news available right now.",
    emptyBody: "Please check back shortly.",
    pagination: {
      previous: "Previous",
      next: "Next",
      summary: "Page",
    },
  },
  newsBrowser: {
    categories: {
      Index: "Index",
      Commodity: "Commodity",
      Currencies: "Currencies",
      "Global & Ekonomi": "Global & Economy",
      "Fiscal & Moneter": "Fiscal & Monetary",
      "Analisis Market": "Market Analysis",
    },
    filterModal: {
      title: "Filter News",
      subtitle: "Customize your news feed",
      sortBy: "Sort By",
      newest: "Newest",
      oldest: "Oldest",
      period: "Period",
      all: "All",
      today: "Today",
      week: "This Week",
      month: "This Month",
      apply: "Apply",
      reset: "Reset",
      close: "Close",
    },
    summary: {
      category: "category",
      available: "articles available",
      fallback: "Showing fallback news",
      articlesInCategory: "articles in",
    },
    pagination: {
      template: "Page {current} of {total}",
    },
    emptyFiltered: "Try a different keyword or category.",
    readArticle: "Read Article",
  },
  newsDetailPage: {
    news: "News",
    relatedNews: "Related News",
    latestNews: "Latest News",
    readTimeUnit: "min read",
  },
  fraudAlertPage: {
    title: "Fraud Alert",
    description:
      "A short guide to recognize fraud attempts using the Solid Gold Berjangka name and the safest verification steps to take.",
    breadcrumb: "Fraud Alert",
    hero: {
      eyebrow: "Client Safety",
      title: "Recognize fraud patterns before you respond.",
      description:
        "Use this page as a practical reminder to verify who is contacting you, which links are being shared, and whether any transaction instruction is actually legitimate.",
    },
    alertBoxTitle:
      "Do not immediately trust accounts, phone numbers, or links that have not been verified.",
    alertBoxBody:
      "Fraudsters often imitate company names, staff identities, and official-looking messages to push rushed decisions. Take time to inspect the details first.",
    redFlagsTitle: "Warning signs to watch for",
    redFlags: [
      "Requests to transfer funds to a personal bank account or to an account outside the official company name.",
      "Promises of guaranteed profit, instant bonuses, or risk-free trading results.",
      "Pressure to deposit immediately, share personal data, or click a link right away.",
      "Files, apps, or login links sent from unofficial domains or suspicious social media accounts.",
      "Staff identities that are inconsistent, hard to verify, or keep changing during the conversation.",
    ],
    verificationTitle: "Safe verification steps",
    verificationSteps: [
      "Recheck the website address, email domain, and social media account before following any instruction.",
      "Confirm phone numbers, account details, or promotional claims through official company channels you already know.",
      "Never share passwords, PINs, OTPs, verification codes, or device access with anyone else.",
      "Make sure payment instructions point only to official company accounts and never to personal accounts.",
      "If anything feels slightly unclear, stop the process and verify again first.",
    ],
    responseTitle: "If you have already been contacted or redirected",
    responseSteps: [
      "Stop the conversation and do not continue with transfers, logins, or additional document sharing.",
      "Save evidence such as chat screenshots, sender numbers, email addresses, links, and transfer receipts if any.",
      "Change relevant passwords immediately if you already shared login details or opened a suspicious link.",
      "Contact your bank or payment provider right away if any transaction has already happened.",
      "Report the incident through official support channels so it can be reviewed further.",
    ],
    reminderTitle: "Remember",
    reminderBody:
      "Official representatives should never ask for your password, PIN, OTP, or a transfer to a personal account.",
    primaryCta: "Back to Home",
    secondaryCta: "Learn About the Company",
  },
  contactPage: {
    title: "Contact Us",
    description:
      "PT. Solid Gold Berjangka contact page with a message form, head office map, and official customer support information.",
    breadcrumb: "Contact Us",
    breadcrumbs: {
      supportCenter: "Support Center",
    },
    hero: {
      eyebrow: "Official Contact",
      title: "CONTACT US",
      description:
        "PT. Solid Gold Berjangka offices are present in Jakarta and selected operating cities across Indonesia.",
    },
    form: {
      title: "Send Us a Message",
      description:
        "Fill in your details briefly. The submit button will open an email draft addressed to PT. Solid Gold Berjangka.",
      nameLabel: "Name",
      namePlaceholder: "Your full name",
      emailLabel: "Email",
      emailPlaceholder: "name@email.com",
      phoneLabel: "Phone Number",
      phonePlaceholder: "08xxxxxxxxxx",
      subjectLabel: "Subject",
      subjectPlaceholder: "Example: Account opening inquiry",
      messageLabel: "Message",
      messagePlaceholder:
        "Write your question, request, or issue in a concise way.",
      captchaLabel: "CAPTCHA",
      captchaAction: "Refresh",
      submit: "Send Message",
      helper:
        "For faster follow-up, you can also use the official customer support channels shown beside the form.",
      success:
        "Your email app is being opened with the prepared message details.",
    },
    headOffice: {
      title: "SGB Head Office",
      address:
        "TCC Batavia, Tower One Lt. 10, Jl. K.H. Mas Mansyur Kav. 126, Jakarta Pusat 10220",
      email: "berjangka@solidgold.co.id",
      phone: "021-29675088",
      phoneHref: "tel:02129675088",
      fax: "021-29675089",
      complaintPhone: "021-29675088 ext. 116",
      complaintPhoneHref: "tel:02129675088",
    },
    map: {
      title: "Head Office Map",
      description:
        "You can open the PT. Solid Gold Berjangka head office location directly through the map below.",
      iframeTitle: "PT. Solid Gold Berjangka head office map",
      directionsCta: "Open Directions",
      directionsUrl:
        "https://www.google.com/maps/search/?api=1&query=TCC%20Batavia%20Tower%20One%20Lt.%2010%20Jl.%20K.H.%20Mas%20Mansyur%20Kav.%20126%20Jakarta%20Pusat%2010220",
    },
    support: {
      title: "Customer Support",
      description:
        "Choose the right official contact channel for general questions, direct communication, or complaint handling.",
      hoursLabel: "Operating Hours",
      hoursValue: "Monday - Friday",
      callTitle: "Phone",
      callDescription: "Main phone line for the head office.",
      emailTitle: "Email",
      emailDescription: "Official email address for general inquiries.",
      complaintTitle: "Complaint Unit",
      complaintDescription: "Use extension 116 for complaint handling.",
      faxTitle: "Fax",
      faxDescription: "Official company fax line.",
    },
    offices: {
      title: "SGB Branch Offices",
      description:
        "PT. Solid Gold Berjangka operating locations shown using the company's official public contact information.",
      phoneLabel: "Phone",
      emailLabel: "Email",
      faxLabel: "Fax",
      items: [
        {
          name: "Jakarta Head Office",
          address:
            "TCC Batavia, Tower One Lt. 10, Jl. K.H. Mas Mansyur Kav. 126, Jakarta Pusat 10220",
          phone: "021-29675088",
          phoneHref: "tel:02129675088",
          email: "berjangka@solidgold.co.id",
          fax: "021-29675089",
        },
        {
          name: "Semarang Office",
          address:
            "Gedung Menara SUARA MERDEKA Lt. 3, Jl. Pandanaran No. 30 Semarang 50134",
          phone: "024-3583979, 024-3583980",
          phoneHref: "tel:0243583979",
        },
        {
          name: "Makassar Office",
          address:
            "Pettarani Business Center, Jl. AP. Pettarani Kav. E9, Kel. Tidung, Kec. Rappocini, Kota Makassar, Sulawesi Selatan 90222",
        },
      ],
    },
  },
  footer: {
    brandTitle: "SG Mini",
    brandItems: [
      { label: "About Us", href: "/about" },
      { label: "Ebook", href: "/ebook" },
      { label: "Live Quote", href: "/live-quote" },
      { label: "News", href: "/news" },
    ],
    helpTitle: "Help",
    helpItems: [
      { label: "Contact Us", href: "/contact-us" },
      { label: "Fraud Alert", href: "/fraud-alert" },
      { label: "Economic Calendar", href: "/economic-calendar" },
      { label: "Historical Data", href: "/historical-data" },
    ],
    legalItems: [
      "Commodity Futures Trading Regulatory Agency: Number 1156/BAPPEBTI/SI/3/2007",
      "Financial Services Authority: Number S-126/PM.02/2025",
      "Bank Indonesia: Number 27/663/DPPK/Srt/B",
      "Indonesian Commodity and Derivatives Exchange: Number S-373/PM.02/2025",
      "Jakarta Futures Exchange: Number SPAB-047/BBJ/07/02",
      "Indonesian Clearing House: Number 15/AK-KBI/V/2003",
    ],
    socials: [
      {
        name: "Instagram",
        url: "https://instagram.com/example",
        icon: "instagram",
      },
      {
        name: "Facebook",
        url: "https://facebook.com/example",
        icon: "facebook-f",
      },
      {
        name: "YouTube",
        url: "https://youtube.com/example",
        icon: "youtube",
      },
      {
        name: "TikTok",
        url: "https://tiktok.com/@example",
        icon: "tiktok",
      },
    ],
    copyrightProtected: "All rights reserved.",
    komdigiAlt: "Komdigi logo",
    tsiAlt: "TSI logo",
  },
  loadingOverlay: {
    title: "Loading Page",
    description: "Preparing content and assets...",
  },
};
