import type { AppMessages } from "../../shared/messages";

export const enLiveQuotePage: AppMessages["liveQuotePage"] = {
  breadcrumb: "Live Quote",
  exchangeRate: {
    eyebrow: "Market Reference",
    title: "Exchange Rate",
    amountLabel: "Amount",
    fromLabel: "From",
    toLabel: "To",
    searchCurrencyPlaceholder: "Search currency",
    noCurrencyFound: "No currency found.",
    matrixToggleLabel: "Currency Table",
    calculatorToggleLabel: "Calculator",
    matrixTitle: "Cross-Tabulation Matrix",
    matrixBaseLabel: "Active base",
    matrixUnitLabel: "1 unit basis",
    outputLabel: "Output",
    swapLabel: "Swap currencies",
    updatedLabel: "Updated",
    unavailable: "Exchange rate data is temporarily unavailable.",
  },
};
