import { SectionContainer } from "@/components/atoms/SectionContainer";
import { EbookCard } from "@/components/molecules/EbookCard";

type EbookItem = {
  title: string;
  description: string;
  format: string;
  level: string;
  topics: string[];
};

type EbookLibrarySectionProps = {
  title: string;
  subtitle: string;
  items: EbookItem[];
  detailCtaLabel: string;
  benefits?: string[];
  benefitsTitle?: string;
};

export function EbookLibrarySection({
  title,
  subtitle,
  items,
  detailCtaLabel,
  benefits,
  benefitsTitle,
}: EbookLibrarySectionProps) {
  return (
    <>
      {/* Benefits Section */}
      {benefits && benefits.length > 0 && benefitsTitle && (
        <SectionContainer className="py-16 md:py-20 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-25 bg-linear-to-b from-black to-transparent" />

          <div className="mx-auto">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
                {benefitsTitle}
              </h2>
            </div>

            <div className="grid gap-6 sm:gap-8 md:grid-cols-1">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-4 rounded-2xl border border-line/40 bg-linear-to-r from-yellow-500/5 to-amber-500/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-yellow-500/40 hover:shadow-lg hover:shadow-yellow-500/5 sm:gap-6 sm:p-8"
                >
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-yellow-500 to-amber-600">
                    <span className="text-sm font-bold text-white">
                      {index + 1}
                    </span>
                  </div>

                  <p className="text-base text-foreground/80 sm:text-lg">
                    {benefit}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </SectionContainer>
      )}

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

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item, index) => (
              <EbookCard
                key={item.title}
                item={item}
                index={index + 1}
                detailCtaLabel={detailCtaLabel}
              />
            ))}
          </div>
        </div>
      </SectionContainer>
    </>
  );
}
