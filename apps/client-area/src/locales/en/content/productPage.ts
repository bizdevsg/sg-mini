import type { AppMessages } from "../../shared/messages";

export const enProductPage: AppMessages["productPage"] = {
    breadcrumb: "Products",
    productsLabel: "Product Catalog",
    categoryLabel: "Exchange Category",
    countLabel: "Products",
    sourceLabel: "Source",
    viewDetailCta: "View Details",
    backToCatalogCta: "Back to Catalog",
    descriptionTitle: "Product Description",
    specificationTitle: "Product Specifications",
    emptyTitle: "No products are available yet.",
    emptyBody: "Please check back again shortly.",
    categories: {
      multilateral: {
        title: "Multilateral Products",
        description:
          "Official multilateral products listed from the Solid Gold product catalog.",
        eyebrow: "JFX Category",
        summary:
          "These multilateral products contain official contract specifications together with trading and delivery details for exchange-traded instruments.",
      },
      bilateral: {
        title: "Bilateral Products",
        description:
          "Official bilateral products listed from the Solid Gold product catalog.",
        eyebrow: "SPA Category",
        summary:
          "These bilateral products summarize trading specifications, margins, commissions, and transaction parameters for active bilateral instruments.",
      },
    },
  };
