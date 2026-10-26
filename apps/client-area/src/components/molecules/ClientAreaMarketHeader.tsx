import { ArrowDown, ArrowUp } from "lucide-react";

import { LiveQuoteInstrumentIcon } from "@/components/atoms/LiveQuoteInstrumentIcon";

type ClientAreaMarketHeaderProps = {
  absoluteChange: string | null;
  currentPrice: string;
  direction: "up" | "down";
  directionClassName: string;
  marketCode: string;
  percentageChange: string;
  symbol: string;
};

export function ClientAreaMarketHeader({
  absoluteChange,
  currentPrice,
  direction,
  directionClassName,
  marketCode,
  percentageChange,
  symbol,
}: ClientAreaMarketHeaderProps) {
  const DirectionIcon = direction === "up" ? ArrowUp : ArrowDown;

  return (
    <>
      <div className="relative flex min-w-0 items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-zinc-800 ring-1 ring-white/10">
          <LiveQuoteInstrumentIcon symbol={marketCode} className="h-11 w-11" />
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-lg font-black tracking-tight text-white sm:text-xl">
            {symbol}
          </h3>
          <p className="mt-1 truncate text-xs font-medium text-zinc-400 sm:text-sm">
            {marketCode}
          </p>
        </div>
      </div>

      <div className="relative my-3 flex items-center justify-between gap-x-1.5 gap-y-2">
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-black tracking-tight text-zinc-50 sm:text-2xl">
            {currentPrice}
          </span>
          <span className="text-xs font-medium text-zinc-400 sm:text-sm">
            USD
          </span>
        </div>

        <span
          className={`ml-1 inline-flex items-center gap-1 text-sm font-medium sm:text-base ${directionClassName}`}
        >
          <DirectionIcon
            aria-hidden="true"
            className="h-4 w-4 fill-current"
          />
          {absoluteChange ? `${absoluteChange} ` : null}
          ({percentageChange})
        </span>
      </div>
    </>
  );
}
