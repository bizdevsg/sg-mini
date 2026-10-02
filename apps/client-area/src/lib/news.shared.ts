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

/** A news category from GET /api/v1/berita/categories. */
export type NewsCategory = {
  id: number;
  name: string;
  slug: string;
  /** `beritas_count` — how many articles the portal has in this category. */
  articleCount: number;
};

export type NewsFeedResult = {
  articles: NewsFeedArticle[];
};

export type NewsArticleDetailResult = {
  article: NewsArticleDetail | null;
};
