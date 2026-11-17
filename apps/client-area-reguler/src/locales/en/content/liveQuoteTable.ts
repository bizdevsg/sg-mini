import type { AppMessages } from "../../shared/messages";

export const enLiveQuoteTable: AppMessages["liveQuoteTable"] = {
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
  };
