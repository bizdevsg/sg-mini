export type MarketAcademyArticle = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  displayCategory: string;
  publishedAt: string;
  imageSrc: string;
};

export type MarketAcademyArticleDetail = MarketAcademyArticle & {
  bodyHtml: string;
};

export type MarketAcademyFeedResult = {
  articles: MarketAcademyArticle[];
  source: "api" | "empty";
};

export type MarketAcademyArticleDetailResult = {
  article: MarketAcademyArticleDetail | null;
  source: "api" | "empty";
};
