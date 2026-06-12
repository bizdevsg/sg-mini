export type SolidGoldAppPageContent = {
  meta: {
    title: string;
    description: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    badges: string[];
    visualSrc: string;
    visualAlt: string;
  };
  platforms: {
    title: string;
    subtitle: string;
    items: Array<{
      title: string;
      description: string;
      availability: string[];
      stores: Array<{
        label: string;
        href: string;
        icon: "google-play" | "apple";
      }>;
    }>;
  };
  benefits: {
    title: string;
    items: string[];
  };
};
