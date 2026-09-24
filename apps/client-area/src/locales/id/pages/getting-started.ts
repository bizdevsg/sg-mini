import type { GettingStartedPageContent } from "../../shared/getting-started-page";

export const idGettingStartedPageContent: GettingStartedPageContent = {
  meta: {
    title: "Cara Memulai Trading",
    description:
      "Panduan singkat memulai trading dari dasar sampai akun live.",
  },
  breadcrumb: {
    education: "Edukasi",
    current: "Cara Memulai",
  },
  hero: {
    eyebrow: "Panduan Pemula",
    title: "Cara Memulai Trading",
    description: "Pahami dasar, coba demo, lalu masuk live saat sudah siap.",
    primaryCta: "Buka Akun",
    secondaryCta: "Lihat Edukasi",
    badges: ["Dasar", "Demo", "Live"],
  },
  sections: {
    stepsEyebrow: "4 Tahap",
    stepsTitle: "Langkah Memulai",
    stepsSubtitle: "Ikuti urutan sederhana ini.",
    checklistEyebrow: "Checklist",
    checklistTitle: "Sebelum Mulai",
    checklistSubtitle: "Pastikan kebutuhan dasar ini sudah siap.",
    supportEyebrow: "Fokus",
    supportTitle: "Yang Perlu Dijaga",
    supportSubtitle: "Tetap sederhana dan konsisten.",
    ctaEyebrow: "Siap Mulai",
    ctaTitle: "Mulai dari demo, lalu lanjut ke live.",
    ctaDescription: "Bangun dasar yang benar lebih dulu.",
    ctaPrimary: "Daftar Akun",
    ctaSecondary: "Hubungi Kami",
  },
  steps: [
    {
      title: "Pahami dasar trading",
      description: "Kenali cara kerja market dan risikonya.",
      bullets: [
        "Pelajari lot, margin, spread, stop loss, dan take profit.",
        "Gunakan manajemen risiko sejak awal.",
      ],
    },
    {
      title: "Buka akun demo",
      description: "Latihan dulu tanpa dana riil.",
      bullets: [
        "Siapkan email, nomor aktif, dan data identitas.",
        "Latih entry, exit, dan stop loss.",
      ],
    },
    {
      title: "Gunakan tools pendukung",
      description: "Gunakan platform dan analisa sebagai bantuan.",
      bullets: [
        "Biasakan membaca chart dan menempatkan order.",
        "Gunakan signal sebagai pendukung.",
      ],
    },
    {
      title: "Masuk ke akun live",
      description: "Mulai saat proses trading sudah lebih disiplin.",
      bullets: [
        "Mulai dengan ukuran transaksi kecil.",
        "Evaluasi hasil trading secara rutin.",
      ],
    },
  ],
  checklist: [
    "Paham dasar trading.",
    "Siap data untuk registrasi akun.",
    "Sudah mencoba akun demo.",
    "Sudah punya batas risiko.",
  ],
  supportCards: [
    {
      title: "Jangan buru-buru",
      description: "Tetap di akun demo sampai ritme trading lebih stabil.",
    },
    {
      title: "Fokus pada proses",
      description: "Utamakan disiplin, bukan sekadar ikut sinyal.",
    },
  ],
};
