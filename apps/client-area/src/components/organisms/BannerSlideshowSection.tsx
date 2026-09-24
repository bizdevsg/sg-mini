import { BannerSlideshowSectionClient } from "@/components/organisms/BannerSlideshowSectionClient";
import { getBannerRecords } from "@/lib/banner";
import type { AppLocale } from "@/locales";

type BannerSlideshowSectionProps = {
  locale: AppLocale;
};

export async function BannerSlideshowSection({
  locale,
}: BannerSlideshowSectionProps) {
  const initialBanners = await getBannerRecords();

  return (
    <BannerSlideshowSectionClient
      initialBanners={initialBanners}
      locale={locale}
    />
  );
}
