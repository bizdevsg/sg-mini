import { SectionContainer } from "@/components/atoms/SectionContainer";
import { SectionEyebrow } from "@/components/atoms/SectionEyebrow";
import type { LocoLondonGoldPageContent } from "@/locales/loco-london-gold-page";

type LocoLondonGoldPageHeroProps = {
  hero: LocoLondonGoldPageContent["hero"];
};

export function LocoLondonGoldPageHero({
  hero,
}: LocoLondonGoldPageHeroProps) {
  return (
    <section
      className="relative overflow-hidden bg-cover bg-bottom bg-no-repeat pt-10"
      style={{
        backgroundImage: "url('/assets/bg-hero1.png')",
      }}
    >
      <SectionContainer className="relative py-16 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <SectionEyebrow align="center">{hero.eyebrow}</SectionEyebrow>

          <h1 className="mt-6 text-3xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            <span className="bg-linear-to-r from-yellow-400 via-yellow-500 to-amber-500 bg-clip-text text-transparent">
              {hero.title}
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-lg">
            {hero.description}
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-3 lg:gap-4">
            {hero.badges.map((badge) => (
              <div
                key={badge}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-center text-sm font-medium text-zinc-200 backdrop-blur-md"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                <span>{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}
