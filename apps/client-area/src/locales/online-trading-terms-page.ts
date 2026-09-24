import type { AppLocale } from "./config";
import { enOnlineTradingTermsPageContent } from "./en/pages/online-trading-terms";
import { idOnlineTradingTermsPageContent } from "./id/pages/online-trading-terms";
import type { OnlineTradingTermsPageContent } from "./shared/online-trading-terms-page";

export type {
  OnlineTradingTermSection,
  OnlineTradingTermSubsection,
  OnlineTradingTermsPageContent,
} from "./shared/online-trading-terms-page";

const onlineTradingTermsPageContent: Record<
  AppLocale,
  OnlineTradingTermsPageContent
> = {
  id: idOnlineTradingTermsPageContent,
  en: enOnlineTradingTermsPageContent,
};

export function getOnlineTradingTermsPageContent(locale: AppLocale) {
  return onlineTradingTermsPageContent[locale];
}
