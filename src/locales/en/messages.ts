import type { AppMessages } from "../shared/messages";
import { enApp } from "./content/app";
import { enNavbar } from "./content/navbar";
import { enHero } from "./content/hero";
import { enRegulator } from "./content/regulator";
import { enTrustStats } from "./content/trustStats";
import { enSecurity } from "./content/security";
import { enSpread } from "./content/spread";
import { enFinalCta } from "./content/finalCta";
import { enLiveQuoteSection } from "./content/liveQuoteSection";
import { enLiveQuotePage } from "./content/liveQuotePage";
import { enEbookPage } from "./content/ebookPage";
import { enLiveQuoteTable } from "./content/liveQuoteTable";
import { enAboutPage } from "./content/aboutPage";
import { enProductPage } from "./content/productPage";
import { enEconomicCalendarPage } from "./content/economicCalendarPage";
import { enEconomicCalendarBrowser } from "./content/economicCalendarBrowser";
import { enHistoricalDataPage } from "./content/historicalDataPage";
import { enHistoricalDataBrowser } from "./content/historicalDataBrowser";
import { enNewsPage } from "./content/newsPage";
import { enNewsBrowser } from "./content/newsBrowser";
import { enNewsDetailPage } from "./content/newsDetailPage";
import { enFraudAlertPage } from "./content/fraudAlertPage";
import { enContactPage } from "./content/contactPage";
import { enFooter } from "./content/footer";
import { enLoadingOverlay } from "./content/loadingOverlay";

export const enMessages: AppMessages = {
  app: enApp,
  navbar: enNavbar,
  hero: enHero,
  regulator: enRegulator,
  trustStats: enTrustStats,
  security: enSecurity,
  spread: enSpread,
  finalCta: enFinalCta,
  liveQuoteSection: enLiveQuoteSection,
  liveQuotePage: enLiveQuotePage,
  ebookPage: enEbookPage,
  liveQuoteTable: enLiveQuoteTable,
  aboutPage: enAboutPage,
  productPage: enProductPage,
  economicCalendarPage: enEconomicCalendarPage,
  economicCalendarBrowser: enEconomicCalendarBrowser,
  historicalDataPage: enHistoricalDataPage,
  historicalDataBrowser: enHistoricalDataBrowser,
  newsPage: enNewsPage,
  newsBrowser: enNewsBrowser,
  newsDetailPage: enNewsDetailPage,
  fraudAlertPage: enFraudAlertPage,
  contactPage: enContactPage,
  footer: enFooter,
  loadingOverlay: enLoadingOverlay,
};
