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
    <div className={className}>
      <h6 className="text-sm font-semibold md:text-base">{display.label}</h6>
      {display.symbol ? (
        <span className="text-xs font-medium">
          ({display.symbol})
        </span>
      ) : null}
    </div>
  );
}
