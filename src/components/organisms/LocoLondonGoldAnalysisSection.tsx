import { SectionContainer } from "@/components/atoms/SectionContainer";
import type { LocoLondonGoldAnalysisFactor } from "@/locales/loco-london-gold-page";

type LocoLondonGoldAnalysisSectionProps = {
  title: string;
  subtitle: string;
  items: LocoLondonGoldAnalysisFactor[];
};

export function LocoLondonGoldAnalysisSection({
  title,
  subtitle,
  items,
}: LocoLondonGoldAnalysisSectionProps) {
  return (
    <SectionContainer className="pb-16 md:pb-20">
      <div className="mx-auto">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item, index) => (
            <article
              key={item.title}
              className="group relative flex flex-col rounded-[20px] border border-line bg-linear-to-br from-slate-900/40 to-slate-900/20 p-6 backdrop-blur-sm transition-all duration-300 hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/10 sm:p-8"
            >
              <div className="absolute right-6 top-6 sm:right-8 sm:top-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-yellow-500 to-amber-600 text-sm font-bold text-white shadow-lg">
                  {String(index + 1).padStart(2, "0")}
                </div>
              </div>

              <div className="pr-14">
                <h3 className="font-mono text-xl font-bold tracking-[-0.03em] text-yellow-500 sm:text-2xl">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-foreground/72 sm:text-base">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
