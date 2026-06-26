import type { AppMessages } from "../../shared/messages";

export const enClientArea: AppMessages["clientArea"] = {
  pageTitle: "Client Area",
  pageDescription:
    "A post-login home view with account summary, quick actions, and product signals.",
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
        id: "services",
        label: "More",
        href: "#services",
      },
    ],
  },
  topbar: {
    supportLabel: "Download MIFX App",
    supportPhone: "021-50996650",
    logoutLabel: "Log Out",
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
        id: "deposit",
        label: "Deposit",
      },
      {
        id: "withdraw",
        label: "Withdraw",
      },
      {
        id: "overbook",
        label: "Overbook",
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
    title: "Popular Product Signals",
    cta: "See All",
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
        description: "Track real-time prices to prepare faster entry decisions.",
        cta: "Open market feed",
      },
      {
        label: "Economic Calendar",
        description: "Review high-impact events that may affect daily volatility.",
        cta: "View schedule",
      },
      {
        label: "Client Service Help",
        description: "Contact support for login, transaction, or verification issues.",
        cta: "Contact support",
      },
    ],
  },
};
