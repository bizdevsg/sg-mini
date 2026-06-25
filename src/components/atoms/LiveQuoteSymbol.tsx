import { getLiveQuoteDisplay } from "@/lib/live-quotes";

type LiveQuoteSymbolProps = {
  symbol: string;
  className?: string;
};

export function LiveQuoteSymbol({
  symbol,
  className = "",
}: LiveQuoteSymbolProps) {
  const display = getLiveQuoteDisplay(symbol);

  return (
    <span className={className}>
      <span className="text-sm font-semibold md:text-base">{display.label}</span>
      {display.symbol ? (
        <span className="ml-1 text-xs font-medium">
          ({display.symbol})
        </span>
      ) : null}
    </span>
  );
}
