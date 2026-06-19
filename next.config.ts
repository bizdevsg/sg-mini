import type { NextConfig } from "next";

function getProtocol(url: URL) {
  return url.protocol.replace(":", "") as "http" | "https";
}

const framerImageBaseUrl = new URL(
  process.env.NEXT_PUBLIC_FRAMER_IMAGE_BASE_URL ??
    "https://framerusercontent.com/images",
);
const newsPortalBaseUrl = new URL(
  process.env.NEWS_PORTAL_BASE_URL ?? "http://portalnews.newsmaker.test",
);
const bannerImageBaseUrl = new URL(
  process.env.BANNER_IMAGE_BASE_URL ??
    "http://sg-admin.test/storage/banner-images",
);
const imgPlaceholder = new URL(
  process.env.NEXT_PUBLIC_PLACEHODER_BASE_URL ?? "https://placehold.co/600x400",
);
const solidGoldImageBaseUrl = new URL(
  process.env.NEXT_PUBLIC_SOLID_GOLD_IMAGE_BASE_URL ??
    "https://sg-berjangka.com/_next/image",
);

const nextConfig: NextConfig = {
  htmlLimitedBots: /.*/,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
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
        protocol: getProtocol(bannerImageBaseUrl),
        hostname: bannerImageBaseUrl.hostname,
        pathname: `${bannerImageBaseUrl.pathname.replace(/\/$/, "")}/**`,
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
    ],
  },
};

export default nextConfig;
