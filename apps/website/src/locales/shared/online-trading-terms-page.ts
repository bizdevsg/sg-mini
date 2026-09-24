export type OnlineTradingTermSubsection = {
  title: string;
  paragraphs: string[];
};

export type OnlineTradingTermSection = {
  title: string;
  paragraphs: string[];
  highlight?: string;
  subsections?: OnlineTradingTermSubsection[];
};

export type OnlineTradingTermsPageContent = {
  meta: {
    title: string;
    description: string;
  };
  breadcrumb: {
    education: string;
    current: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: string;
    badges: string[];
  };
  sections: {
    articleTitle: string;
    articleSubtitle: string;
  };
  terms: OnlineTradingTermSection[];
};
