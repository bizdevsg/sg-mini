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
    badges: ["Equivalent to a Mini Account", "Minimum 0.1 Lot", "More Personal Guidance"],
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
  cta: {
    title: "Interested in a Prime Account?",
    description:
      "Contact our team to learn more about the Prime Account and its account-opening process.",
    buttonLabel: "Register Now",
  },
};
