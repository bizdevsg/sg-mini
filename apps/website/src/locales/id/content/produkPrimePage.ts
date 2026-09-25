import type { AppMessages } from "../../shared/messages";

export const idProdukPrimePage: AppMessages["produkPrimePage"] = {
  title: "Akun Prime",
  description:
    "Akun Prime Solid Gold Berjangka untuk nasabah yang menginginkan pengalaman transaksi dengan pendampingan yang lebih personal.",
  breadcrumb: "Akun Prime",
  hero: {
    eyebrow: "Akun Prime",
    title: "Pendampingan Transaksi yang Lebih Personal",
    description:
      "Akun Prime dirancang untuk nasabah yang ingin berdiskusi lebih mendalam mengenai kebutuhan transaksi berjangka bersama tim Solid Gold Berjangka.",
    primaryCta: "Buka Akun Sekarang",
    secondaryCta: "Hubungi Kami",
    badges: [
      "Setara Mini Account",
      "Minimum 0,1 Lot",
      "Pendampingan Lebih Personal",
    ],
  },
  benefitsTitle: "Mengenal Akun Prime",
  benefitsDescription:
    "Akun Prime adalah nama layanan kami untuk Mini Account — cocok bagi nasabah yang ingin mulai bertransaksi berjangka dengan modal dan volume yang lebih kecil, didampingi tim Solid Gold Berjangka.",
  benefits: [
    {
      title: "Modal Awal Terjangkau",
      description:
        "Deposit margin awal mulai dari USD 500 dengan fixed rate USD 1 = IDR 10.000, sesuai ketentuan Mini Account CDD Sederhana.",
    },
    {
      title: "Posisi 0,1–0,9 Lot",
      description:
        "Volume transaksi berkisar minimum 0,1 lot hingga maksimum 0,9 lot selama posisi berjalan, mengikuti Trading Rules Mini Account yang berlaku.",
    },
    {
      title: "Kontrak Emas & Brent Crude Oil",
      description:
        "Tersedia kontrak XUL10 (Emas Loco London) dan BCO10_BBJ (Brent Crude Oil) dengan proses CDD Sederhana bagi nasabah perseorangan.",
    },
  ],
  specsLink: {
    label: "Lihat Trading Rules Mini Account",
    href: "/education/trading-rules",
  },
  tradingTable: {
    title: "Trading Table Akun Prime",
    description:
      "Spesifikasi kontrak yang tersedia untuk nasabah Akun Prime (Mini Account CDD Sederhana 0,1 Lot). Spesifikasi dapat berubah sesuai Trade Table resmi yang berlaku.",
    headers: {
      specification: "Spesifikasi",
      xul10: "XUL10 (Fixed Rate)",
      bco10: "BCO10_BBJ (Fixed Rate)",
    },
    rows: [
      { label: "Ukuran Kontrak", xul10: "10 Troy Ounce", bco10: "100 Barrel" },
      { label: "Hari Perdagangan", xul10: "Senin–Jumat", bco10: "Senin–Jumat" },
      {
        label: "Jam Perdagangan (Summer)",
        xul10: "06.00–03.30 WIB",
        bco10: "07.00–03.45 WIB",
      },
      {
        label: "Jam Perdagangan (Winter)",
        xul10: "06.00–04.30 WIB",
        bco10: "08.00–03.45 WIB",
      },
      {
        label: "Initial Margin (Day Trade)",
        xul10: "USD 100/lot",
        bco10: "USD 100/lot",
      },
      {
        label: "Facility Fee",
        xul10: "USD 1,5/lot/side",
        bco10: "USD 1,5/lot/side",
      },
      {
        label: "V.A.T (Facility Fee)",
        xul10: "11% dari Facility Fee",
        bco10: "11% dari Facility Fee",
      },
      {
        label: "Rollover Facility – Sell",
        xul10: "USD 0,5/lot/night",
        bco10: "USD 0,5/lot/night",
      },
      {
        label: "Rollover Facility – Buy",
        xul10: "USD 0,5/lot/night",
        bco10: "USD 0,5/lot/night",
      },
      {
        label: "V.A.T (Rollover Facility)",
        xul10: "11% dari Rollover Facility",
        bco10: "11% dari Rollover Facility",
      },
      { label: "Price Source", xul10: "Telequote", bco10: "Telequote" },
      { label: "Price Guidance", xul10: "Last Trade", bco10: "Last Trade" },
      {
        label: "Minimum Price Spread Quote",
        xul10: "USD 0,40/Troy Ounce/Side",
        bco10: "USD 0,10/pips/barrel/side",
      },
      {
        label: "Maximum Price Spread Quote",
        xul10: "USD 1,00/Troy Ounce/Side",
        bco10: "USD 0,30/pips/barrel/side",
      },
      {
        label: "Hectic Price Spread Quote",
        xul10: "Base On Market",
        bco10: "Base On Market",
      },
      {
        label: "Minimum Price Movement",
        xul10: "USD 0,01/Troy Ounce",
        bco10: "USD 0,01/barrel",
      },
      {
        label: "Range untuk Limit & Stop Order",
        xul10: "USD 6 – USD 20",
        bco10: "USD 1 – USD 20",
      },
      {
        label: "Hectic Range Price untuk Limit & Stop Order",
        xul10: "Base On Market",
        bco10: "Base On Market",
      },
      {
        label: "Delivery By",
        xul10: "Cash Settlement",
        bco10: "Cash Settlement",
      },
    ],
  },
  cta: {
    title: "Tertarik dengan Akun Prime?",
    description:
      "Hubungi tim kami untuk mendapatkan penjelasan mengenai Akun Prime dan proses pembukaan akun.",
    buttonLabel: "Daftar Sekarang",
  },
};
