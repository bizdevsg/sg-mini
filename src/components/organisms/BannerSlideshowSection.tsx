import { BannerSlideshow } from "@/components/molecules/BannerSlideshow";
import { getBannerRecords } from "@/lib/banner";
import type { AppLocale } from "@/locales";

type BannerSlideshowSectionProps = {
  locale: AppLocale;
};

export async function BannerSlideshowSection({
  locale,
}: BannerSlideshowSectionProps) {
  const banners = await getBannerRecords();

  if (!banners.length) {
    return null;
  }

  return (
    <section className="bg-transparent mb-20">
      <BannerSlideshow banners={banners} locale={locale} />
    </section>
  );
}
