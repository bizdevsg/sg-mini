import { DEFAULT_LOCALE, isSupportedLocale, type AppLocale } from "@/locales";

export function resolveFallbackLocaleFromPathname(pathname: string): AppLocale {
  const firstSegment = pathname.split("/").filter(Boolean)[0];

  if (firstSegment && isSupportedLocale(firstSegment)) {
    return firstSegment;
  }

  return DEFAULT_LOCALE;
}

export function getRouteFallbackCopy(locale: AppLocale) {
  if (locale === "en") {
    return {
      siteNotFound: {
        badge: "404",
        title: "The page you requested could not be found.",
        description:
          "The address may be incorrect, the page may have moved, or the content is no longer available.",
        primaryLabel: "Back to Home",
        secondaryLabel: "Open Market News",
      },
      siteError: {
        badge: "Unexpected Error",
        title: "Something went wrong while loading this page.",
        description:
          "Please retry the request. If the problem continues, return to the homepage and try again later.",
        primaryLabel: "Try Again",
        secondaryLabel: "Back to Home",
      },
      clientAreaNotFound: {
        badge: "Client Area 404",
        title: "This Client Area page is not available.",
        description:
          "The menu or route you opened does not exist, or the resource has been removed from the current account area.",
        primaryLabel: "Back to Dashboard",
        secondaryLabel: "Open Market",
      },
      clientAreaError: {
        badge: "Client Area Error",
        title: "The Client Area failed to load properly.",
        description:
          "Retry this section first. If it still fails, return to the dashboard and continue from another page.",
        primaryLabel: "Try Again",
        secondaryLabel: "Back to Dashboard",
      },
      globalError: {
        badge: "System Error",
        title: "A critical application error occurred.",
        description:
          "The app could not render the requested screen. Retry the request or go back to the homepage.",
        primaryLabel: "Retry",
        secondaryLabel: "Back to Home",
      },
      labels: {
        reference: "Reference",
      },
    };
  }

  return {
    siteNotFound: {
      badge: "404",
      title: "Halaman yang Anda buka tidak ditemukan.",
      description:
        "Alamat mungkin salah, halaman sudah dipindahkan, atau kontennya sudah tidak tersedia lagi.",
      primaryLabel: "Kembali ke Beranda",
      secondaryLabel: "Buka Berita Market",
    },
    siteError: {
      badge: "Terjadi Gangguan",
      title: "Terjadi kesalahan saat memuat halaman ini.",
      description:
        "Silakan coba muat ulang terlebih dahulu. Jika masih gagal, kembali ke beranda lalu ulangi beberapa saat lagi.",
      primaryLabel: "Coba Lagi",
      secondaryLabel: "Kembali ke Beranda",
    },
    clientAreaNotFound: {
      badge: "Client Area 404",
      title: "Halaman Client Area ini tidak tersedia.",
      description:
        "Menu atau route yang Anda buka tidak ada, atau resource tersebut sudah tidak tersedia pada area akun saat ini.",
      primaryLabel: "Kembali ke Dashboard",
      secondaryLabel: "Buka Market",
    },
    clientAreaError: {
      badge: "Gangguan Client Area",
      title: "Client Area gagal dimuat dengan benar.",
      description:
        "Coba muat ulang bagian ini terlebih dahulu. Jika masih gagal, kembali ke dashboard dan lanjutkan dari halaman lain.",
      primaryLabel: "Coba Lagi",
      secondaryLabel: "Kembali ke Dashboard",
    },
    globalError: {
      badge: "Gangguan Sistem",
      title: "Terjadi kesalahan aplikasi yang bersifat kritis.",
      description:
        "Aplikasi tidak dapat merender tampilan yang diminta. Silakan coba lagi atau kembali ke beranda.",
      primaryLabel: "Coba Lagi",
      secondaryLabel: "Kembali ke Beranda",
    },
    labels: {
      reference: "Referensi",
    },
  };
}
