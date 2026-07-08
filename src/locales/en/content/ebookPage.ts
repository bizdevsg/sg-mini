import type { AppMessages } from "../../shared/messages";

export const enEbookPage: AppMessages["ebookPage"] = {
  title: "Forex Trading Ebooks",
  description:
    "A curated ebook page to help traders understand market basics, risk management, and structured trading plans.",
  breadcrumb: "Ebook",
  parentLabel: "Education",
  detailCta: "View Category",
  previewCta: "View Detail",
  downloadCta: "Open Ebook",
  backToCategoriesCta: "Back to categories",
  closeCta: "Close",
  hero: {
    eyebrow: "Learning Library",
    title: "Concise trading ebooks that stay practical and easy to revisit.",
    description:
      "This page brings together reading materials for both beginners and active traders who want a more structured understanding of the market.",
    primaryCta: "Open Account",
    secondaryCta: "Client Login",
  },
  libraryTitle: "Ebook Categories",
  librarySubtitle:
    "Choose the most relevant category first, then open the ebooks inside it directly from the API library.",
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
};
