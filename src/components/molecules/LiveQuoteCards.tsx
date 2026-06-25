import type { AppLocale, AppMessages } from "@/locales";

import type { LiveQuotePayload } from "./live-quote.shared";
import { LiveQuoteCard } from "./LiveQuoteCard";

type LiveQuoteCardsProps = {
  locale: AppLocale;
  mode: "compact" | "full";
  quotes: LiveQuotePayload;
  symbols: string[];
  fieldLabels: AppMessages["liveQuoteTable"]["fields"];
};

export function LiveQuoteCards({
  locale,
  mode,
  quotes,
  symbols,
  fieldLabels,
}: LiveQuoteCardsProps) {
  return (
    <div className={mode === "full" ? "grid gap-4 md:hidden" : "grid gap-4 lg:grid-cols-3"}>
      {symbols.map((symbol) => {
        const tick = quotes[symbol];
        return (
          <LiveQuoteCard
            key={symbol}
            locale={locale}
            mode={mode}
            symbol={symbol}
            tick={tick}
            fieldLabels={fieldLabels}
          />
        );
      })}
    </div>
  );
}
