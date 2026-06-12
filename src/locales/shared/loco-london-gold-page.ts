export type LocoLondonGoldSubsection = {
  title: string;
  paragraphs: string[];
};

export type LocoLondonGoldArticleSection = {
  title: string;
  paragraphs: string[];
  highlight?: string;
  subsections?: LocoLondonGoldSubsection[];
};

export type LocoLondonGoldMarketCard = {
  title: string;
  paragraphs: string[];
  details: string[];
};

export type LocoLondonGoldAnalysisFactor = {
  title: string;
  description: string;
};

export type LocoLondonGoldDerivativePoint = {
  label: string;
  value: string;
};

export type LocoLondonGoldPageContent = {
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
    badges: string[];
  };
  sections: {
    historyTitle: string;
    historySubtitle: string;
    marketTitle: string;
    marketSubtitle: string;
    analysisTitle: string;
    analysisSubtitle: string;
    derivativeTitle: string;
    derivativeSubtitle: string;
  };
  history: LocoLondonGoldArticleSection[];
  markets: LocoLondonGoldMarketCard[];
  analysis: LocoLondonGoldAnalysisFactor[];
  derivative: {
    paragraphs: string[];
    points: LocoLondonGoldDerivativePoint[];
    note: string;
  };
};
