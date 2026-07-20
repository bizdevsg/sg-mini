import type { AppMessages } from "../../shared/messages";

export const enFooter: AppMessages["footer"] = {
  companyName: "PT. Solid Gold Berjangka",
  logoAlt: "Solid Gold Berjangka logo",
  investmentWarning:
    "PT Solid Gold Berjangka urges the public to stay alert against investment scams. All transaction fund transfers must only be made to official Segregated Accounts under PT Solid Gold Berjangka.",
  disclaimerLabel: "Disclaimer:",
  disclaimerBody:
    "Futures trading carries high risk and requires adequate understanding before placing transactions. The information on this website is for education and reference only, not an invitation or guarantee of profit. Every transaction decision remains fully the client's responsibility.",
  brandTitle: "Menu",
  brandItems: [
    { label: "About Us", href: "/about" },
    { label: "Ebook", href: "/education/ebook" },
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
      name: "Twitter",
      url: "https://youtube.com/example",
      icon: "x-twitter",
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
  faqItem: {
    label: "FAQ",
    href: "/faq",
  },
};
