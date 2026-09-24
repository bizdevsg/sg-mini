import type { AppLocale } from "./config";
import { enIndexSymbolsPageContent } from "./en/pages/index-symbols";
import { idIndexSymbolsPageContent } from "./id/pages/index-symbols";
import type { IndexSymbolsPageContent } from "./shared/index-symbols-page";

export type {
  ContractExampleItem,
  ContractMonthSymbolGroup,
  IndexSymbolItem,
  IndexSymbolsPageContent,
} from "./shared/index-symbols-page";

const indexSymbolsPageContent: Record<AppLocale, IndexSymbolsPageContent> = {
  id: idIndexSymbolsPageContent,
  en: enIndexSymbolsPageContent,
};

export function getIndexSymbolsPageContent(locale: AppLocale) {
  return indexSymbolsPageContent[locale];
}
