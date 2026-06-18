const DEFAULT_LIVE_QUOTE_SOCKET_URL = "wss://wsprc.royalassetindo.co.id";
const DEFAULT_CDN_ASSET_BASE_URL = "/assets";
const DEFAULT_FRAMER_IMAGE_BASE_URL = "https://framerusercontent.com/images";
const DEFAULT_NEWS_API_URL = "https://portalnews.newsmaker.id/api/v1/berita";
const DEFAULT_NEWS_PORTAL_BASE_URL = "https://portalnews.newsmaker.id";
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
const DEFAULT_SPREAD_CTA_URL = "https://mifx.com/";
const DEFAULT_SOLID_GOLD_PLAY_STORE_URL = "https://play.google.com/store";
const DEFAULT_SOLID_GOLD_APP_STORE_URL = "https://www.apple.com/app-store/";
const DEFAULT_PLACEHOLDER_BASE_URL = "https://placehold.co/600x400";

export const LIVE_QUOTE_SOCKET_URL =
  process.env.LIVE_QUOTE_SOCKET_URL ?? DEFAULT_LIVE_QUOTE_SOCKET_URL;

export const PUBLIC_LIVE_QUOTE_SOCKET_URL =
  process.env.NEXT_PUBLIC_LIVE_QUOTE_SOCKET_URL ??
  DEFAULT_LIVE_QUOTE_SOCKET_URL;

export const PUBLIC_CDN_ASSET_BASE_URL = DEFAULT_CDN_ASSET_BASE_URL;

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

const LOCAL_CDN_ASSET_MAP: Record<string, string> = {
  "bg-hero1.avif": "bg-hero1.png",
  "logo-komdigi.avif": "logo-komdigi.png",
  "logo%20TSI.avif": "logo TSI.png",
  "Logo-BI.avif": "Logo-BI.png",
  "f6de89c6-20f7-43e5-87b2-170199c45ec7.avif":
    "f6de89c6-20f7-43e5-87b2-170199c45ec7.png",
  "69cf4915-3cbc-48db-b8ea-2cc80c25e463.avif":
    "69cf4915-3cbc-48db-b8ea-2cc80c25e463.png",
  "17a99617-1747-42ed-a450-2d0acb17aaa0.avif":
    "17a99617-1747-42ed-a450-2d0acb17aaa0.png",
  "e9701fbd-3376-430c-9da2-496f090aecce.avif":
    "e9701fbd-3376-430c-9da2-496f090aecce.png",
  "aed38b4d-ca53-447c-8250-59a03a7ea4eb.avif":
    "aed38b4d-ca53-447c-8250-59a03a7ea4eb.png",
  "6b4283d4-5ae9-43be-94dc-25c845136019.avif":
    "6b4283d4-5ae9-43be-94dc-25c845136019.png",
  "0be6b5d6-eeda-4236-92c9-a1e119e30523.avif":
    "0be6b5d6-eeda-4236-92c9-a1e119e30523.png",
};

function resolveLocalCdnAssetPath(assetPath: string) {
  const normalizedAssetPath = assetPath.replace(/^\/+/, "");
  const decodedAssetPath = decodeURIComponent(normalizedAssetPath);

  if (LOCAL_CDN_ASSET_MAP[normalizedAssetPath]) {
    return LOCAL_CDN_ASSET_MAP[normalizedAssetPath];
  }

  if (LOCAL_CDN_ASSET_MAP[decodedAssetPath]) {
    return LOCAL_CDN_ASSET_MAP[decodedAssetPath];
  }

  return decodedAssetPath;
}

export function getCdnAssetUrl(assetPath: string) {
  return buildAssetUrl(
    PUBLIC_CDN_ASSET_BASE_URL,
    resolveLocalCdnAssetPath(assetPath),
  );
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
