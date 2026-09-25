import type { AppMessages } from "../../shared/messages";

export const enProdukPrimePage: AppMessages["produkPrimePage"] = {
  title: "Prime Account",
  description:
    "Solid Gold Berjangka's Prime Account for clients seeking a more personal, guided trading experience.",
  breadcrumb: "Prime Account",
  hero: {
    eyebrow: "Prime Account",
    title: "A More Personal Trading Experience",
    description:
      "The Prime Account is designed for clients who want to discuss their futures trading needs in greater depth with the Solid Gold Berjangka team.",
    primaryCta: "Open an Account Now",
    secondaryCta: "Contact Us",
    badges: [
      "Equivalent to a Mini Account",
      "Minimum 0.1 Lot",
      "More Personal Guidance",
    ],
  },
  benefitsTitle: "About the Prime Account",
  benefitsDescription:
    "The Prime Account is our name for the Mini Account — ideal for clients who want to start futures trading with smaller capital and volume, guided by the Solid Gold Berjangka team.",
  benefits: [
    {
      title: "Accessible Starting Capital",
      description:
        "Initial margin deposit starts from USD 500 at a fixed rate of USD 1 = IDR 10,000, per the Mini Account Simplified CDD terms.",
    },
    {
      title: "0.1–0.9 Lot Position Size",
      description:
        "Trading volume ranges from a minimum of 0.1 lot up to a maximum of 0.9 lot while a position is open, following the applicable Mini Account Trading Rules.",
    },
    {
      title: "Gold & Brent Crude Oil Contracts",
      description:
        "Available contracts include XUL10 (Loco London Gold) and BCO10_BBJ (Brent Crude Oil), with a Simplified CDD process for individual clients.",
    },
  ],
  specsLink: {
    label: "View Mini Account Trading Rules",
    href: "/education/trading-rules",
  },
  tradingTable: {
    title: "Prime Account Trading Table",
    description:
      "Contract specifications available to Prime Account (Mini Account CDD Simplified 0.1 Lot) clients. Specifications may change according to the official applicable Trade Table.",
    headers: {
      specification: "Specification",
      xul10: "XUL10 (Fixed Rate)",
      bco10: "BCO10_BBJ (Fixed Rate)",
    },
    rows: [
      { label: "Contract Size", xul10: "10 Troy Ounce", bco10: "100 Barrel" },
      {
        label: "Trading Day",
        xul10: "Monday – Friday",
        bco10: "Monday – Friday",
      },
      {
        label: "Trading Hours (Summer)",
        xul10: "06:00–03:30 WIB",
        bco10: "07:00–03:45 WIB",
      },
      {
        label: "Trading Hours (Winter)",
        xul10: "06:00–04:30 WIB",
        bco10: "08:00–03:45 WIB",
      },
      {
        label: "Initial Margin (Day Trade)",
        xul10: "USD 100/lot",
        bco10: "USD 100/lot",
      },
      {
        label: "Facility Fee",
        xul10: "USD 1.5/lot/side",
        bco10: "USD 1.5/lot/side",
      },
      {
        label: "V.A.T (Facility Fee)",
        xul10: "11% of Facility Fee",
        bco10: "11% of Facility Fee",
      },
      {
        label: "Rollover Facility – Sell",
        xul10: "USD 0.5/lot/night",
        bco10: "USD 0.5/lot/night",
      },
      {
        label: "Rollover Facility – Buy",
        xul10: "USD 0.5/lot/night",
        bco10: "USD 0.5/lot/night",
      },
      {
        label: "V.A.T (Rollover Facility)",
        xul10: "11% of Rollover Facility",
        bco10: "11% of Rollover Facility",
      },
      { label: "Price Source", xul10: "Telequote", bco10: "Telequote" },
      { label: "Price Guidance", xul10: "Last Trade", bco10: "Last Trade" },
      {
        label: "Minimum Price Spread Quote",
        xul10: "USD 0.40/Troy Ounce/Side",
        bco10: "USD 0.10/pips/barrel/side",
      },
      {
        label: "Maximum Price Spread Quote",
        xul10: "USD 1.00/Troy Ounce/Side",
        bco10: "USD 0.30/pips/barrel/side",
      },
      {
        label: "Hectic Price Spread Quote",
        xul10: "Base On Market",
        bco10: "Base On Market",
      },
      {
        label: "Minimum Price Movement",
        xul10: "USD 0.01/Troy Ounce",
        bco10: "USD 0.01/barrel",
      },
      {
        label: "Range for Limit & Stop Order",
        xul10: "USD 6 – USD 20",
        bco10: "USD 1 – USD 20",
      },
      {
        label: "Hectic Range Price for Limit & Stop Order",
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
    title: "Interested in a Prime Account?",
    description:
      "Contact our team to learn more about the Prime Account and its account-opening process.",
    buttonLabel: "Register Now",
  },
};
