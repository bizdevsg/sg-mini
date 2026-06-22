import type { AppMessages } from "../../shared/messages";

export const idAboutInformationPage: AppMessages["aboutInformationPage"] = {
  breadcrumb: "Informasi",
  parentLabel: "Tentang Kami",
  hero: {
    eyebrow: "Informasi Perusahaan",
    title: "Informasi & Pengumuman",
    description:
      "Halaman ini memuat ringkasan informasi perusahaan dan pembaruan pengumuman resmi PT. Solid Gold Berjangka dalam satu tempat.",
    stats: [
      {
        label: "Berdiri Sejak",
        value: "2002",
      },
      {
        label: "Fokus Layanan",
        value: "Perdagangan Berjangka",
      },
      {
        label: "Cakupan Kantor",
        value: "Jakarta, Semarang, Makassar",
      },
    ],
  },
  overview: {
    eyebrow: "Ikhtisar",
    title: "Informasi utama yang perlu diketahui sebelum mengenal layanan lebih jauh",
    description:
      "Isi halaman ini membantu calon nasabah, partner, dan pengunjung umum memahami profil perusahaan secara cepat sebelum menelusuri halaman lain yang lebih rinci.",
    cards: [
      {
        title: "Status Perusahaan",
        body: "PT. Solid Gold Berjangka merupakan perusahaan pialang berjangka yang menjalankan kegiatan usaha berdasarkan legalitas dan pengawasan regulator yang relevan di Indonesia.",
      },
      {
        title: "Ruang Lingkup Layanan",
        body: "Layanan difokuskan pada aktivitas perdagangan berjangka, edukasi dasar pasar, serta penyediaan akses informasi yang mendukung pengambilan keputusan nasabah.",
      },
      {
        title: "Pendekatan Operasional",
        body: "Perusahaan menekankan penyampaian informasi yang terstruktur, dukungan tim yang responsif, dan komunikasi layanan yang konsisten melalui kanal resmi.",
      },
    ],
  },
  operations: {
    title: "Hal yang menjadi perhatian dalam operasional layanan",
    items: [
      "Informasi perusahaan, materi edukasi, dan pembaruan pasar dipublikasikan melalui kanal resmi yang dikelola perusahaan.",
      "Pendampingan nasabah difokuskan pada kejelasan proses, pemahaman produk, dan komunikasi layanan yang terukur.",
      "Cakupan operasional dikembangkan untuk menjangkau kebutuhan nasabah di beberapa kota utama melalui kantor dan tim pendukung.",
    ],
  },
  serviceInfo: {
    title: "Detail singkat",
    items: [
      {
        label: "Jenis layanan",
        value: "Pialang berjangka dan dukungan informasi pasar",
      },
      {
        label: "Kanal komunikasi",
        value: "Website resmi, tim support, dan kantor operasional",
      },
      {
        label: "Arah layanan",
        value: "Pendekatan yang terstruktur, informatif, dan berorientasi kepatuhan",
      },
    ],
  },
  commitments: {
    title: "Komitmen yang dijaga perusahaan",
    items: [
      "Menjaga konsistensi penyampaian informasi perusahaan secara jelas dan mudah dipahami.",
      "Mendorong interaksi layanan yang profesional dan bertanggung jawab pada setiap titik komunikasi.",
      "Mendukung kebutuhan calon nasabah dan nasabah melalui informasi yang relevan, resmi, dan terverifikasi.",
    ],
  },
};
