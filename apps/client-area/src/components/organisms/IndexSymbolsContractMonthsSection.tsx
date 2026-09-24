import { SectionContainer } from "@/components/atoms/SectionContainer";
import type { ContractMonthSymbolGroup } from "@/locales/index-symbols-page";

type IndexSymbolsContractMonthsSectionProps = {
  title: string;
  subtitle: string;
  groups: ContractMonthSymbolGroup[];
};

export function IndexSymbolsContractMonthsSection({
  title,
  subtitle,
  groups,
}: IndexSymbolsContractMonthsSectionProps) {
  return (
    <SectionContainer className="pb-16 md:pb-20">
      <div className="mx-auto">
        <div className="mb-12 text-center">
          <h2
            id="contract-months"
            className="text-3xl font-bold leading-tight text-white sm:text-4xl"
          >
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-zinc-300">
            {subtitle}
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          {groups.map((group) => (
            <section
              key={group.title}
              className="rounded-[1.75rem] border border-line bg-black/20 p-6 sm:p-8"
            >
              <h3 className="font-mono text-2xl font-bold tracking-[-0.03em] text-yellow-500">
                {group.title}
              </h3>

              <div className="mt-6 space-y-3">
                {group.items.map((item) => (
                  <div
                    key={`${group.title}-${item.code}-${item.month}`}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-black/[0.24] px-4 py-3"
                  >
                    <span className="font-mono text-lg font-bold text-white">
                      {item.code}
                    </span>
                    <span className="text-sm text-zinc-300 sm:text-base">
                      {item.month}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
