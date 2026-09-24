import type { LocoLondonGoldPageContent } from "../../shared/loco-london-gold-page";

export const enLocoLondonGoldPageContent: LocoLondonGoldPageContent = {
  meta: {
    title: "Loco London Gold",
    description:
      "Educational material about Loco London Gold covering the London gold market, OTC characteristics, major gold trading centers, price drivers, and derivative contract basics.",
  },
  breadcrumb: {
    education: "Education",
    current: "Loco London Gold",
  },
  hero: {
    eyebrow: "Trading Education",
    title: "Loco London Gold",
    description:
      "Learn the foundations of Loco London Gold, how the OTC spot gold market works, the main gold trading centers, and the macro factors that most often move gold prices.",
    badges: [
      "Gold Market Basics",
      "OTC Market Structure",
      "Gold Price Drivers",
    ],
  },
  sections: {
    historyTitle: "1 Loco London Gold Basics and History",
    historySubtitle:
      "This section summarizes the meaning of Loco London, why London became a key gold reference point, and how spot OTC gold trading works.",
    marketTitle: "2 Major Global Gold Markets",
    marketSubtitle:
      "Beyond London, the global gold market is also shaped by activity in the United States and Hong Kong.",
    analysisTitle: "3 What Moves Gold Prices",
    analysisSubtitle:
      "Gold does not move only on supply and demand. Macro conditions and global sentiment also matter.",
    derivativeTitle: "4 Derivative Contract Overview",
    derivativeSubtitle:
      "Loco London Gold is also introduced as part of margin-based derivative trading material within an alternative trading framework.",
  },
  history: [
    {
      title: "What is Loco London Gold?",
      paragraphs: [
        "In commodity market terminology, loco refers to the settlement location. Loco London Gold therefore points to gold trading with London as the settlement basis.",
        "Gold is widely viewed as a hedge and safe haven asset, especially during economic stress, political uncertainty, social disruption, or currency weakness.",
        "As physical gold demand rises while supply remains limited, margin-based derivative products became an alternative way to gain exposure to gold price movements.",
      ],
      highlight:
        "Margin trading allows market participants to take a view on gold prices without holding physical gold in each transaction.",
      subsections: [
        {
          title: "Why London matters",
          paragraphs: [
            "London became a dominant gold dealing and settlement center because of its historical role in global finance, especially during the gold standard era and the expansion of British capital markets.",
            "Zurich is also important in physical gold trading, but London remains one of the best-known reference points in educational market material.",
          ],
        },
        {
          title: "OTC market characteristics",
          paragraphs: [
            "The London gold market is over-the-counter, meaning transactions occur directly between counterparties rather than through a centralized exchange book.",
            "Bid and ask prices can circulate almost continuously through dealing networks and global financial information systems.",
          ],
        },
      ],
    },
    {
      title: "Why is spot OTC gold attractive?",
      paragraphs: [
        "Gold is commonly quoted in US dollars per troy ounce, which makes it easy to compare across global trading hubs.",
        "The market can be used for hedging, investing, and speculation, while allowing positions to be held without the fixed expiry profile of certain futures contracts.",
        "Margin-based leverage and portfolio diversification are key reasons Loco London Gold is frequently introduced in trading education.",
      ],
    },
  ],
  markets: [
    {
      title: "Loco London Gold Market",
      paragraphs: [
        "The London market is a historic benchmark for international spot gold and silver trading through the bullion market network.",
        "In the source material, London price setting is described as an important reference for global participants.",
      ],
      details: [
        "Core international spot OTC reference",
        "Prices flow for nearly 24 hours",
        "Historically important in price formation",
      ],
    },
    {
      title: "US Gold Market",
      paragraphs: [
        "The US market, especially New York through COMEX, is known for its strong role in gold forward and futures trading.",
        "Its liquidity, trading methods, and depth of participation make it highly influential in modern price discovery.",
      ],
      details: [
        "Strong in futures and forwards",
        "High liquidity",
        "Major role in price discovery",
      ],
    },
    {
      title: "Hong Kong Gold Market",
      paragraphs: [
        "Hong Kong is recognized as one of Asia's gold hubs and is often linked to Loco London quotations in US dollars per troy ounce for London delivery.",
        "It is important as a regional bridge between Asian trading activity and global gold pricing.",
      ],
      details: [
        "Asian gold trading hub",
        "Connected to global quotations",
        "Active in regional hedging flows",
      ],
    },
  ],
  analysis: [
    {
      title: "US dollar moves",
      description:
        "A weaker US dollar often supports gold because investors look for assets that can better preserve value.",
    },
    {
      title: "Global political conditions",
      description:
        "Geopolitical tension often shifts investor demand from risk assets toward safe haven assets such as gold.",
    },
    {
      title: "Supply and demand",
      description:
        "Mine production, forward selling, reserve policy, and physical demand all shape the balance of the gold market.",
    },
    {
      title: "Global economic conditions",
      description:
        "Economic cycles, inflation, and industrial or jewelry demand influence how much appetite there is for gold.",
    },
    {
      title: "Interest rates",
      description:
        "Higher interest rates can reduce the appeal of non-yielding gold, although that relationship may break down during currency stress.",
    },
  ],
  derivative: {
    paragraphs: [
      "The source material presents Loco London Gold derivatives as part of an alternative trading system focused on margin-based transactions.",
      "In practice, the instrument is introduced as a way to hedge, invest, or speculate on gold price movement without taking physical delivery on every trade.",
    ],
    points: [
      {
        label: "Underlying",
        value: "Loco London / international spot gold reference price",
      },
      {
        label: "Trading model",
        value: "Margin-based derivative trading",
      },
      {
        label: "Common use",
        value: "Hedging, diversification, and price speculation",
      },
      {
        label: "Note",
        value: "Always confirm the latest contract specification and regulatory documents before trading.",
      },
    ],
    note:
      "This page is a structured rewrite of the educational source. Treat it as introductory material and rely on current official documents for regulation, trading hours, and contract specifications.",
  },
};
