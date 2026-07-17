import type { NextConfig } from "next";

const DEFAULT_SG_ADMIN_ORIGIN = "https://sg-admin.sg-berjangka.com";

function getProtocol(url: URL) {
  return url.protocol.replace(":", "") as "http" | "https";
}

function parseAllowedOrigins(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

const framerImageBaseUrl = new URL(
  process.env.NEXT_PUBLIC_FRAMER_IMAGE_BASE_URL ??
    "https://framerusercontent.com/images",
);
const newsPortalBaseUrl = new URL(
  process.env.NEWS_PORTAL_BASE_URL ?? "http://portalnews.newsmaker.test",
);
const newsImageBaseUrl = new URL(
  process.env.NEWS_IMAGE_BASE_URL ?? "https://portalnews.newsmaker.id",
);
const bannerImageBaseUrl = new URL(
  process.env.BANNER_IMAGE_BASE_URL ??
    `${DEFAULT_SG_ADMIN_ORIGIN}/storage/uploads/banner`,
);
const productPortalBaseUrl = new URL(
  process.env.PRODUCT_PORTAL_BASE_URL ?? `${DEFAULT_SG_ADMIN_ORIGIN}/`,
);
const penghargaanImageBaseUrl = new URL(
  process.env.PENGHARGAAN_IMAGE_BASE_URL ??
    `${DEFAULT_SG_ADMIN_ORIGIN}/storage/uploads/penghargaan-images`,
);
const picsumBaseUrl = new URL("https://picsum.photos");
const imgPlaceholder = new URL(
  process.env.NEXT_PUBLIC_PLACEHODER_BASE_URL ?? "https://placehold.co/600x400",
);
const solidGoldImageBaseUrl = new URL(
  process.env.NEXT_PUBLIC_SOLID_GOLD_IMAGE_BASE_URL ??
    "https://sg-berjangka.com/_next/image",
);
const allowedLocalOrigins = Array.from(
  new Set([
    "localhost",
    "localhost:3000",
    "127.0.0.1",
    "127.0.0.1:3000",
    "::1",
    "[::1]:3000",
    newsPortalBaseUrl.hostname,
    newsImageBaseUrl.hostname,
    bannerImageBaseUrl.hostname,
    penghargaanImageBaseUrl.hostname,
  ]),
);
const allowedTunnelOrigins = [
  "*.ngrok-free.app",
  "*.ngrok.io",
  "*.loca.lt",
  "*.trycloudflare.com",
  "*.devtunnels.ms",
  "**.devtunnels.ms",
];
const allowedActionOrigins = Array.from(
  new Set([
    ...allowedLocalOrigins,
    ...allowedTunnelOrigins,
    ...parseAllowedOrigins(process.env.NEXT_ALLOWED_ORIGINS),
  ]),
);
const DEFAULT_LOCALE = "id";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: `/${DEFAULT_LOCALE}`,
        permanent: false,
      },
    ];
  },
  allowedDevOrigins: allowedActionOrigins,
  experimental: {
    serverActions: {
      allowedOrigins: allowedActionOrigins,
    },
  },
  htmlLimitedBots: /.*/,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
    localPatterns: [
      {
        pathname: "/assets/**",
      },
      {
        pathname: "/api/image-proxy",
      },
      {
        pathname: "/api/image-proxy/**",
      },
    ],
    remotePatterns: [
      {
        protocol: getProtocol(framerImageBaseUrl),
        hostname: framerImageBaseUrl.hostname,
        pathname: `${framerImageBaseUrl.pathname.replace(/\/$/, "")}/**`,
      },
      {
        protocol: getProtocol(newsPortalBaseUrl),
        hostname: newsPortalBaseUrl.hostname,
        pathname: `${newsPortalBaseUrl.pathname.replace(/\/$/, "")}/**`,
      },
      {
        protocol: getProtocol(newsImageBaseUrl),
        hostname: newsImageBaseUrl.hostname,
        pathname: `${newsImageBaseUrl.pathname.replace(/\/$/, "")}/**`,
      },
      {
        protocol: getProtocol(bannerImageBaseUrl),
        hostname: bannerImageBaseUrl.hostname,
        pathname: `${bannerImageBaseUrl.pathname.replace(/\/$/, "")}/**`,
      },
      {
        protocol: getProtocol(productPortalBaseUrl),
        hostname: productPortalBaseUrl.hostname,
        pathname: `${productPortalBaseUrl.pathname.replace(/\/$/, "")}/**`,
      },
      {
        protocol: getProtocol(penghargaanImageBaseUrl),
        hostname: penghargaanImageBaseUrl.hostname,
        pathname: `${penghargaanImageBaseUrl.pathname.replace(/\/$/, "")}/**`,
      },
      {
        protocol: getProtocol(imgPlaceholder),
        hostname: imgPlaceholder.hostname,
        pathname: `${imgPlaceholder.pathname.replace(/\/$/, "")}/**`,
      },
      {
        protocol: getProtocol(solidGoldImageBaseUrl),
        hostname: solidGoldImageBaseUrl.hostname,
        pathname: solidGoldImageBaseUrl.pathname,
      },
      {
        protocol: getProtocol(picsumBaseUrl),
        hostname: picsumBaseUrl.hostname,
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
