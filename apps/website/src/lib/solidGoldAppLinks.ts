import {
  getSolidGoldAppPageContent,
  type AppLocale,
} from "@/locales";

type StoreIcon = "google-play" | "apple";
type AppVariant = "sg-berjangka" | "solid";

function getPlatform(locale: AppLocale, appVariant: AppVariant) {
  const items = getSolidGoldAppPageContent(locale).platforms.items;
  const targetTitle = appVariant === "solid" ? "Solid" : "SG Berjangka";

  return (
    items.find((item) => item.title === targetTitle) ??
    items[appVariant === "solid" ? 1 : 0] ??
    items[0]
  );
}

function getStoreHref(
  locale: AppLocale,
  appVariant: AppVariant,
  icon: StoreIcon,
) {
  const platform = getPlatform(locale, appVariant);

  return (
    platform?.stores.find((store) => store.icon === icon)?.href ??
    `/${locale}/aplikasi-solid-gold`
  );
}

export function getClientAreaAppStoreLinks(locale: AppLocale) {
  return {
    googlePlayLink: getStoreHref(locale, "solid", "google-play"),
    appStoreLink: getStoreHref(locale, "solid", "apple"),
  };
}
