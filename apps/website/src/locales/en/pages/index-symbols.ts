import type { IndexSymbolsPageContent } from "../../shared/index-symbols-page";

export const enIndexSymbolsPageContent: IndexSymbolsPageContent = {
  meta: {
    title: "Index Symbols",
    description:
      "A reference page for index symbols, contract month symbols, and contract code examples to help interpret spot and futures index instruments.",
  },
  breadcrumb: {
    education: "Education",
    current: "Index Symbols",
  },
  hero: {
    eyebrow: "Trading Education",
    title: "Index Symbols",
    description:
      "This page summarizes spot and futures index symbols, contract month codes, and example contract breakdowns in a clearer format.",
    primaryCta: "View Symbols",
    secondaryCta: "View Contracts",
    badges: [
      "Index Symbol Reference",
      "Contract Month Codes",
      "Contract Code Examples",
    ],
  },
  sections: {
    symbolsTitle: "1 Index Symbols",
    symbolsSubtitle:
      "The list below summarizes commonly used spot and futures index symbol codes.",
    contractMonthsTitle: "2 Contract Month Symbols",
    contractMonthsSubtitle:
      "Each futures instrument uses its own contract month code set. Use this reference to read symbols correctly.",
    contractExampleTitle: "Contract Example",
    contractExampleSubtitle:
      "The example below breaks a contract code into smaller parts so it is easier to understand.",
  },
  symbols: [
    { code: "HSIV9", description: "Hang Seng Index (Futures) for the October 2009 contract" },
    { code: "HSI", description: "Hang Seng Index (Spot)" },
    { code: "SN1Z9", description: "Nikkei 225 Index (Futures) for the December 2009 contract" },
    { code: "SNI", description: "Nikkei 225 Index (Spot)" },
    { code: "JKSCI", description: "Jakarta Composite Index (Spot)" },
    { code: "SISE4", description: "Straits Times Index (Spot)" },
    { code: "KCOM", description: "Kuala Lumpur Composite Index (Spot)" },
    { code: "SHICOM", description: "Shanghai Composite Index (Spot)" },
    { code: "SZICOM", description: "Shenzhen Composite Index (Spot)" },
    { code: "TOPX", description: "Tokyo Stock Price Index (Spot)" },
    { code: "BSET", description: "Bangkok Stock Price Index (Spot)" },
    { code: "KSCI", description: "Korea Stock Composite Index (Spot)" },
    { code: "DJIA", description: "Dow Jones Industrial Average (Spot)" },
    { code: "NDX", description: "Nasdaq 100 Index (Spot)" },
    { code: "NDXI", description: "Nasdaq Composite Index (Spot)" },
    { code: "SPX", description: "Standard & Poor's 500 Index (Spot)" },
    { code: "FTSE", description: "Financial Times Stock Exchange (Spot)" },
    { code: "DAX", description: "Deutscher Aktien Index / German Stock Index (Spot)" },
    { code: "NYSEI", description: "New York Stock Index (Spot)" },
    { code: "LGD", description: "Loco Gold London (Spot)" },
  ],
  contractMonths: [
    {
      title: "Hang Seng Futures",
      items: [
        { code: "F", month: "January" },
        { code: "G", month: "February" },
        { code: "H", month: "March" },
        { code: "J", month: "April" },
        { code: "K", month: "May" },
        { code: "M", month: "June" },
        { code: "N", month: "July" },
        { code: "Q", month: "August" },
        { code: "U", month: "September" },
        { code: "V", month: "October" },
        { code: "X", month: "November" },
        { code: "Z", month: "December" },
      ],
    },
    {
      title: "Nikkei 225 Futures",
      items: [
        { code: "H", month: "March" },
        { code: "M", month: "June" },
        { code: "U", month: "September" },
        { code: "Z", month: "December" },
      ],
    },
    {
      title: "Brent Crude Oil Futures",
      items: [
        { code: "F", month: "January" },
        { code: "G", month: "February" },
        { code: "H", month: "March" },
        { code: "J", month: "April" },
        { code: "K", month: "May" },
        { code: "M", month: "June" },
        { code: "N", month: "July" },
        { code: "Q", month: "August" },
        { code: "U", month: "September" },
        { code: "V", month: "October" },
        { code: "X", month: "November" },
        { code: "Z", month: "December" },
      ],
    },
  ],
  contractExample: [
    { code: "LCOPZ9", description: "Brent Crude Oil Contract" },
    { code: "LCOP", description: "Brent Crude Oil Code" },
    { code: "Z", description: "Futures contract for 2 months ahead" },
    { code: "9", description: "Year" },
  ],
};
