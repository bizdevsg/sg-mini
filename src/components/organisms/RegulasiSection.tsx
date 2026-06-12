import { SectionContainer } from "@/components/atoms/SectionContainer";
import { regulatorLogos } from "@/components/content/landing-content";
import { SectionIntro } from "@/components/molecules/SectionIntro";
import { RegulatorLogoItem } from "@/components/molecules/RegulatorLogoItem";
import { getMessages, type AppLocale } from "@/locales";

type RegulasiSectionProps = {
  locale: AppLocale;
};

export default function RegulasiSection({ locale }: RegulasiSectionProps) {
  const { regulation } = getMessages(locale).aboutPage;

  return (
    <section className="bg-zinc-900/40">
      <SectionContainer className="py-16 sm:py-20">
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

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          {regulatorLogos.map((logo) => (
            <div
              key={logo.alt}
              className="flex min-h-28 items-center justify-center rounded-2xl border border-yellow-500/15 bg-black/20 px-5 py-6 transition-colors duration-300 hover:border-yellow-500/35 hover:bg-yellow-500/[0.06]"
            >
              <RegulatorLogoItem logo={logo} priority />
            </div>
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}
