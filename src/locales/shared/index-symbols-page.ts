export type IndexSymbolItem = {
  code: string;
  description: string;
};

export type ContractMonthSymbolGroup = {
  title: string;
  items: Array<{
    code: string;
    month: string;
  }>;
};

export type ContractExampleItem = {
  code: string;
  description: string;
};

export type IndexSymbolsPageContent = {
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
    secondaryCta: string;
    badges: string[];
  };
  sections: {
    symbolsTitle: string;
    symbolsSubtitle: string;
    contractMonthsTitle: string;
    contractMonthsSubtitle: string;
    contractExampleTitle: string;
    contractExampleSubtitle: string;
  };
  symbols: IndexSymbolItem[];
  contractMonths: ContractMonthSymbolGroup[];
  contractExample: ContractExampleItem[];
};
