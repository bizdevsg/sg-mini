import { SectionContainer } from "@/components/atoms/SectionContainer";
import type { IndexSymbolItem } from "@/locales/index-symbols-page";

type IndexSymbolsOverviewSectionProps = {
  title: string;
  subtitle: string;
  items: IndexSymbolItem[];
};

export function IndexSymbolsOverviewSection({
  title,
  subtitle,
  items,
}: IndexSymbolsOverviewSectionProps) {
  return (
    <SectionContainer className="py-16 md:py-20 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-25 bg-linear-to-b from-black to-transparent" />

      <div className="">
        <div className="mb-12 flex gap-3">
          <div className="w-2 h-7 bg-yellow-500 rounded-full mt-2" />
          <div>
            <h2
              id="index-symbols-list"
              className="text-3xl font-bold leading-tight text-white sm:text-4xl"
            >
              {title}
            </h2>
            <p className="max-w-3xl text-base leading-7 text-zinc-300">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item, index) => (
            <article
              key={item.code}
              className="group relative flex flex-col rounded-[20px] border border-line bg-linear-to-br from-slate-900/40 to-slate-900/20 p-6 backdrop-blur-sm transition-all duration-300 hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/10 sm:p-8"
            >
              <div className="absolute right-6 top-6 sm:right-8 sm:top-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-yellow-500 to-amber-600 text-sm font-bold text-white shadow-lg">
                  {String(index + 1).padStart(2, "0")}
                </div>
              </div>

              <div className="pr-14">
                <h3 className="font-mono text-2xl font-bold tracking-[-0.03em] text-yellow-500">
                  {item.code}
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
