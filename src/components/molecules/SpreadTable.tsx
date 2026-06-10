import type { SpreadItem } from "@/components/content/landing-content";
import { getMessages, type AppLocale } from "@/locales";

type SpreadTableProps = {
  locale: AppLocale;
  items: SpreadItem[];
};

export function SpreadTable({ locale, items }: SpreadTableProps) {
  const labels = getMessages(locale).spread.labels;

  return (
    <div className="mt-10 overflow-hidden rounded-[32px] border border-[rgba(205,161,58,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] shadow-[0_18px_40px_rgba(0,0,0,0.3)]">
      <div className="divide-y divide-[rgba(205,161,58,0.08)] md:hidden">
        {items.map((item) => (
          <article key={item.product} className="px-5 py-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-foreground/55">
                  {labels.product}
                </p>
                <p className="mt-2 font-mono text-xl font-bold text-yellow-500">
                  {item.product}
                </p>
              </div>
              <div className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                {item.swap}
              </div>
            </div>

            <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-2xl border border-line bg-black/20 px-4 py-3">
                <dt className="text-xs uppercase tracking-[0.14em] text-foreground/55">
                  {labels.targetSpread}
                </dt>
                <dd className="mt-2 text-foreground/72">{item.spread}</dd>
              </div>
              <div className="rounded-2xl border border-line bg-black/20 px-4 py-3">
                <dt className="text-xs uppercase tracking-[0.14em] text-foreground/55">
                  {labels.transactionSize}
                </dt>
                <dd className="mt-2 text-foreground/72">{item.size}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <div className="min-w-[720px]">
          <div className="grid grid-cols-[1.1fr_1fr_1fr_0.85fr] gap-4 border-b border-[rgba(205,161,58,0.14)] px-6 py-5 text-xs uppercase tracking-[0.18em] text-foreground/55">
            <div>{labels.product}</div>
            <div>{labels.targetSpread}</div>
            <div>{labels.transactionSize}</div>
            <div>{labels.freeSwap}</div>
          </div>
          {items.map((item) => (
            <div
              key={item.product}
              className="grid grid-cols-[1.1fr_1fr_1fr_0.85fr] gap-4 border-b border-[rgba(205,161,58,0.08)] px-6 py-5 last:border-b-0"
            >
              <div className="font-mono text-lg font-bold text-yellow-500">
                {item.product}
              </div>
              <div className="text-foreground/72">{item.spread}</div>
              <div className="text-foreground/72">{item.size}</div>
              <div className="text-accent">{item.swap}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
