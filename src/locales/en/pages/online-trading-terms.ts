import type { OnlineTradingTermsPageContent } from "../../shared/online-trading-terms-page";

export const enOnlineTradingTermsPageContent: OnlineTradingTermsPageContent = {
  meta: {
    title: "Online Trading Terms",
    description:
      "A practical guide to core online trading terms such as market order, limit order, stop order, OCO, and GTC.",
  },
  breadcrumb: {
    education: "Education",
    current: "Online Trading Terms",
  },
  hero: {
    eyebrow: "Trading Education",
    title: "Online Trading Terms",
    description:
      "This page summarizes the core terms commonly used when placing orders, managing risk, and handling open positions in online trading.",
    primaryCta: "Read Terms",
    badges: [
      "Structured Learning Format",
      "Core Trading Terms",
      "Easy To Revisit",
    ],
  },
  sections: {
    articleTitle: "Online Trading Terms",
    articleSubtitle:
      "Study each key term in a clearer sequence inspired by the ebook-style education layout.",
  },
  terms: [
    {
      title: "Market Order",
      paragraphs: [
        "A market order is an instruction to buy or sell that should be executed immediately at the best available market price.",
        "It can be used either to open a new position or to liquidate an existing one.",
      ],
    },
    {
      title: "Limit Order",
      paragraphs: [
        "A limit order is an order placed with a defined maximum or minimum price level chosen by the user.",
        "It can be used to open a new position or to liquidate an existing position.",
      ],
    },
    {
      title: "Stop Order",
      paragraphs: [
        "A stop order, often called a stop loss order, is used when price moves above or below a predefined stop price.",
        "Once the stop price is reached, the order becomes a market order and is typically used to limit losses, reduce risk, or protect profits on an open position.",
        "Stop orders also appear in several common variations used to align execution with the direction of an open or planned position.",
      ],
      highlight:
        "In fast-moving conditions, the execution price of a stop order may differ from the original stop price.",
      subsections: [
        {
          title: "Sell Stop Order",
          paragraphs: [
            "A sell stop order is an instruction to sell at the best available price once market price falls below a selected stop price.",
            "It is generally placed below the current market price to help limit losses or protect an existing buy position.",
          ],
        },
        {
          title: "Buy Stop Order",
          paragraphs: [
            "A buy stop order is an instruction to buy at the best available price once market price rises above a selected stop price.",
            "It is commonly used to limit losses on an existing sell position.",
          ],
        },
        {
          title: "Stop Limit Order",
          paragraphs: [
            "A stop limit order is a combination of a stop order and a limit order.",
            "Once the stop price is reached, it becomes a buy or sell limit order at a price boundary defined by the user.",
            "It can be effective for initiating a new position, but it is not always the best protective tool, especially in thin or less active markets.",
          ],
        },
      ],
    },
    {
      title: "One Cancels the Other (OCO)",
      paragraphs: [
        "OCO refers to placing two orders at two different limit prices at the same time.",
        "If one order is executed, the other order is automatically canceled.",
      ],
    },
    {
      title: "Good Till Cancel (GTC)",
      paragraphs: [
        "GTC describes a limit order validity period that remains active until the next day as long as the order has not been executed.",
        "If the order is still pending, the user can still cancel it.",
      ],
    },
  ],
};
