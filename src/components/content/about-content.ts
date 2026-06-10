import { getCdnAssetUrl } from "@/lib/env";
import type { AppLocale } from "@/locales";

type AboutHighlight = {
  label: string;
  value: string;
};

type AboutPillar = {
  title: string;
  description: string;
};

type AboutContent = {
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
  story: {
    title: string;
    paragraphs: string[];
    highlights: AboutHighlight[];
    image: {
      src: string;
      alt: string;
    };
  };
  pillars: {
    title: string;
    subtitle: string;
    items: AboutPillar[];
  };
  numbers: {
    title: string;
    items: Array<{
      value: string;
      label: string;
      detail: string;
    }>;
  };
  cta: {
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
  };
};

const aboutContent: Record<AppLocale, AboutContent> = {
  id: {
    meta: {
      title: "Tentang Solid Gold Berjangka",
      description:
        "Pelajari profil Solid Gold Berjangka, fokus layanan, legalitas, dan komitmen kami untuk trader Indonesia.",
    },
    hero: {
      eyebrow: "Tentang Kami",
      title: "Membangun akses trading yang lebih aman, jelas, dan relevan untuk trader Indonesia.",
      description:
        "Solid Gold Berjangka hadir dengan fokus pada eksekusi yang efisien, edukasi yang praktis, dan pengalaman trading yang lebih terstruktur untuk nasabah ritel maupun trader aktif.",
      primaryCta: "Buka Akun",
      secondaryCta: "Lihat Berita",
    },
    story: {
      title: "Solid Gold Berjangka dalam satu gambaran.",
      paragraphs: [
        "Kami berfokus membangun pengalaman trading yang lebih mudah dipahami tanpa mengorbankan kualitas eksekusi, kejelasan informasi, dan pengelolaan risiko. Itu berarti platform, materi edukasi, dan alur layanan kami dirancang untuk membantu trader mengambil keputusan dengan konteks yang lebih baik.",
        "Di saat yang sama, kami menempatkan kepatuhan, segregated account, dan dukungan operasional sebagai fondasi utama. Pendekatan ini penting karena kepercayaan nasabah tidak dibangun dari promosi, tetapi dari konsistensi layanan, transparansi, dan kemampuan untuk menjaga standar kerja dalam jangka panjang.",
      ],
      highlights: [
        { label: "Fokus layanan", value: "Trader retail & aktif" },
        { label: "Pendekatan", value: "Edukasi, eksekusi, support" },
        { label: "Fondasi", value: "Legalitas & keamanan dana" },
      ],
      image: {
        src: getCdnAssetUrl("aed38b4d-ca53-447c-8250-59a03a7ea4eb.avif"),
        alt: "Ilustrasi pengawasan regulator dan reputasi perusahaan",
      },
    },
    pillars: {
      title: "Tiga fokus utama kami.",
      subtitle:
        "Halaman ini bukan sekadar profil perusahaan. Ini ringkasan tentang apa yang kami anggap penting dalam membangun layanan trading yang tahan lama.",
      items: [
        {
          title: "Kejelasan Produk",
          description:
            "Kami berupaya menyajikan informasi spread, produk, dan market context secara ringkas agar trader tidak perlu menebak detail penting sebelum masuk posisi.",
        },
        {
          title: "Eksekusi dan Support",
          description:
            "Dukungan 24/5, alur pembukaan akun yang jelas, dan materi pendamping dibuat agar nasabah bisa bergerak lebih cepat dari belajar ke eksekusi.",
        },
        {
          title: "Keamanan Operasional",
          description:
            "Segregated account, kepatuhan regulator, dan praktik keamanan internal tetap menjadi dasar sebelum bicara pertumbuhan atau ekspansi fitur.",
        },
      ],
    },
    numbers: {
      title: "Angka yang mewakili skala dan komitmen layanan.",
      items: [
        {
          value: "24/5",
          label: "Customer Support",
          detail: "Dukungan operasional untuk membantu kebutuhan trader di sesi aktif market.",
        },
        {
          value: "25",
          label: "Tahun Pengalaman",
          detail: "Pengalaman panjang dalam layanan perdagangan berjangka dan kebutuhan nasabah lokal.",
        },
        {
          value: "15 rb+",
          label: "Review Positif",
          detail: "Validasi pasar bahwa pengalaman pengguna tetap menjadi area yang kami jaga.",
        },
        {
          value: "50+",
          label: "Penghargaan Resmi",
          detail: "Pengakuan yang memperkuat rekam jejak, bukan menggantikan kualitas layanan harian.",
        },
      ],
    },
    cta: {
      title: "Ingin lanjut dari mengenal kami ke mulai trading?",
      description:
        "Buka akun untuk mengakses platform, market update, dan alur trading yang disiapkan lebih rapi untuk kebutuhan trader aktif.",
      primaryCta: "Mulai Sekarang",
      secondaryCta: "Kembali ke Beranda",
    },
  },
  en: {
    meta: {
      title: "About Solid Gold Berjangka",
      description:
        "Learn about Solid Gold Berjangka, our service focus, legal footing, and long-term commitment to Indonesian traders.",
    },
    hero: {
      eyebrow: "About Us",
      title: "Building a safer, clearer, and more relevant trading experience for Indonesian traders.",
      description:
        "Solid Gold Berjangka focuses on efficient execution, practical education, and a more structured trading workflow for retail clients and active traders.",
      primaryCta: "Open Account",
      secondaryCta: "View News",
    },
    story: {
      title: "Solid Gold Berjangka at a glance.",
      paragraphs: [
        "We focus on making trading easier to understand without sacrificing execution quality, information clarity, or risk awareness. That means our platform, educational assets, and service flow are designed to help traders make decisions with better context.",
        "At the same time, we treat compliance, segregated accounts, and operational support as core infrastructure. Trust is not built through promotion alone. It is built through service consistency, transparency, and the ability to maintain standards over time.",
      ],
      highlights: [
        { label: "Service focus", value: "Retail & active traders" },
        { label: "Approach", value: "Education, execution, support" },
        { label: "Foundation", value: "Legal compliance & fund safety" },
      ],
      image: {
        src: getCdnAssetUrl("aed38b4d-ca53-447c-8250-59a03a7ea4eb.avif"),
        alt: "Illustration of regulatory oversight and company reputation",
      },
    },
    pillars: {
      title: "Three areas we prioritize.",
      subtitle:
        "This page is more than a company profile. It is a concise view of what we consider essential in building a durable trading service.",
      items: [
        {
          title: "Product Clarity",
          description:
            "We aim to present spread information, product access, and market context in a compact format so traders are not guessing the basics before taking a position.",
        },
        {
          title: "Execution and Support",
          description:
            "24/5 support, clearer onboarding, and practical guidance help clients move faster from learning into actual execution.",
        },
        {
          title: "Operational Security",
          description:
            "Segregated accounts, regulatory compliance, and internal security practices remain the baseline before we talk about growth or feature expansion.",
        },
      ],
    },
    numbers: {
      title: "Numbers that reflect our service scale and operating focus.",
      items: [
        {
          value: "24/5",
          label: "Customer Support",
          detail: "Operational support designed to help traders during active market sessions.",
        },
        {
          value: "25",
          label: "Years of Experience",
          detail: "Long-term experience serving futures traders and local market needs.",
        },
        {
          value: "15k+",
          label: "Positive Reviews",
          detail: "A market signal that user experience continues to matter in practice, not just in messaging.",
        },
        {
          value: "50+",
          label: "Official Awards",
          detail: "Recognition that supports the track record, rather than replacing daily service quality.",
        },
      ],
    },
    cta: {
      title: "Ready to move from learning about us into actual trading?",
      description:
        "Open an account to access the platform, market updates, and a trading workflow built more deliberately for active traders.",
      primaryCta: "Get Started",
      secondaryCta: "Back to Homepage",
    },
  },
};

export function getAboutContent(locale: AppLocale) {
  return aboutContent[locale];
}
