import { existsSync } from "node:fs";
import path from "node:path";

import type { NextConfig } from "next";

// Shared env lives in the repo-root .env (one file instead of one per app).
// Next.js only auto-loads env files from this app's own folder, so pull the root
// file in here. `loadEnvFile` never overrides a variable that is already set, so
// apps/<app>/.env.local (loaded by Next first) still wins, and in Docker/CI the
// root .env does not exist (see .dockerignore) — the guard makes that a no-op.
const sharedEnvPath = path.resolve(process.cwd(), "..", "..", ".env");

if (existsSync(sharedEnvPath)) {
  process.loadEnvFile(sharedEnvPath);
}

const DEFAULT_SG_ADMIN_ORIGIN = "https://sg-admin.sg-berjangka.com";

function getProtocol(url: URL) {
  return url.protocol.replace(":", "") as "http" | "https";
}

function parseUrlEnv(value: string | undefined, fallback: string) {
  const normalizedValue = value?.trim();

  return new URL(normalizedValue || fallback);
}

function parseAllowedOrigins(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

const framerImageBaseUrl = parseUrlEnv(
  process.env.NEXT_PUBLIC_FRAMER_IMAGE_BASE_URL,
  "https://framerusercontent.com/images",
);
const newsPortalBaseUrl = parseUrlEnv(
  process.env.NEWS_PORTAL_BASE_URL,
  "http://portalnews.newsmaker.test",
);
const newsImageBaseUrl = parseUrlEnv(
  process.env.NEWS_IMAGE_BASE_URL,
  "https://portalnews.newsmaker.id",
);
const bannerImageBaseUrl = parseUrlEnv(
  process.env.BANNER_IMAGE_BASE_URL,
  `${DEFAULT_SG_ADMIN_ORIGIN}/storage/uploads/banner`,
);
const productPortalBaseUrl = parseUrlEnv(
  process.env.PRODUCT_PORTAL_BASE_URL,
  `${DEFAULT_SG_ADMIN_ORIGIN}/`,
);
const penghargaanImageBaseUrl = parseUrlEnv(
  process.env.PENGHARGAAN_IMAGE_BASE_URL,
  `${DEFAULT_SG_ADMIN_ORIGIN}/storage/uploads/penghargaan-images`,
);
const picsumBaseUrl = new URL("https://picsum.photos");
const imgPlaceholder = parseUrlEnv(
  process.env.NEXT_PUBLIC_PLACEHODER_BASE_URL,
  "https://placehold.co/600x400",
);
const solidGoldImageBaseUrl = parseUrlEnv(
  process.env.NEXT_PUBLIC_SOLID_GOLD_IMAGE_BASE_URL,
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
const clientAreaBaseUrl = (
  process.env.NEXT_PUBLIC_CLIENT_SITE_URL?.trim() ||
  "https://client-mini.sg-berjangka.com"
).replace(/\/+$/, "");
const deploymentId = process.env.DEPLOYMENT_VERSION?.trim() || undefined;
const isVercelDeployment = process.env.VERCEL === "1";

const nextConfig: NextConfig = {
  // Vercel packages Next.js deployments itself. Keeping standalone for other
  // environments avoids a Next.js 16.3 adapter regression on Vercel that
  // omits .next/next-server.js.nft.json during the packaging step.
  output: isVercelDeployment ? undefined : "standalone",
  deploymentId,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          ...(process.env.NODE_ENV === "production"
            ? [
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=31536000; includeSubDomains",
                },
              ]
            : []),
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: `/${DEFAULT_LOCALE}`,
        permanent: false,
      },
      {
        source: "/:locales(id|en)/client-area",
        destination: `${clientAreaBaseUrl}/:locales/client-area`,
        permanent: false,
      },
      {
        source: "/:locales(id|en)/client-area/:path*",
        destination: `${clientAreaBaseUrl}/:locales/client-area/:path*`,
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
    // The client-area remote pattern's hostname always comes from our own
    // NEXT_PUBLIC_CLIENT_SITE_URL env var (never user input), so allowing a
    // local/private-IP resolution here — dev's localhost, or the Docker
    // compose internal network — carries no real SSRF risk.
    dangerouslyAllowLocalIP: true,
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
      {
        protocol: getProtocol(new URL(clientAreaBaseUrl)),
        hostname: new URL(clientAreaBaseUrl).hostname,
        port: new URL(clientAreaBaseUrl).port,
        pathname: "/assets/**",
      },
    ],
  },
};

export default nextConfig;
