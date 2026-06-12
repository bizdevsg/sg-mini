import type { AppMessages } from "../../shared/messages";

export const idLiveQuoteTable: AppMessages["liveQuoteTable"] = {
    feedLabel: "Realtime Market Feed",
    empty: "Menunggu data live quote masuk dari websocket.",
    firstTick: "Menunggu tick pertama",
    lastUpdated: "Pembaruan terakhir",
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
      up: "Naik",
      down: "Turun",
      neutral: "Stabil",
    },
  };
