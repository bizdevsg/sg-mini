import type { OnlineTradingTermsPageContent } from "../../shared/online-trading-terms-page";

export const idOnlineTradingTermsPageContent: OnlineTradingTermsPageContent = {
  meta: {
    title: "Istilah Dalam Transaksi Online",
    description:
      "Panduan istilah dasar dalam transaksi online seperti market order, limit order, stop order, OCO, dan GTC untuk membantu pemahaman trader.",
  },
  breadcrumb: {
    education: "Edukasi",
    current: "Istilah Transaksi Online",
  },
  hero: {
    eyebrow: "Edukasi Trading",
    title: "Istilah Dalam Transaksi Online",
    description:
      "Halaman ini merangkum istilah dasar yang sering muncul saat menempatkan order, mengatur risiko, dan mengelola posisi dalam transaksi online.",
    primaryCta: "Baca Istilah",
    badges: [
      "Format Edukasi Terstruktur",
      "Istilah Inti Trading",
      "Mudah Dipelajari Ulang",
    ],
  },
  sections: {
    articleTitle: "Istilah Dalam Transaksi Online",
    articleSubtitle:
      "Pelajari istilah penting satu per satu dengan susunan materi yang lebih terarah seperti halaman edukasi ebook.",
  },
  terms: [
    {
      title: "Market Order",
      paragraphs: [
        "Market order adalah instruksi jual atau beli yang harus dieksekusi seketika itu juga pada harga terbaik yang tersedia saat order masuk ke pasar.",
        "Order ini dapat digunakan untuk membuka posisi baru maupun melikuidasi posisi yang sudah ada.",
      ],
    },
    {
      title: "Limit Order",
      paragraphs: [
        "Limit order adalah pesanan dengan batas harga maksimum atau minimum tertentu sesuai level yang ditentukan pengguna.",
        "Order ini dapat dipakai untuk membuka posisi baru maupun melikuidasi posisi yang sudah berjalan.",
      ],
    },
    {
      title: "Stop Order",
      paragraphs: [
        "Stop order, yang juga sering disebut stop loss order, digunakan ketika harga bergerak di atas atau di bawah batas harga tertentu yang sudah ditentukan sebelumnya.",
        "Saat stop price tercapai, order ini berubah menjadi market order dan digunakan untuk membatasi kerugian, mengurangi risiko, atau melindungi keuntungan pada posisi terbuka.",
        "Stop order terdiri dari beberapa bentuk penggunaan yang umum dipakai trader untuk mengelola risiko sesuai arah posisi.",
      ],
      highlight:
        "Dalam kondisi pasar yang bergerak sangat cepat, harga eksekusi stop order bisa berbeda dari stop price yang ditetapkan.",
      subsections: [
        {
          title: "Sell Stop Order",
          paragraphs: [
            "Sell stop order adalah instruksi jual pada harga terbaik ketika harga bergerak turun melewati stop price yang sudah ditentukan.",
            "Jenis order ini umumnya ditempatkan di bawah harga pasar yang sedang berjalan untuk membantu membatasi kerugian atau melindungi posisi beli yang sudah dimiliki.",
          ],
        },
        {
          title: "Buy Stop Order",
          paragraphs: [
            "Buy stop order adalah instruksi beli pada harga terbaik ketika harga bergerak naik melewati stop price tertentu.",
            "Order ini biasa digunakan untuk membatasi kerugian pada posisi jual yang sudah terbuka.",
          ],
        },
        {
          title: "Stop Limit Order",
          paragraphs: [
            "Stop limit order merupakan kombinasi antara stop order dan limit order.",
            "Ketika stop price tercapai, order ini berubah menjadi limit order beli atau jual pada batas harga yang sudah ditentukan sendiri.",
            "Metode ini bisa digunakan untuk memulai posisi baru, tetapi tidak selalu ideal sebagai alat perlindungan utama, terutama ketika pasar sepi atau kurang aktif.",
          ],
        },
      ],
    },
    {
      title: "One Cancels the Other (OCO)",
      paragraphs: [
        "OCO adalah penempatan dua order pada dua limit price yang berbeda dalam satu waktu.",
        "Jika salah satu order tereksekusi, maka order yang lain akan otomatis dibatalkan.",
      ],
    },
    {
      title: "Good Till Cancel (GTC)",
      paragraphs: [
        "GTC adalah masa berlaku limit order yang tetap aktif hingga hari berikutnya selama order tersebut belum tereksekusi.",
        "Order yang masih pending dalam periode itu tetap dapat dibatalkan oleh pengguna.",
      ],
    },
  ],
};
