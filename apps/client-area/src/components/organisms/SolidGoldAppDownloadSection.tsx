import { SectionContainer } from "@/components/atoms/SectionContainer";
import { SectionIntro } from "@/components/molecules/SectionIntro";
import { getMessages, type AppLocale } from "@/locales";
import { regulatorLogos } from "@/types/landing";
import { RegulatorLogoItem } from "../molecules/RegulatorLogoItem";
import { ScrollReveal } from "../molecules/ScrollReveal";

type SolidGoldAppDownloadSectionProps = {
  locale: AppLocale;
  benefitsTitle: string;
  benefitsDescription?: string;
  benefits: Array<{
    title: string;
    description: string;
  }>;
};

export function SolidGoldAppDownloadSection({
  locale,
  benefitsTitle,
  benefitsDescription,
  benefits,
}: SolidGoldAppDownloadSectionProps) {
  const { regulation } = getMessages(locale).aboutPage;
  const trustedLogos = regulatorLogos.slice(0, 6);

  return (
    <>
      <section className="border-y border-white/6 bg-zinc-900/40">
        <SectionContainer className="py-10 sm:py-16">
          <ScrollReveal>
            <SectionIntro
              align="center"
              className="mx-auto max-w-3xl"
              eyebrow={regulation.eyebrow}
              title={
                <>
                  {regulation.title}
                  <span className="text-yellow-500">
                    {" "}
                    {regulation.highlightedTitle}
                  </span>
                </>
              }
              description={regulation.description}
              eyebrowClassName="text-yellow-500"
            />
          </ScrollReveal>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
            {trustedLogos.map((logo, index) => (
              <ScrollReveal
                key={logo.alt}
                effect="fade-up"
                delay={index * 150}
                className="group flex min-h-28 items-center justify-center rounded-2xl border border-yellow-500/15 bg-black/20 px-5 py-6 shadow-[0_18px_40px_rgba(0,0,0,0.16)] transition-[transform,background-color,border-color,box-shadow] duration-500 ease-out hover:border-yellow-400/40 hover:bg-yellow-500/[0.08] hover:shadow-[0_24px_50px_rgba(234,179,8,0.12)]"
              >
                <RegulatorLogoItem
                  logo={logo}
                  priority
                  useFill
                  sizes="(max-width: 768px) 140px, (max-width: 1280px) 160px, 180px"
                  imageClassName="object-contain opacity-80"
                  containerClassName="h-12 w-full max-w-[9rem] sm:h-14 sm:max-w-[10rem] md:h-16 md:max-w-[11rem]"
                />
              </ScrollReveal>
            ))}
          </div>
        </SectionContainer>
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
