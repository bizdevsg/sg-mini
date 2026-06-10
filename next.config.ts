import type { NextConfig } from "next";

const framerImageBaseUrl = new URL(
  process.env.NEXT_PUBLIC_FRAMER_IMAGE_BASE_URL ??
    "https://framerusercontent.com/images",
);
const cdnAssetBaseUrl = new URL(
  process.env.NEXT_PUBLIC_CDN_ASSET_BASE_URL ??
    "https://cdn.pandalingua.my.id/sgb/assets",
);
const newsPortalBaseUrl = new URL(
  process.env.NEWS_PORTAL_BASE_URL ?? "https://portalnews.newsmaker.id",
);
const imgPlaceholder = new URL(
  process.env.NEXT_PUBLIC_PLACEHODER_BASE_URL ?? "https://placehold.co/600x400",
);

const nextConfig: NextConfig = {
  htmlLimitedBots: /.*/,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: framerImageBaseUrl.protocol.replace(":", "") as "https",
        hostname: framerImageBaseUrl.hostname,
        pathname: `${framerImageBaseUrl.pathname.replace(/\/$/, "")}/**`,
      },
      {
        protocol: cdnAssetBaseUrl.protocol.replace(":", "") as "https",
        hostname: cdnAssetBaseUrl.hostname,
        pathname: `${cdnAssetBaseUrl.pathname.replace(/\/$/, "")}/**`,
      },
      {
        protocol: newsPortalBaseUrl.protocol.replace(":", "") as "https",
        hostname: newsPortalBaseUrl.hostname,
        pathname: `${newsPortalBaseUrl.pathname.replace(/\/$/, "")}/**`,
      },
      {
        protocol: imgPlaceholder.protocol.replace(":", "") as "https",
        hostname: imgPlaceholder.hostname,
        pathname: `${imgPlaceholder.pathname.replace(/\/$/, "")}/**`,
      },
    ],
  },
};

export default nextConfig;
