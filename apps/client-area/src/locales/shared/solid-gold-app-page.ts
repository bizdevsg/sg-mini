export type SolidGoldAppPageContent = {
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
};
