import type { AppLocale } from "@/locales";

type AppDownloadModalCopy = {
  title: string;
  subtitle: string;
  description: string;
  closeLabel: string;
};

export function getAppDownloadModalCopy(
  locale: AppLocale,
): AppDownloadModalCopy {
  if (locale === "id") {
    return {
      title: "Download Aplikasi",
      subtitle: "Solid Gold Berjangka",
      description:
        "Untuk login atau registrasi akun, silakan download aplikasi Solid Gold Berjangka terlebih dahulu melalui store pilihan Anda.",
      closeLabel: "Tutup",
    };
  }

  return {
    title: "Download the App",
    subtitle: "Solid Gold Berjangka",
    description:
      "To log in or register an account, please download the Solid Gold Berjangka app first from your preferred app store.",
    closeLabel: "Close",
  };
}
