const DEFAULT_LIVE_QUOTE_SOCKET_URL = "wss://wsprc.royalassetindo.co.id";
const DEFAULT_FRAMER_IMAGE_BASE_URL = "https://framerusercontent.com/images";
const DEFAULT_NEWS_API_URL = "http://portalnews.newsmaker.test/api/v1/berita";
const DEFAULT_NEWS_PORTAL_BASE_URL = "http://portalnews.newsmaker.test";
const DEFAULT_NEWS_IMAGE_BASE_URL = "https://portalnews.newsmaker.id";
const DEFAULT_SG_ADMIN_ORIGIN = "https://sg-admin.sg-berjangka.com";
const DEFAULT_SG_ADMIN_LEGACY_ORIGIN = "http://sg-admin.test";
const DEFAULT_SG_ADMIN_API_BASE_URL = `${DEFAULT_SG_ADMIN_ORIGIN}/api/v1`;
const DEFAULT_EBOOK_CATEGORY_API_URL =
  `${DEFAULT_SG_ADMIN_API_BASE_URL}/ebook/categories`;
const DEFAULT_PRODUCT_API_URL = `${DEFAULT_SG_ADMIN_API_BASE_URL}/produk`;
const DEFAULT_PRODUCT_PORTAL_BASE_URL = `${DEFAULT_SG_ADMIN_ORIGIN}/`;
const DEFAULT_BANNER_API_URL = `${DEFAULT_SG_ADMIN_API_BASE_URL}/banner`;
const DEFAULT_BANNER_DETAIL_API_URL = `${DEFAULT_SG_ADMIN_API_BASE_URL}/banner`;
const DEFAULT_BANNER_IMAGE_BASE_URL =
  `${DEFAULT_SG_ADMIN_ORIGIN}/storage/uploads/banner`;
const DEFAULT_PENGHARGAAN_API_URL =
  `${DEFAULT_SG_ADMIN_API_BASE_URL}/penghargaan`;
const DEFAULT_PENGHARGAAN_IMAGE_BASE_URL =
  `${DEFAULT_SG_ADMIN_ORIGIN}/storage/uploads/penghargaan-images`;
const DEFAULT_PENGUMUMAN_API_URL =
  `${DEFAULT_SG_ADMIN_API_BASE_URL}/pengumuman`;
const DEFAULT_CONTACT_MESSAGE_API_URL =
  `${DEFAULT_SG_ADMIN_API_BASE_URL}/massages`;
const DEFAULT_COMPANY_PROFILE_API_URL =
  `${DEFAULT_SG_ADMIN_API_BASE_URL}/company-profile`;
const DEFAULT_LEGALITAS_API_URL =
  `${DEFAULT_SG_ADMIN_API_BASE_URL}/legalitas`;
const DEFAULT_HISTORICAL_DATA_API_URL =
  "https://portalnews.newsmaker.id/api/v1/newsmaker/historical-data";
const DEFAULT_HISTORICAL_DATA_API_TOKEN = "NM23-8f0f24b4d56af1c3";
const DEFAULT_ECONOMIC_CALENDAR_API_BASE_URL =
  "https://endpoapi-production-3202.up.railway.app/api/calendar";
const DEFAULT_FRANKFURTER_API_URL = "https://api.frankfurter.dev/v1/latest";
const DEFAULT_LOGIN_URL = "https://etrade.sgberjangka.com/login";
const DEFAULT_REGISTER_URL = "https://regol.solidgold.co.id/";
const DEFAULT_HERO_CTA_URL = "https://sg-berjangka.com/";
const DEFAULT_SPREAD_CTA_URL = "https://sg-berjangka.com/";
const DEFAULT_SOLID_GOLD_PLAY_STORE_URL = "https://play.google.com/store";
const DEFAULT_SOLID_GOLD_APP_STORE_URL = "https://www.apple.com/app-store/";
const DEFAULT_PLACEHOLDER_BASE_URL = "https://placehold.co/600x400";
const DEFAULT_SITE_URL = "https://sg-berjangka.com";

