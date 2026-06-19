import type { AppLocale } from "./config";
import { enGettingStartedPageContent } from "./en/pages/getting-started";
import { idGettingStartedPageContent } from "./id/pages/getting-started";
import type { GettingStartedPageContent } from "./shared/getting-started-page";

export type {
  GettingStartedPageContent,
  GettingStartedStep,
  GettingStartedSupportCard,
} from "./shared/getting-started-page";

const gettingStartedPageContent: Record<AppLocale, GettingStartedPageContent> = {
  id: idGettingStartedPageContent,
  en: enGettingStartedPageContent,
};

export function getGettingStartedPageContent(locale: AppLocale) {
  return gettingStartedPageContent[locale];
}
