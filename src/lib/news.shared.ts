export type NewsFeedArticle = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  displayCategory: string;
  publishedAt: string;
  imageSrc: string;
};

export type NewsArticleDetail = NewsFeedArticle & {
  bodyHtml: string;
  readTime: string;
  tags: string[];
};

export type NewsFeedResult = {
  articles: NewsFeedArticle[];
  source: "api" | "fallback";
};

export type NewsArticleDetailResult = {
  article: NewsArticleDetail | null;
  source: "api" | "fallback";
};
