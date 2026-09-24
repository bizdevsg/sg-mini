export type GettingStartedStep = {
  title: string;
  description: string;
  bullets: string[];
};

export type GettingStartedSupportCard = {
  title: string;
  description: string;
};

export type GettingStartedPageContent = {
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
    stepsEyebrow: string;
    stepsTitle: string;
    stepsSubtitle: string;
    checklistEyebrow: string;
    checklistTitle: string;
    checklistSubtitle: string;
    supportEyebrow: string;
    supportTitle: string;
    supportSubtitle: string;
    ctaEyebrow: string;
    ctaTitle: string;
    ctaDescription: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  steps: GettingStartedStep[];
  checklist: string[];
  supportCards: GettingStartedSupportCard[];
};
