import { getBannerRecords } from "@/app/api/_data/banner";
import { BannerSlideshow } from "@/components/molecules/BannerSlideshow";
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
    <section className="bg-transparent">
      <BannerSlideshow banners={banners} locale={locale} />
    </section>
  );
}