export type AppEnvMode = "dev" | "prod" | "dev-deploy";
const DEFAULT_APP_ENV: AppEnvMode = "dev";

function normalizeAppEnvMode(value: string | undefined): AppEnvMode {
  const normalizedValue = value?.trim().toLowerCase();

  if (
    normalizedValue === "dev" ||
    normalizedValue === "prod" ||
    normalizedValue === "dev-deploy"
  ) {
    return normalizedValue;
  }

  return DEFAULT_APP_ENV;
}

export const APP_ENV = normalizeAppEnvMode(process.env.APP_ENV);
export const USE_DUMMY_API_DATA = APP_ENV === "dev-deploy";

export const LIVE_QUOTE_SOCKET_URL =
  process.env.LIVE_QUOTE_SOCKET_URL ?? DEFAULT_LIVE_QUOTE_SOCKET_URL;

function normalizePublicLiveQuoteSocketUrl(value: string | undefined) {
  const normalizedValue = value?.trim();

  if (
    !normalizedValue ||
    normalizedValue === "$LIVE_QUOTE_SOCKET_URL" ||
    normalizedValue === "${LIVE_QUOTE_SOCKET_URL}"
  ) {
    return LIVE_QUOTE_SOCKET_URL;
  }

  return normalizedValue;
}

export const PUBLIC_LIVE_QUOTE_SOCKET_URL =
  normalizePublicLiveQuoteSocketUrl(
    process.env.NEXT_PUBLIC_LIVE_QUOTE_SOCKET_URL,
  );

export const PUBLIC_FRAMER_IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_FRAMER_IMAGE_BASE_URL ??
  DEFAULT_FRAMER_IMAGE_BASE_URL;

export const NEWS_API_URL = process.env.NEWS_API_URL ?? DEFAULT_NEWS_API_URL;

export const NEWS_API_TOKEN = process.env.NEWS_API_TOKEN ?? "";

export const NEWS_PORTAL_BASE_URL =
  process.env.NEWS_PORTAL_BASE_URL ?? DEFAULT_NEWS_PORTAL_BASE_URL;

export const NEWS_IMAGE_BASE_URL =
  process.env.NEWS_IMAGE_BASE_URL ?? DEFAULT_NEWS_IMAGE_BASE_URL;

export const PRODUCT_API_URL =
  process.env.PRODUCT_API_URL ?? DEFAULT_PRODUCT_API_URL;

export const EBOOK_CATEGORY_API_URL =
  process.env.EBOOK_CATEGORY_API_URL ?? DEFAULT_EBOOK_CATEGORY_API_URL;

export const PRODUCT_PORTAL_BASE_URL =
  process.env.PRODUCT_PORTAL_BASE_URL ?? DEFAULT_PRODUCT_PORTAL_BASE_URL;

export const BANNER_API_URL =
  process.env.BANNER_API_URL ?? DEFAULT_BANNER_API_URL;

export const BANNER_DETAIL_API_URL =
  process.env.BANNER_DETAIL_API_URL ?? DEFAULT_BANNER_DETAIL_API_URL;

export const BANNER_IMAGE_BASE_URL =
  process.env.BANNER_IMAGE_BASE_URL ?? DEFAULT_BANNER_IMAGE_BASE_URL;

export const PENGHARGAAN_API_URL =
  process.env.PENGHARGAAN_API_URL ?? DEFAULT_PENGHARGAAN_API_URL;

export const PENGHARGAAN_IMAGE_BASE_URL =
  process.env.PENGHARGAAN_IMAGE_BASE_URL ??
  DEFAULT_PENGHARGAAN_IMAGE_BASE_URL;

export const PENGUMUMAN_API_URL =
  process.env.PENGUMUMAN_API_URL ?? DEFAULT_PENGUMUMAN_API_URL;

export const CONTACT_MESSAGE_API_URL =
  process.env.CONTACT_MESSAGE_API_URL ?? DEFAULT_CONTACT_MESSAGE_API_URL;

export const COMPANY_PROFILE_API_URL =
  process.env.COMPANY_PROFILE_API_URL ?? DEFAULT_COMPANY_PROFILE_API_URL;

