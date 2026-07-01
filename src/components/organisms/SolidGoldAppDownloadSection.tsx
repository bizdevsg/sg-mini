import { SectionContainer } from "@/components/atoms/SectionContainer";
import { regulatorLogos } from "@/types/landing";
import { RegulatorLogoItem } from "../molecules/RegulatorLogoItem";

type SolidGoldAppDownloadSectionProps = {
  benefitsTitle: string;
  benefitsDescription?: string;
  benefits: Array<{
    title: string;
    description: string;
  }>;
};

export function SolidGoldAppDownloadSection({
  benefitsTitle,
  benefitsDescription,
  benefits,
}: SolidGoldAppDownloadSectionProps) {
  const trustedLogos = regulatorLogos.slice(0, 6);

  return (
    <>
      <div className="bg-linear-to-b from-black to-transparent">
        <SectionContainer className="pt-16 md:pt-20 ">
          <p className="text-center text-xs font-semibold tracking-widest text-zinc-500 uppercase">
            Didukung dalam ekosistem lembaga terkait
          </p>
          <div className="mx-auto mt-8 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-6">
            {trustedLogos.map((logo) => (
              <div
                key={logo.alt}
                className="flex min-h-28 items-center justify-center rounded-2xl border border-yellow-500/15 bg-black/20 px-5 py-6 transition-colors duration-300 hover:border-yellow-500/35 hover:bg-yellow-500/[0.06]"
              >
                <RegulatorLogoItem
                  logo={logo}
                  priority
                  useFill
                  sizes="(max-width: 768px) 140px, (max-width: 1280px) 160px, 180px"
                  imageClassName="object-contain opacity-80"
                  containerClassName="h-12 w-full max-w-[9rem] sm:h-14 sm:max-w-[10rem] md:h-16 md:max-w-[11rem]"
                />
              </div>
            ))}
          </div>
        </SectionContainer>
      </div>

      <SectionContainer className="py-16 md:py-20">
        <div className="mx-auto">
          <div className="grid gap-12 lg:grid-cols-[1fr_2fr] items-start">
            {/* Judul di sebelah kiri (Sticky on Desktop) */}
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

            {/* List di sebelah kanan */}
            <div className="divide-y divide-zinc-800/60">
              {benefits.map((benefit, index) => (
                <div
                  key={benefit.title}
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionContainer>
    </>
  );
}
