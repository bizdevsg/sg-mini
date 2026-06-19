const DEFAULT_LIVE_QUOTE_SOCKET_URL = "wss://wsprc.royalassetindo.co.id";
const DEFAULT_FRAMER_IMAGE_BASE_URL = "https://framerusercontent.com/images";
const DEFAULT_NEWS_API_URL = "http://portalnews.newsmaker.test/api/v1/berita";
const DEFAULT_NEWS_PORTAL_BASE_URL = "http://portalnews.newsmaker.test";
const DEFAULT_PRODUCT_API_URL = "https://sg-admin.newsmaker.id/api/v1/produk";
const DEFAULT_PRODUCT_PORTAL_BASE_URL = "https://sg-admin.newsmaker.id";
const DEFAULT_BANNER_API_URL = "http://sg-admin.test/api/banner";
const DEFAULT_BANNER_IMAGE_BASE_URL = "http://sg-admin.test/storage/banner-images";
const DEFAULT_HISTORICAL_DATA_API_URL =
  "https://portalnews.newsmaker.id/api/v1/newsmaker/historical-data";
const DEFAULT_HISTORICAL_DATA_API_TOKEN = "NM23-8f0f24b4d56af1c3";
const DEFAULT_ECONOMIC_CALENDAR_API_BASE_URL =
  "https://endpoapi-production-3202.up.railway.app/api/calendar";
const DEFAULT_LOGIN_URL = "https://etrade.sgberjangka.com/login";
const DEFAULT_REGISTER_URL = "https://regol.solidgold.co.id/";
const DEFAULT_HERO_CTA_URL = "https://sg-berjangka.com/";
const DEFAULT_SPREAD_CTA_URL = "https://sg-berjangka.com/";
const DEFAULT_SOLID_GOLD_PLAY_STORE_URL = "https://play.google.com/store";
const DEFAULT_SOLID_GOLD_APP_STORE_URL = "https://www.apple.com/app-store/";
const DEFAULT_PLACEHOLDER_BASE_URL = "https://placehold.co/600x400";

export const LIVE_QUOTE_SOCKET_URL =
  process.env.LIVE_QUOTE_SOCKET_URL ?? DEFAULT_LIVE_QUOTE_SOCKET_URL;

export const PUBLIC_LIVE_QUOTE_SOCKET_URL =
  process.env.NEXT_PUBLIC_LIVE_QUOTE_SOCKET_URL ??
  DEFAULT_LIVE_QUOTE_SOCKET_URL;

export const PUBLIC_FRAMER_IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_FRAMER_IMAGE_BASE_URL ??
  DEFAULT_FRAMER_IMAGE_BASE_URL;

export const NEWS_API_URL = process.env.NEWS_API_URL ?? DEFAULT_NEWS_API_URL;

export const NEWS_API_TOKEN = process.env.NEWS_API_TOKEN ?? "";

export const NEWS_PORTAL_BASE_URL =
  process.env.NEWS_PORTAL_BASE_URL ?? DEFAULT_NEWS_PORTAL_BASE_URL;

export const PRODUCT_API_URL =
  process.env.PRODUCT_API_URL ?? DEFAULT_PRODUCT_API_URL;

export const PRODUCT_PORTAL_BASE_URL =
  process.env.PRODUCT_PORTAL_BASE_URL ?? DEFAULT_PRODUCT_PORTAL_BASE_URL;

export const BANNER_API_URL =
  process.env.BANNER_API_URL ?? DEFAULT_BANNER_API_URL;

export const BANNER_IMAGE_BASE_URL =
  process.env.BANNER_IMAGE_BASE_URL ?? DEFAULT_BANNER_IMAGE_BASE_URL;

export const HISTORICAL_DATA_API_URL =
  process.env.HISTORICAL_DATA_API_URL ?? DEFAULT_HISTORICAL_DATA_API_URL;

export const HISTORICAL_DATA_API_TOKEN =
  process.env.HISTORICAL_DATA_API_TOKEN ?? DEFAULT_HISTORICAL_DATA_API_TOKEN;

export const ECONOMIC_CALENDAR_API_BASE_URL =
  process.env.ECONOMIC_CALENDAR_API_BASE_URL ??
  DEFAULT_ECONOMIC_CALENDAR_API_BASE_URL;

export const PUBLIC_PLACEHOLDER_BASE_URL =
  process.env.NEXT_PUBLIC_PLACEHODER_BASE_URL ?? DEFAULT_PLACEHOLDER_BASE_URL;

export const PUBLIC_LOGIN_URL =
  process.env.NEXT_PUBLIC_LOGIN_URL ?? DEFAULT_LOGIN_URL;

export const PUBLIC_REGISTER_URL =
  process.env.NEXT_PUBLIC_REGISTER_URL ?? DEFAULT_REGISTER_URL;

export const PUBLIC_HERO_CTA_URL =
  process.env.NEXT_PUBLIC_HERO_CTA_URL ?? DEFAULT_HERO_CTA_URL;

export const PUBLIC_SPREAD_CTA_URL =
  process.env.NEXT_PUBLIC_SPREAD_CTA_URL ?? DEFAULT_SPREAD_CTA_URL;

export const PUBLIC_SOLID_GOLD_PLAY_STORE_URL =
  process.env.NEXT_PUBLIC_SOLID_GOLD_PLAY_STORE_URL ??
  DEFAULT_SOLID_GOLD_PLAY_STORE_URL;

export const PUBLIC_SOLID_GOLD_APP_STORE_URL =
  process.env.NEXT_PUBLIC_SOLID_GOLD_APP_STORE_URL ??
  DEFAULT_SOLID_GOLD_APP_STORE_URL;

function buildAssetUrl(baseUrl: string, assetPath: string) {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
  const normalizedAssetPath = assetPath.replace(/^\/+/, "");

  return `${normalizedBaseUrl}/${normalizedAssetPath}`;
}

export function getFramerImageUrl(assetPath: string) {
  return buildAssetUrl(PUBLIC_FRAMER_IMAGE_BASE_URL, assetPath);
}

export function getNewsAssetUrl(assetPath: string) {
  if (/^https?:\/\//i.test(assetPath)) {
    return assetPath;
  }

  return buildAssetUrl(NEWS_PORTAL_BASE_URL, assetPath);
}

export function getProductAssetUrl(assetPath: string) {
  if (/^https?:\/\//i.test(assetPath)) {
    return assetPath;
  }

  return buildAssetUrl(PRODUCT_PORTAL_BASE_URL, assetPath);
}
