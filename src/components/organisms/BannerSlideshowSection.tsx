import { getBannerRecords } from "@/app/api/_data/banner";
import { BannerSlideshow } from "@/components/molecules/BannerSlideshow";

export async function BannerSlideshowSection() {
  const banners = await getBannerRecords();

  if (!banners.length) {
    return null;
  }

  return (
    <section className="bg-transparent">
      <BannerSlideshow banners={banners} />
    </section>
  );
}
