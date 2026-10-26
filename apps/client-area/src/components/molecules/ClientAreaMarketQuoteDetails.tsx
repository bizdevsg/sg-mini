import { ArrowDown, ArrowUp, Clock4 } from "lucide-react";

import { ClientAreaMarketMetricItem } from "@/components/atoms/ClientAreaMarketMetricItem";
import { ClientAreaMarketStatItem } from "@/components/atoms/ClientAreaMarketStatItem";
import type { AppMessages } from "@/locales";

type MarketMetrics = {
  buy: string;
  high: string;
  low: string;
  open: string;
  sell: string;
  time: string;
};

type ClientAreaMarketQuoteDetailsProps = {
  containerClassName: string;
  directionClassName: string;
  fieldLabels: AppMessages["liveQuoteTable"]["fields"];
  metrics: MarketMetrics;
};

export function ClientAreaMarketQuoteDetails({
  containerClassName,
  directionClassName,
  fieldLabels,
  metrics,
}: ClientAreaMarketQuoteDetailsProps) {
  return (
    <div className="relative">
      <div className="grid grid-cols-2 gap-2">
        <ClientAreaMarketMetricItem
          valuePrefix={
            <ArrowUp
              aria-hidden="true"
              className={directionClassName}
              size={21}
            />
          }
          label={fieldLabels.buy}
          value={metrics.buy}
          labelClassName={directionClassName}
          valueClassName="text-zinc-50"
          containerClassName={containerClassName}
        />

        <ClientAreaMarketMetricItem
          valuePrefix={
            <ArrowDown
              aria-hidden="true"
              className={directionClassName}
              size={21}
            />
          }
          label={fieldLabels.sell}
          value={metrics.sell}
          labelClassName={directionClassName}
          valueClassName="text-zinc-50"
          containerClassName={containerClassName}
        />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:text-base">
        <ClientAreaMarketStatItem
          label={fieldLabels.high}
          value={metrics.high}
        />
        <ClientAreaMarketStatItem
          label={fieldLabels.low}
          value={metrics.low}
        />
        <ClientAreaMarketStatItem
          label={fieldLabels.open}
          value={metrics.open}
        />
        <ClientAreaMarketStatItem
          label={
            <Clock4
              aria-label={fieldLabels.time}
              className="h-5 w-5 text-zinc-400"
            />
          }
          value={metrics.time}
        />
      </div>
    </div>
  );
}