export const LEGALITAS_API_URL =
  process.env.LEGALITAS_API_URL ?? DEFAULT_LEGALITAS_API_URL;

export const HISTORICAL_DATA_API_URL =
  process.env.HISTORICAL_DATA_API_URL ?? DEFAULT_HISTORICAL_DATA_API_URL;

export const HISTORICAL_DATA_API_TOKEN =
  process.env.HISTORICAL_DATA_API_TOKEN ?? DEFAULT_HISTORICAL_DATA_API_TOKEN;

export const ECONOMIC_CALENDAR_API_BASE_URL =
  process.env.ECONOMIC_CALENDAR_API_BASE_URL ??
  DEFAULT_ECONOMIC_CALENDAR_API_BASE_URL;

export const FRANKFURTER_API_URL =
  process.env.FRANKFURTER_API_URL ?? DEFAULT_FRANKFURTER_API_URL;

export const PUBLIC_PLACEHOLDER_BASE_URL =
  process.env.NEXT_PUBLIC_PLACEHODER_BASE_URL ?? DEFAULT_PLACEHOLDER_BASE_URL;

export const PUBLIC_LOGIN_URL =
  process.env.NEXT_PUBLIC_LOGIN_URL ?? DEFAULT_LOGIN_URL;

export const PUBLIC_REGISTER_URL =
  process.env.NEXT_PUBLIC_REGISTER_URL ?? DEFAULT_REGISTER_URL;

export const PUBLIC_RECAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim() ?? "";

export const RECAPTCHA_SECRET_KEY =
  process.env.RECAPTCHA_SECRET_KEY?.trim() ?? "";

export const PUBLIC_HERO_CTA_URL =
  process.env.NEXT_PUBLIC_HERO_CTA_URL ?? DEFAULT_HERO_CTA_URL;

export const PUBLIC_SPREAD_CTA_URL =
  process.env.NEXT_PUBLIC_SPREAD_CTA_URL ?? DEFAULT_SPREAD_CTA_URL;

