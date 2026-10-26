import { SectionContainer } from "@/components/atoms/SectionContainer";
import { PlayStorePreviewCarousel } from "@/components/molecules/PlayStorePreviewCarousel";
import type { SolidGoldAppPageContent } from "@/locales";
import { ScrollReveal } from "../molecules/ScrollReveal";

type SolidGoldAppDownloadSectionProps = {
  benefitsTitle: string;
  benefitsDescription?: string;
  benefits: Array<{
    title: string;
    description: string;
  }>;
  preview: SolidGoldAppPageContent["preview"];
};

type PlayStoreImage = {
  assets: string;
};

const IMAGE_PLAY_STORE: PlayStoreImage[] = [
  {
    assets: "/assets/play-store/Artboard-1.png",
  },
  {
    assets: "/assets/play-store/Artboard-2.png",
  },
  {
    assets: "/assets/play-store/Artboard-3.png",
  },
  {
    assets: "/assets/play-store/Artboard-4.png",
  },
  {
    assets: "/assets/play-store/Artboard-5.png",
  },
];

export function SolidGoldAppDownloadSection({
  benefitsTitle,
  benefitsDescription,
  benefits,
  preview,
}: SolidGoldAppDownloadSectionProps) {
  const previewImages = IMAGE_PLAY_STORE.map((image, index) => ({
    alt: preview.imageAlts[index] ?? "",
    src: image.assets,
  }));

  return (
    <>
      <section className="border-b border-white/6">
        <PlayStorePreviewCarousel
          ariaLabel={preview.ariaLabel}
          images={previewImages}
          nextLabel={preview.nextLabel}
          previousLabel={preview.previousLabel}
        />
      </section>

      <SectionContainer className="py-16 md:py-20">
        <div className="mx-auto">
          <div className="grid gap-12 lg:grid-cols-[1fr_2fr] items-start">
            {/* Judul di sebelah kiri (Sticky on Desktop) */}
            <ScrollReveal effect="fade-right">
              <div className="lg:sticky lg:top-10 lg:col-span-1">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {benefitsTitle}
                </h2>
                {benefitsDescription && (
                  <p className="mt-4 text-sm leading-6 text-zinc-400">
                    {benefitsDescription}
                  </p>
                )}
              </div>
            </ScrollReveal>

            {/* List di sebelah kanan */}
            <div className="divide-y divide-zinc-800/60">
              {benefits.map((benefit, index) => (
                <ScrollReveal
                  key={benefit.title}
                  delay={index * 150}
                  className="group py-6 first:pt-0 last:pb-0 flex gap-6 items-start transition-all"
                >
                  <span className="text-sm font-mono text-amber-500 font-semibold pt-1">
                    ({String(index + 1).padStart(2, "0")})
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-amber-400 transition-colors duration-200">
                      {benefit.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                      {benefit.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </SectionContainer>
    </>
  );
}
