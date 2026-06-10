export const SUPPORTED_LOCALES = ["id", "en"] as const;

export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = "id";

export const LOCALE_CONFIG: Record<
  AppLocale,
  {
    lang: string;
    intl: string;
    timeZone: string;
  }
> = {
  id: {
    lang: "id-ID",
    intl: "id-ID",
    timeZone: "Asia/Jakarta",
  },
  en: {
    lang: "en-US",
    intl: "en-US",
    timeZone: "Asia/Jakarta",
  },
};

export function getLocaleConfig(locale: AppLocale = DEFAULT_LOCALE) {
  return LOCALE_CONFIG[locale];
}

export function isSupportedLocale(value: string): value is AppLocale {
  return SUPPORTED_LOCALES.includes(value as AppLocale);
}
