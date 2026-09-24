import { SectionContainer } from "@/components/atoms/SectionContainer";
import type { ContractExampleItem } from "@/locales/index-symbols-page";

type IndexSymbolsContractExampleSectionProps = {
  title: string;
  subtitle: string;
  items: ContractExampleItem[];
};

export function IndexSymbolsContractExampleSection({
  title,
  subtitle,
  items,
}: IndexSymbolsContractExampleSectionProps) {
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
          <div className="grid gap-4 sm:gap-5">
            {items.map((item, index) => (
              <div
                key={`${item.code}-${index}`}
                className="group flex items-center gap-4 rounded-2xl border border-line/40 bg-linear-to-r from-yellow-500/5 to-amber-500/5 p-5 backdrop-blur-sm transition-all duration-300 hover:border-yellow-500/40 hover:shadow-lg hover:shadow-yellow-500/5 sm:p-6"
              >
                <span className="min-w-[92px] font-mono text-lg font-bold text-yellow-500 sm:min-w-[112px] sm:text-xl">
                  {item.code}
                </span>
                <span className="text-sm leading-7 text-foreground/80 sm:text-base">
                  {item.description}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </SectionContainer>
  );
}
