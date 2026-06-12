import { SectionContainer } from "@/components/atoms/SectionContainer";
import type { LocoLondonGoldPageContent } from "@/locales/loco-london-gold-page";

type LocoLondonGoldDerivativeSectionProps = {
  title: string;
  subtitle: string;
  derivative: LocoLondonGoldPageContent["derivative"];
};

export function LocoLondonGoldDerivativeSection({
  title,
  subtitle,
  derivative,
}: LocoLondonGoldDerivativeSectionProps) {
  return (
    <SectionContainer className="pb-16 md:pb-20">
      <div className="mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-zinc-300">
            {subtitle}
          </p>
        </div>

        <section className="rounded-[1.75rem] border border-line bg-[linear-gradient(180deg,rgba(205,161,58,0.07),rgba(10,10,10,0.88)_45%)] p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <div className="space-y-4 text-sm leading-7 text-zinc-300 sm:text-base">
              {derivative.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}

              <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/[0.05] p-4 text-sm leading-7 text-zinc-200">
                {derivative.note}
              </div>
            </div>

            <div className="grid gap-4">
              {derivative.points.map((point) => (
                <div
                  key={point.label}
                  className="rounded-2xl border border-line/40 bg-linear-to-r from-yellow-500/5 to-amber-500/5 p-5 backdrop-blur-sm"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-yellow-500/80">
                    {point.label}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-foreground/80 sm:text-base">
                    {point.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </SectionContainer>
  );
}
