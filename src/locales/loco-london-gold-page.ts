import type { AppLocale } from "./config";
import { enLocoLondonGoldPageContent } from "./en/pages/loco-london-gold";
import { idLocoLondonGoldPageContent } from "./id/pages/loco-london-gold";
import type { LocoLondonGoldPageContent } from "./shared/loco-london-gold-page";

export type {
  LocoLondonGoldAnalysisFactor,
  LocoLondonGoldArticleSection,
  LocoLondonGoldDerivativePoint,
  LocoLondonGoldMarketCard,
  LocoLondonGoldPageContent,
  LocoLondonGoldSubsection,
} from "./shared/loco-london-gold-page";

const locoLondonGoldPageContent: Record<AppLocale, LocoLondonGoldPageContent> =
  {
    id: idLocoLondonGoldPageContent,
    en: enLocoLondonGoldPageContent,
  };

export function getLocoLondonGoldPageContent(locale: AppLocale) {
  return locoLondonGoldPageContent[locale];
}