function normalizePublicSiteUrl(value: string | undefined) {
  const normalizedValue = value?.trim();

  if (!normalizedValue) {
    return DEFAULT_SITE_URL;
  }

  try {
    return new URL(normalizedValue).origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export const PUBLIC_SITE_URL = normalizePublicSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL ?? PUBLIC_HERO_CTA_URL,
);

export const PUBLIC_SOLID_GOLD_PLAY_STORE_URL =
  process.env.NEXT_PUBLIC_SOLID_GOLD_PLAY_STORE_URL ??
  DEFAULT_SOLID_GOLD_PLAY_STORE_URL;

export const PUBLIC_SOLID_GOLD_APP_STORE_URL =
  process.env.NEXT_PUBLIC_SOLID_GOLD_APP_STORE_URL ??
  DEFAULT_SOLID_GOLD_APP_STORE_URL;

function isAbsoluteHttpUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

function buildAssetUrl(baseUrl: string, assetPath: string) {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
  const normalizedAssetPath = assetPath.replace(/^\/+/, "");

  return `${normalizedBaseUrl}/${normalizedAssetPath}`;
}

function getAssetOrigin(baseUrl: string) {
  try {
    return new URL(baseUrl).origin;
  } catch {
    return baseUrl;
  }
}

function isSameHostname(left: string, right: string) {
  return left.trim().toLowerCase() === right.trim().toLowerCase();
}

function getActiveSgAdminOrigin() {
  return getAssetOrigin(PRODUCT_PORTAL_BASE_URL);
}

function isSgAdminHostname(hostname: string) {
  try {
    const activeHostname = new URL(getActiveSgAdminOrigin()).hostname;
    const defaultHostname = new URL(DEFAULT_SG_ADMIN_ORIGIN).hostname;
    const legacyHostname = new URL(DEFAULT_SG_ADMIN_LEGACY_ORIGIN).hostname;

    return (
      isSameHostname(hostname, activeHostname) ||
      isSameHostname(hostname, defaultHostname) ||
      isSameHostname(hostname, legacyHostname)
    );
  } catch {
    return false;
  }
}

export function isSgAdminUrl(assetUrl: string) {
  try {
    return isSgAdminHostname(new URL(assetUrl).hostname);
  } catch {
    return false;
  }
}

export function normalizeSgAdminUrl(assetUrl: string) {
  const normalizedAssetUrl = assetUrl.trim();

  if (!normalizedAssetUrl || !isAbsoluteHttpUrl(normalizedAssetUrl)) {
    return normalizedAssetUrl;
  }

  try {
    const parsedUrl = new URL(normalizedAssetUrl);

    if (!isSgAdminHostname(parsedUrl.hostname)) {
      return normalizedAssetUrl;
    }

    const normalizedUrl = new URL(
      `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`,
      getActiveSgAdminOrigin(),
    );

    return normalizedUrl.toString();
  } catch {
    return normalizedAssetUrl;
  }
}

function resolveAssetUrl(baseUrl: string, assetPath: string) {
  const normalizedAssetPath = assetPath.trim();

  if (!normalizedAssetPath) {
    return "";
  }

  if (isAbsoluteHttpUrl(normalizedAssetPath)) {
    return normalizeSgAdminUrl(normalizedAssetPath);
  }

  if (normalizedAssetPath.startsWith("/")) {
    return `${getAssetOrigin(baseUrl)}${normalizedAssetPath}`;
  }

  return buildAssetUrl(baseUrl, normalizedAssetPath);
}

export function getImageProxyUrl(assetUrl: string) {
  const normalizedAssetUrl = normalizeSgAdminUrl(assetUrl.trim());

  if (!normalizedAssetUrl) {
    return "";
  }

  const encodedAssetUrl = Buffer.from(normalizedAssetUrl, "utf8").toString(
    "base64url",
  );

  return `/api/image-proxy/${encodedAssetUrl}`;
}

const IMAGE_PROXY_ALLOWED_HOSTS = new Set(
  [
    PUBLIC_FRAMER_IMAGE_BASE_URL,
    NEWS_PORTAL_BASE_URL,
    NEWS_IMAGE_BASE_URL,
    PRODUCT_PORTAL_BASE_URL,
    BANNER_IMAGE_BASE_URL,
    PENGHARGAAN_IMAGE_BASE_URL,
    PENGUMUMAN_API_URL,
    PUBLIC_PLACEHOLDER_BASE_URL,
  ]
    .map((value) => {
      try {
        return new URL(value).hostname;
      } catch {
        return null;
      }
    })
    .filter((value): value is string => Boolean(value)),
);

export function isAllowedImageProxySource(assetUrl: string) {
  try {
    const parsedUrl = new URL(normalizeSgAdminUrl(assetUrl));

    return (
      (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") &&
      IMAGE_PROXY_ALLOWED_HOSTS.has(parsedUrl.hostname)
    );
  } catch {
    return false;
  }
}

export function getFramerImageUrl(assetPath: string) {
  return buildAssetUrl(PUBLIC_FRAMER_IMAGE_BASE_URL, assetPath);
}

export function getNewsAssetUrl(assetPath: string) {
  return getImageProxyUrl(resolveAssetUrl(NEWS_IMAGE_BASE_URL, assetPath));
}

export function getProductAssetUrl(assetPath: string) {
  return getImageProxyUrl(resolveAssetUrl(PRODUCT_PORTAL_BASE_URL, assetPath));
}

export function getBannerAssetUrl(assetPath: string) {
  return getImageProxyUrl(resolveAssetUrl(BANNER_IMAGE_BASE_URL, assetPath));
}

export function getPenghargaanAssetUrl(assetPath: string) {
  return getImageProxyUrl(
    resolveAssetUrl(PENGHARGAAN_IMAGE_BASE_URL, assetPath),
  );
}

export function getPengumumanAssetUrl(assetPath: string) {
  return getImageProxyUrl(
    resolveAssetUrl(getAssetOrigin(PENGUMUMAN_API_URL), assetPath),
  );
}
