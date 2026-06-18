import type { AppMessages } from "../../shared/messages";

export const idNavbar: AppMessages["navbar"] = {
    login: "Masuk",
    openAccount: "Daftar",
    switchLocaleLabel: "Ganti ke English",
    switchLocaleIconAlt: "Ikon bendera Amerika Serikat",
    openMenuLabel: "Buka menu navigasi",
    closeMenuLabel: "Tutup menu navigasi",
    menuGroups: [
      {
        label: "Produk",
        items: [
          {
            label: "Produk Multilateral",
            href: "/produk/multilateral",
          },
          { label: "Produk Bilateral", href: "/produk/bilateral" },
          { label: "Aplikasi Solid Gold", href: "/aplikasi-solid-gold" },
          { label: "Live Quote", href: "/live-quote" },
        ],
      },
      {
        label: "Edukasi",
        items: [
          { label: "Cara Memulai" },
          { label: "Ebook", href: "/education/ebook" },
          {
            label: "Istilah Transaksi Online",
            href: "/education/istilah-dalam-transaksi-online",
          },
          {
            label: "Loco London Gold",
            href: "/education/loco-london-gold",
          },
          {
            label: "Simbol Index",
            href: "/education/simbol-index",
          },
        ],
      },
      {
        label: "Berita",
        items: [
          { label: "Berita Terkini", href: "/news" },
          { label: "Kalender Ekonomi", href: "/economic-calendar" },
          { label: "Historical Data", href: "/historical-data" },
        ],
      },
      {
        label: "Tentang",
        items: [
          { label: "Tentang Kami", href: "/about" },
          { label: "Hubungi Kami", href: "/contact-us" },
        ],
      },
    ],
  };
