import { SectionContainer } from "@/components/atoms/SectionContainer";

type OnlineTradingTermsNotesSectionProps = {
  eyebrow: string;
  title: string;
  items: string[];
};

export function OnlineTradingTermsNotesSection({
  eyebrow,
  title,
  items,
}: OnlineTradingTermsNotesSectionProps) {
  return (
    <SectionContainer className="pb-16 md:pb-20">
      <div id="terms-notes" className="mx-auto">
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-yellow-500/80">
            {eyebrow}
          </p>
          <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl">
            {title}
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-1">
          {items.map((item, index) => (
            <div
              key={item}
              className="group flex items-center gap-4 rounded-2xl border border-line/40 bg-linear-to-r from-yellow-500/5 to-amber-500/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-yellow-500/40 hover:shadow-lg hover:shadow-yellow-500/5 sm:gap-6 sm:p-8"
            >
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-yellow-500 to-amber-600">
                <span className="text-sm font-bold text-white">
                  {index + 1}
                </span>
              </div>

              <p className="text-base text-foreground/80 sm:text-lg">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
