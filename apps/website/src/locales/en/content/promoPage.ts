import type { AppMessages } from "../../shared/messages";

export const enPromoPage: AppMessages["promoPage"] = {
  title: "Promo Page",
  description:
    "A collection of promos, banners, programs, and related supporting information.",
  breadcrumb: "Promo Page",
  hero: {
    eyebrow: "Important Information",
    title: "Promo Page",
    description:
      "Review the details for each promotional banner or information item published by PT. Solid Gold Berjangka.",
    primaryCta: "Browse the promo list",
  },
  list: {
    title: "Promo list",
    description:
      "Choose a banner to view its available promo details and supporting information.",
    readMore: "Read details",
    emptyTitle: "No information available yet",
    emptyBody: "There are currently no active promo banners available.",
    untitledFallback: "Untitled promo",
  },
};
