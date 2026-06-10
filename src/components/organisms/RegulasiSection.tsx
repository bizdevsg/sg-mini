import { SectionContainer } from "@/components/atoms/SectionContainer";
import { SectionEyebrow } from "@/components/atoms/SectionEyebrow";
import { regulatorLogos } from "@/components/content/landing-content";
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
        <div className="mx-auto max-w-3xl text-center">
          <SectionEyebrow className="justify-center text-yellow-500">
            {regulation.eyebrow}
          </SectionEyebrow>

          <h2 className="mt-5 text-3xl font-bold text-white md:text-4xl">
            {regulation.title}
            <span className="text-yellow-500">
              {" "}
              {regulation.highlightedTitle}
            </span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-zinc-300 sm:text-base">
            {regulation.description}
          </p>
        </div>

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
