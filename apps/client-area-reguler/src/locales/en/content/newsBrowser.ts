import type { AppMessages } from "../../shared/messages";

export const enNewsBrowser: AppMessages["newsBrowser"] = {
    categories: {
      Index: "Index",
      Commodity: "Commodity",
      Currencies: "Currencies",
      "Global & Ekonomi": "Global & Economy",
      "Fiscal & Moneter": "Fiscal & Monetary",
      "Analisis Market": "Market Analysis",
    },
    filterModal: {
      title: "Filter News",
      subtitle: "Customize your news feed",
      sortBy: "Sort By",
      newest: "Newest",
      oldest: "Oldest",
      period: "Period",
      all: "All",
      today: "Today",
      week: "This Week",
      month: "This Month",
      apply: "Apply",
      reset: "Reset",
      close: "Close",
    },
    summary: {
      category: "category",
      available: "articles available",
      fallback: "Showing fallback news",
      articlesInCategory: "articles in",
    },
    pagination: {
      template: "Page {current} of {total}",
    },
    emptyFiltered: "Try a different keyword or category.",
    readArticle: "Read Article",
  };
