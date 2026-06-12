import type { AppMessages } from "../../shared/messages";

export const idFooter: AppMessages["footer"] = {
    brandTitle: "SG Mini",
    brandItems: [
      { label: "Tentang Kami", href: "/about" },
      { label: "Ebook", href: "/education/ebook" },
      { label: "Live Quote", href: "/live-quote" },
      { label: "Berita", href: "/news" },
    ],
    helpTitle: "Bantuan",
    helpItems: [
      { label: "Hubungi Kami", href: "/contact-us" },
      { label: "Waspada Penipuan", href: "/fraud-alert" },
      { label: "Kalender Ekonomi", href: "/economic-calendar" },
      { label: "Historical Data", href: "/historical-data" },
    ],
    legalItems: [
      "Badan Pengawas Perdagangan Berjangka Komoditi: Nomor 1156/BAPPEBTI/SI/3/2007",
      "Otoritas Jasa Keuangan: Nomor S-126/PM.02/2025",
      "Bank Indonesia: Nomor 27/663/DPPK/Srt/B",
      "Bursa Komoditi dan Derivatif Indonesia: Nomor S-373/PM.02/2025",
      "Bursa Berjangka Jakarta: Nomor SPAB-047/BBJ/07/02",
      "Kliring Berjangka Indonesia: Nomor 15/AK-KBI/V/2003",
    ],
    socials: [
      {
        name: "Instagram",
        url: "https://instagram.com/example",
        icon: "instagram",
      },
      {
        name: "Facebook",
        url: "https://facebook.com/example",
        icon: "facebook-f",
      },
      {
        name: "YouTube",
        url: "https://youtube.com/example",
        icon: "youtube",
      },
      {
        name: "TikTok",
        url: "https://tiktok.com/@example",
        icon: "tiktok",
      },
    ],
    copyrightProtected: "Hak cipta dilindungi.",
    komdigiAlt: "Logo Komdigi",
    tsiAlt: "Logo TSI",
  };
