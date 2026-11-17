import { Star, TrendingDown, TrendingUp } from "lucide-react";

import { LiveQuoteInstrumentIcon } from "@/components/atoms/LiveQuoteInstrumentIcon";
import {
  getClientAreaTradePilotPriceMovement,
  type ClientAreaTradePilotCopy,
  type ClientAreaTradePilotInstrument,
} from "@/lib/client-area-trade-pilot.shared";
import type { LiveQuoteTick } from "@/lib/live-quotes";

type ClientAreaTradePilotMarketHeaderProps = {
  copy: ClientAreaTradePilotCopy;
  instrument: ClientAreaTradePilotInstrument;
  quoteSymbol: string;
  tick?: LiveQuoteTick;
};

export function ClientAreaTradePilotMarketHeader({
  copy,
  instrument,
  quoteSymbol,
  tick,
}: ClientAreaTradePilotMarketHeaderProps) {
  const { change, percentage } = getClientAreaTradePilotPriceMovement(tick);
  const isPositive = (change ?? 0) >= 0;
  const price = tick?.price || tick?.buy || tick?.sell || "--";

  return (
    <div className="flex min-w-0 flex-col gap-5 border-b border-zinc-800 pb-4 sm:pb-5 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-medium text-zinc-400">
          {copy.instrumentLabel}
        </p>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-yellow-500/15 p-1">
            <LiveQuoteInstrumentIcon
              symbol={quoteSymbol}
              className="h-10 w-10"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-lg font-bold text-white sm:text-xl">
                {instrument.label}
              </h2>
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            </div>
            <p className="truncate text-sm text-zinc-400">
              {copy.instrumentNames[instrument.nameKey]}
            </p>
          </div>
        </div>
      </div>

      <div className="min-w-0 md:shrink-0 md:text-right">
        <p className="text-sm font-medium text-zinc-400">
          {copy.currentPriceLabel}
        </p>
        <div className="mt-2 flex min-w-0 flex-wrap items-center gap-2 sm:gap-3 md:justify-end">
          <strong className="max-w-full truncate text-xl font-bold tracking-tight text-white tabular-nums sm:text-2xl">
            {price}
          </strong>
          {percentage !== null ? (
            <span
              className={`inline-flex items-center gap-1 font-bold ${isPositive ? "text-emerald-400" : "text-red-400"}`}
            >
              {isPositive ? (
                <TrendingUp className="h-5 w-5" />
              ) : (
                <TrendingDown className="h-5 w-5" />
              )}
              {Math.abs(percentage).toFixed(2)}%
            </span>
          ) : null}
        </div>
        {change !== null ? (
          <p
            className={`mt-1 text-sm font-semibold ${isPositive ? "text-emerald-400" : "text-red-400"}`}
          >
            {isPositive ? "+" : ""}
            {change.toFixed(2)}
          </p>
        ) : null}
      </div>
    </div>
  );
}
