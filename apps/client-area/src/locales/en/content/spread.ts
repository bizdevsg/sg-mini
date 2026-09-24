import type { AppMessages } from "../../shared/messages";

export const enSpread: AppMessages["spread"] = {
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
  };
