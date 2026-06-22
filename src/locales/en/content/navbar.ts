import type { AppMessages } from "../../shared/messages";

export const enNavbar: AppMessages["navbar"] = {
    login: "Login",
    openAccount: "Sign Up",
    switchLocaleLabel: "Switch to Indonesian",
    switchLocaleIconAlt: "Indonesia flag icon",
    openMenuLabel: "Open navigation menu",
    closeMenuLabel: "Close navigation menu",
    menuGroups: [
      {
        label: "Products",
        items: [
          {
            label: "Multilateral Products",
            href: "/produk/multilateral",
          },
          { label: "Bilateral Products", href: "/produk/bilateral" },
          { label: "Solid Gold App", href: "/aplikasi-solid-gold" },
          { label: "Live Quote", href: "/live-quote" },
        ],
      },
      {
        label: "Education",
        items: [
          { label: "Getting Started", href: "/education/cara-memulai" },
          { label: "Ebook", href: "/education/ebook" },
          {
            label: "Online Trading Terms",
            href: "/education/istilah-dalam-transaksi-online",
          },
          {
            label: "Loco London Gold",
            href: "/education/loco-london-gold",
          },
          {
            label: "Index Symbols",
            href: "/education/simbol-index",
          },
        ],
      },
      {
        label: "News",
        items: [
          { label: "Latest News", href: "/news" },
          { label: "Economic Calendar", href: "/economic-calendar" },
          { label: "Historical Data", href: "/historical-data" },
        ],
      },
      {
        label: "About",
        items: [
          { label: "About Us", href: "/about" },
          { label: "Information", href: "/about/informasi" },
          { label: "Business Legality", href: "/about/legalitas-bisnis" },
          { label: "Contact Us", href: "/contact-us" },
        ],
      },
    ],
  };
