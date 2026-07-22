import { SectionContainer } from "@/components/atoms/SectionContainer";
import { regulatorLogos } from "@/types/landing";
import { SectionIntro } from "@/components/molecules/SectionIntro";
import { RegulatorLogoItem } from "@/components/molecules/RegulatorLogoItem";
import { getMessages, type AppLocale } from "@/locales";
import { ScrollReveal } from "../molecules/ScrollReveal";

type RegulasiSectionProps = {
  locale: AppLocale;
};

export default function RegulasiSection({ locale }: RegulasiSectionProps) {
  const { regulation } = getMessages(locale).aboutPage;

  return (
    <section className="bg-zinc-900/40">
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
          {regulatorLogos.map((logo, index) => (
            <ScrollReveal effect="fade-up" delay={index * 250}
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
            </ScrollReveal>
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}
