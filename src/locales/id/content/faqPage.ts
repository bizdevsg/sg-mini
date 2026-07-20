import type { AppMessages } from "../../shared/messages";

export const idFaqPage: AppMessages["faqPage"] = {
  title: "FAQ",
  description:
    "Pertanyaan yang sering diajukan seputar akun, transaksi, dan layanan PT. Solid Gold Berjangka.",
  breadcrumb: "FAQ",
  hero: {
    eyebrow: "Pusat Bantuan",
    title: "Pertanyaan Yang Sering Diajukan",
    description:
      "Halaman ini merangkum pertanyaan umum yang paling sering muncul agar proses pencarian informasi lebih cepat dan lebih jelas.",
  },
  sections: [
    {
      title: "Tentang Perusahaan",
      description:
        "Pertanyaan umum terkait profil, informasi resmi, dan fungsi website.",
      items: [
        {
          question: "Di mana saya bisa melihat informasi perusahaan terbaru?",
          answer:
            "Informasi terbaru dapat Anda lihat pada halaman Informasi, Berita, serta kanal resmi PT. Solid Gold Berjangka.",
        },
        {
          question: "Apakah website ini memberikan rekomendasi transaksi?",
          answer:
            "Informasi pada website ini bersifat edukasi dan referensi. Setiap keputusan transaksi tetap menjadi tanggung jawab masing-masing nasabah.",
        },
        {
          question: "Di mana saya bisa melihat legalitas perusahaan?",
          answer:
            "Anda dapat melihat ringkasan legalitas dan perizinan perusahaan melalui halaman Legalitas Bisnis yang tersedia di website.",
        },
      ],
    },
    {
      title: "Akun & Registrasi",
      description:
        "Informasi awal seputar pembukaan akun dan proses verifikasi data.",
      items: [
        {
          question: "Bagaimana cara membuka akun di PT. Solid Gold Berjangka?",
          answer:
            "Anda dapat memulai dari halaman pendaftaran yang tersedia di website, lalu melengkapi data identitas, informasi kontak, dan dokumen pendukung sesuai kebutuhan verifikasi.",
        },
        {
          question: "Apakah pembukaan akun memerlukan verifikasi dokumen?",
          answer:
            "Ya. Verifikasi dokumen diperlukan untuk memastikan data nasabah sesuai dengan ketentuan internal dan regulasi yang berlaku.",
        },
        {
          question: "Berapa lama proses verifikasi akun biasanya berlangsung?",
          answer:
            "Durasi verifikasi dapat berbeda tergantung kelengkapan data yang dikirimkan. Jika seluruh dokumen sesuai, proses biasanya berjalan lebih cepat.",
        },
      ],
    },
    {
      title: "Transaksi & Dana",
      description:
        "Jawaban dasar terkait transfer dana, segregated account, dan proses transaksi.",
      items: [
        {
          question: "Ke mana dana transaksi harus ditransfer?",
          answer:
            "Seluruh transfer dana transaksi hanya dilakukan ke Segregated Account resmi atas nama PT. Solid Gold Berjangka. Pastikan Anda selalu memeriksa instruksi resmi sebelum melakukan transfer.",
        },
        {
          question: "Apakah saya bisa melakukan deposit dan withdrawal kapan saja?",
          answer:
            "Permintaan dapat diajukan sesuai kanal yang tersedia, namun pemrosesan tetap mengikuti jam operasional dan prosedur verifikasi yang berlaku.",
        },
        {
          question: "Bagaimana cara memastikan instruksi transfer yang saya terima valid?",
          answer:
            "Verifikasi melalui kanal resmi perusahaan seperti nomor telepon kantor, email resmi, atau tim support yang terdaftar di website.",
        },
      ],
    },
    {
      title: "Layanan & Informasi",
      description:
        "Panduan singkat untuk menghubungi tim support dan mencari informasi tambahan.",
      items: [
        {
          question: "Jika saya memiliki keluhan, harus menghubungi ke mana?",
          answer:
            "Anda dapat menghubungi jalur pengaduan resmi yang tersedia pada halaman Hubungi Kami, baik melalui formulir, email, maupun nomor layanan pengaduan.",
        },
      ],
    },
  ],
  helpCard: {
    title: "Masih butuh bantuan?",
    description:
      "Jika jawaban yang Anda cari belum tersedia di sini, lanjutkan ke halaman kontak untuk menghubungi tim kami melalui kanal resmi.",
    primaryCta: "Hubungi Kami",
    secondaryCta: "Lihat Informasi",
  },
};
