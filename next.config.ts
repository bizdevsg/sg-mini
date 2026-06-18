import type { NextConfig } from "next";

const framerImageBaseUrl = new URL(
  process.env.NEXT_PUBLIC_FRAMER_IMAGE_BASE_URL ??
    "https://framerusercontent.com/images",
);
const newsPortalBaseUrl = new URL(
  process.env.NEWS_PORTAL_BASE_URL ?? "https://portalnews.newsmaker.id",
);
const bannerImageBaseUrl = new URL(
  process.env.BANNER_IMAGE_BASE_URL ??
    "http://sg-admin.test/storage/banner-images",
);
const imgPlaceholder = new URL(
  process.env.NEXT_PUBLIC_PLACEHODER_BASE_URL ?? "https://placehold.co/600x400",
);
const mifxImageUrl = new URL(
  process.env.NEXT_PUBLIC_MIFX_IMAGE_BASE_URL ??
    "https://mifx.com/_next/image?url=%2Fassets%2Fimages%2Fphone-1.png&w=640&q=75",
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
        protocol: framerImageBaseUrl.protocol.replace(":", "") as "https",
        hostname: framerImageBaseUrl.hostname,
        pathname: `${framerImageBaseUrl.pathname.replace(/\/$/, "")}/**`,
      },
      {
        protocol: newsPortalBaseUrl.protocol.replace(":", "") as "https",
        hostname: newsPortalBaseUrl.hostname,
        pathname: `${newsPortalBaseUrl.pathname.replace(/\/$/, "")}/**`,
      },
      {
        protocol: bannerImageBaseUrl.protocol.replace(":", "") as "http",
        hostname: bannerImageBaseUrl.hostname,
        pathname: `${bannerImageBaseUrl.pathname.replace(/\/$/, "")}/**`,
      },
      {
        protocol: imgPlaceholder.protocol.replace(":", "") as "https",
        hostname: imgPlaceholder.hostname,
        pathname: `${imgPlaceholder.pathname.replace(/\/$/, "")}/**`,
      },
      {
        protocol: mifxImageUrl.protocol.replace(":", "") as "https",
        hostname: mifxImageUrl.hostname,
        pathname: mifxImageUrl.pathname,
      },
      {
        protocol:
          solidGoldImageBaseUrl.protocol.replace(":", "") as "https",
        hostname: solidGoldImageBaseUrl.hostname,
        pathname: solidGoldImageBaseUrl.pathname,
      },
    ],
  },
};

export default nextConfig;
