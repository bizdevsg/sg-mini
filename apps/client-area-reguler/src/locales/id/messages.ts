import type { AppMessages } from "../shared/messages";
import { idApp } from "./content/app";
import { idNavbar } from "./content/navbar";
import { idAppPromoSection } from "./content/appPromoSection";
import { idEbookPage } from "./content/ebookPage";
import { idLiveQuoteTable } from "./content/liveQuoteTable";
import { idEconomicCalendarBrowser } from "./content/economicCalendarBrowser";
import { idNewsPage } from "./content/newsPage";
import { idNewsBrowser } from "./content/newsBrowser";
import { idNewsDetailPage } from "./content/newsDetailPage";
import { idPromoDetailPage } from "./content/promoDetailPage";
import { idClientArea } from "./content/clientArea";
import { idCookieConsent } from "./content/cookieConsent";
import { idFooter } from "./content/footer";
import { idLoadingOverlay } from "./content/loadingOverlay";

export const idMessages: AppMessages = {
  app: idApp,
  navbar: idNavbar,
  appPromoSection: idAppPromoSection,
  ebookPage: idEbookPage,
  liveQuoteTable: idLiveQuoteTable,
  economicCalendarBrowser: idEconomicCalendarBrowser,
  newsPage: idNewsPage,
  newsBrowser: idNewsBrowser,
  newsDetailPage: idNewsDetailPage,
  promoDetailPage: idPromoDetailPage,
  clientArea: idClientArea,
  cookieConsent: idCookieConsent,
  footer: idFooter,
  loadingOverlay: idLoadingOverlay,
};
