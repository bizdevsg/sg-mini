import type { AppLocale } from "./config";
import { enSolidGoldAppPageContent } from "./en/pages/solid-gold-app";
import { idSolidGoldAppPageContent } from "./id/pages/solid-gold-app";
import type { SolidGoldAppPageContent } from "./shared/solid-gold-app-page";

export type { SolidGoldAppPageContent } from "./shared/solid-gold-app-page";

const solidGoldAppPageContent: Record<AppLocale, SolidGoldAppPageContent> = {
  id: idSolidGoldAppPageContent,
  en: enSolidGoldAppPageContent,
};

export function getSolidGoldAppPageContent(locale: AppLocale) {
  return solidGoldAppPageContent[locale];
}
