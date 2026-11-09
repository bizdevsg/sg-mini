import type { AppLocale } from "./config";

export type MarketResourcePageIntro = {
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
  };
};

export type NewsPageContent = {
  newsPage: MarketResourcePageIntro;
  latest: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
};

const newsPageContent: Record<AppLocale, NewsPageContent> = {
  id: {
    newsPage: {
      meta: {
        title: "Berita Market Hari Ini",
        description:
          "Ringkasan berita pasar dan insight trading untuk trader SG Mini.",
      },
      hero: {
        eyebrow: "Newsroom SG Mini",
        title:
          "Berita market yang ringkas, cepat dibaca, dan relevan untuk keputusan trading.",
        description:
          "Pantau headline utama dan rangkuman market terbaru dalam halaman yang fokus untuk trader aktif.",
        primaryCta: "Lihat Berita Terkini",
        secondaryCta: "Kalender Ekonomi",
      },
    },
    latest: {
      eyebrow: "Berita Terkini",
      title: "Update News Market",
      subtitle:
        "Pantau berita dan insight market terbaru untuk membantu keputusan trading lebih terarah.",
    },
  },
  en: {
    newsPage: {
      meta: {
        title: "Market News Today",
        description:
          "A compact market news page with concise insights for SG Mini traders.",
      },
      hero: {
        eyebrow: "SG Mini Newsroom",
        title: "Market news designed for fast reads and trading decisions.",
        description:
          "Track the latest headlines and concise market recaps in a page built for active traders.",
        primaryCta: "View Latest News",
        secondaryCta: "Economic Calendar",
      },
    },
    latest: {
      eyebrow: "Latest News",
      title: "Update News Market",
      subtitle:
        "Stay up to date on the latest news and market insights to help you make more informed trading decisions.",
    },
  },
};

export function getNewsPageContent(locale: AppLocale) {
  return newsPageContent[locale];
}
