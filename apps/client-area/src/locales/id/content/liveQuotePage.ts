import type { AppMessages } from "../../shared/messages";

export const idLiveQuotePage: AppMessages["liveQuotePage"] = {
  breadcrumb: "Live Quote",
  exchangeRate: {
    eyebrow: "Market Reference",
    title: "Exchange Rate",
    amountLabel: "Jumlah",
    fromLabel: "Dari",
    toLabel: "Ke",
    searchCurrencyPlaceholder: "Cari mata uang",
    noCurrencyFound: "Mata uang tidak ditemukan.",
    matrixToggleLabel: "Tabel Mata Uang",
    calculatorToggleLabel: "Kalkulator",
    matrixTitle: "Cross-Tabulation Matrix",
    matrixBaseLabel: "Base aktif",
    matrixUnitLabel: "Basis per 1 unit",
    outputLabel: "Hasil",
    swapLabel: "Tukar mata uang",
    updatedLabel: "Diperbarui",
    unavailable: "Data exchange rate sementara belum tersedia.",
  },
};
