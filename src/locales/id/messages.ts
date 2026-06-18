import type { AppMessages } from "../shared/messages";
import { idApp } from "./content/app";
import { idNavbar } from "./content/navbar";
import { idHero } from "./content/hero";
import { idRegulator } from "./content/regulator";
import { idTrustStats } from "./content/trustStats";
import { idSecurity } from "./content/security";
import { idHomeEbookPromo } from "./content/homeEbookPromo";
import { idSpread } from "./content/spread";
import { idFinalCta } from "./content/finalCta";
import { idLiveQuoteSection } from "./content/liveQuoteSection";
import { idLiveQuotePage } from "./content/liveQuotePage";
import { idEbookPage } from "./content/ebookPage";
import { idLiveQuoteTable } from "./content/liveQuoteTable";
import { idAboutPage } from "./content/aboutPage";
import { idProductPage } from "./content/productPage";
import { idEconomicCalendarPage } from "./content/economicCalendarPage";
import { idEconomicCalendarBrowser } from "./content/economicCalendarBrowser";
import { idHistoricalDataPage } from "./content/historicalDataPage";
import { idHistoricalDataBrowser } from "./content/historicalDataBrowser";
import { idNewsPage } from "./content/newsPage";
import { idNewsBrowser } from "./content/newsBrowser";
import { idNewsDetailPage } from "./content/newsDetailPage";
import { idFraudAlertPage } from "./content/fraudAlertPage";
import { idContactPage } from "./content/contactPage";
import { idFooter } from "./content/footer";
import { idLoadingOverlay } from "./content/loadingOverlay";

export const idMessages: AppMessages = {
  app: idApp,
  navbar: idNavbar,
  hero: idHero,
  regulator: idRegulator,
  trustStats: idTrustStats,
  security: idSecurity,
  homeEbookPromo: idHomeEbookPromo,
  spread: idSpread,
  finalCta: idFinalCta,
  liveQuoteSection: idLiveQuoteSection,
  liveQuotePage: idLiveQuotePage,
  ebookPage: idEbookPage,
  liveQuoteTable: idLiveQuoteTable,
  aboutPage: idAboutPage,
  productPage: idProductPage,
  economicCalendarPage: idEconomicCalendarPage,
  economicCalendarBrowser: idEconomicCalendarBrowser,
  historicalDataPage: idHistoricalDataPage,
  historicalDataBrowser: idHistoricalDataBrowser,
  newsPage: idNewsPage,
  newsBrowser: idNewsBrowser,
  newsDetailPage: idNewsDetailPage,
  fraudAlertPage: idFraudAlertPage,
  contactPage: idContactPage,
  footer: idFooter,
  loadingOverlay: idLoadingOverlay,
};
