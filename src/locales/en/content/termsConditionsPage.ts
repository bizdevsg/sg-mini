import type { AppMessages } from "../../shared/messages";

export const enTermsConditionsPage: AppMessages["termsConditionsPage"] = {
  title: "Terms and Conditions",
  description:
    "A collection of terms and conditions for promotional banners, programs, and related supporting information.",
  breadcrumb: "Terms and Conditions",
  hero: {
    eyebrow: "Important Information",
    title: "Terms and Conditions Page",
    description:
      "Review the detailed terms and conditions for each banner, promotion, or information item published by PT. Solid Gold Berjangka.",
    primaryCta: "Browse the information list",
  },
  list: {
    title: "Information list",
    description:
      "Choose a banner to view its available terms, conditions, and supporting details.",
    readMore: "Read details",
    emptyTitle: "No information available yet",
    emptyBody:
      "There are currently no active banners with an available terms and conditions page.",
    untitledFallback: "Untitled information",
  },
};
