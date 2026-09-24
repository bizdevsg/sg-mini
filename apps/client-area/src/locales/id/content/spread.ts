import type { AppMessages } from "../../shared/messages";

export const idSpread: AppMessages["spread"] = {
    title: "Maksimalkan Potensi Profit Dengan Spread Kompetitif",
    subtitle:
      "Maksimalkan potensi profit dengan spread dan biaya komisi yang rendah.",
    cta: "Mulai Trading Sekarang",
    items: [
      {
        product: "EURUSD",
        spread: "Mulai dari 0.3",
        size: "Mulai dari 0.01",
        swap: "Tersedia",
      },
      {
        product: "GBPUSD",
        spread: "Mulai dari 0.9",
        size: "Mulai dari 0.01",
        swap: "Tersedia",
      },
      {
        product: "USDJPY",
        spread: "Mulai dari 0.9",
        size: "Mulai dari 0.01",
        swap: "Tersedia",
      },
      {
        product: "Gold",
        spread: "Mulai dari $0.29",
        size: "Mulai dari 0.01",
        swap: "Tersedia",
      },
      {
        product: "Nasdaq",
        spread: "Mulai dari 1.1",
        size: "Mulai dari 0.01",
        swap: "Tersedia",
      },
    ],
    labels: {
      product: "Produk",
      targetSpread: "Target Spread",
      transactionSize: "Ukuran Transaksi",
      freeSwap: "Free Swap",
    },
  };
