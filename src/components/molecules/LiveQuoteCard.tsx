import type { AppLocale, AppMessages } from "@/locales";

import type { LiveQuoteTick } from "./live-quote.shared";
import { LiveQuoteCompactCard } from "./LiveQuoteCompactCard";
import { LiveQuoteFullCard } from "./LiveQuoteFullCard";

type LiveQuoteCardProps = {
  locale: AppLocale;
  mode: "compact" | "full";
  symbol: string;
  tick: LiveQuoteTick;
  fieldLabels: AppMessages["liveQuoteTable"]["fields"];
};

export function LiveQuoteCard({
  locale,
  mode,
  symbol,
  tick,
  fieldLabels,
}: LiveQuoteCardProps) {
  if (mode === "full") {
    return (
      <LiveQuoteFullCard
        locale={locale}
        symbol={symbol}
        tick={tick}
        fieldLabels={fieldLabels}
      />
    );
  }

  return (
    <LiveQuoteCompactCard
      locale={locale}
      symbol={symbol}
      tick={tick}
      fieldLabels={fieldLabels}
    />
  );
}
