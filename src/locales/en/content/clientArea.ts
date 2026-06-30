import type { AppMessages } from "../../shared/messages";

export const enClientArea: AppMessages["clientArea"] = {
  pageTitle: "Client Area",
  pageDescription:
    "A post-login home view with account summary, quick actions, and product signals.",
  login: {
    badge: "Client Portal",
    title: "Sign in Client Area",
    description:
      "Access your demo or live account to monitor balances, market watchlists, and transaction activity from one dashboard.",
    accountLabel: "Account number or email",
    accountPlaceholder: "Enter your account number or email",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    rememberMe: "Remember me on this device",
    forgotPassword: "Forgot password?",
    primaryCta: "Enter demo dashboard",
    secondaryCta: "Contact support",
    submitting: "Verifying access...",
    helper:
      "Use the demo credentials below to sign in to this preview client area.",
    captchaTitle: "Security verification",
    captchaHelper:
      "Complete the reCAPTCHA challenge before entering the client area.",
    demoCredentialsTitle: "Quick demo access",
    demoCredentialsAccount: "Demo account: BBH10158",
    demoCredentialsPassword: "Password: demo12345",
    errorRequired:
      "Enter your account number or email together with your password.",
    errorInvalidCredentials:
      "The account number, email, or password you entered is incorrect. Please review your details and try again.",
    errorCaptchaRequired: "Complete the reCAPTCHA verification first.",
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
        id: "account",
        label: "Account",
        href: "#account",
      },
    ],
  },
  topbar: {
    supportLabel: "Download MIFX App",
    supportPhone: "021-50996650",
    logoutLabel: "LogOut",
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
        label: "Education",
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
        label: "Temporary",
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
};
