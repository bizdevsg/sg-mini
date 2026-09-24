"use client";

import { BannerSlideshow } from "@/components/molecules/BannerSlideshow";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";
import { useBannerRecords } from "@/hooks/useBannerRecords";
import type { BannerApiRecord } from "@/lib/banner";
import type { AppLocale } from "@/locales";

type BannerSlideshowSectionClientProps = {
  initialBanners: BannerApiRecord[];
  locale: AppLocale;
};

export function BannerSlideshowSectionClient({
  initialBanners,
  locale,
}: BannerSlideshowSectionClientProps) {
  const banners = useBannerRecords(initialBanners);

  if (!banners.length) {
    return null;
  }

  return (
    <ScrollReveal
      as="section"
      className="bg-transparent mb-10 sm:mb-16 md:mb-20"
      effect="fade-up"
    >
      <BannerSlideshow banners={banners} locale={locale} />
    </ScrollReveal>
  );
}
