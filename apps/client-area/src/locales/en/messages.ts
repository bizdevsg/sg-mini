import type { AppMessages } from "../shared/messages";
import { enApp } from "./content/app";
import { enNavbar } from "./content/navbar";
import { enHero } from "./content/hero";
import { enAppPromoSection } from "./content/appPromoSection";
import { enEbookPage } from "./content/ebookPage";
import { enLiveQuoteTable } from "./content/liveQuoteTable";
import { enEconomicCalendarBrowser } from "./content/economicCalendarBrowser";
import { enNewsPage } from "./content/newsPage";
import { enNewsBrowser } from "./content/newsBrowser";
import { enNewsDetailPage } from "./content/newsDetailPage";
import { enPromoDetailPage } from "./content/promoDetailPage";
import { enClientArea } from "./content/clientArea";
import { enCookieConsent } from "./content/cookieConsent";
import { enFooter } from "./content/footer";
import { enLoadingOverlay } from "./content/loadingOverlay";

export const enMessages: AppMessages = {
  app: enApp,
  navbar: enNavbar,
  hero: enHero,
  appPromoSection: enAppPromoSection,
  ebookPage: enEbookPage,
  liveQuoteTable: enLiveQuoteTable,
  economicCalendarBrowser: enEconomicCalendarBrowser,
  newsPage: enNewsPage,
  newsBrowser: enNewsBrowser,
  newsDetailPage: enNewsDetailPage,
  promoDetailPage: enPromoDetailPage,
  clientArea: enClientArea,
  cookieConsent: enCookieConsent,
  footer: enFooter,
  loadingOverlay: enLoadingOverlay,
};
