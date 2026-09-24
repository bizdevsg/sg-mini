import type { AppMessages } from "../../shared/messages";

export const enMarketAcademyBrowser: AppMessages["marketAcademyBrowser"] = {
  categories: {},
  filterModal: {
    title: "Filter Articles",
    subtitle: "Customize your Market Academy feed",
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
    fallback: "No articles available right now",
    articlesInCategory: "articles in",
  },
  pagination: {
    template: "Page {current} of {total}",
  },
  emptyFiltered: "Try a different keyword or category.",
  readArticle: "Read Article",
};
