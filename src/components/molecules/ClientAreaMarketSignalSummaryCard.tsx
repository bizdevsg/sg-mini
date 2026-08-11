import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { ClientAreaMarketSignalStatItem } from "@/components/atoms/ClientAreaMarketSignalStatItem";

type ClientAreaMarketSignalSummaryCardProps = {
  buttonClassName: string;
  buttonLabel: string;
  borderClassName: string;
  entryLabel: string;
  entryValue?: string | null;
  imageAlt: string;
  imageUrl?: string | null;
  sourceLabel: string;
  sourceValue?: string | null;
  stopLossLabel: string;
  stopLossValue: string;
  takeProfitLabel: string;
  takeProfitValue: string;
  timeframeLabel: string;
  timeframeValue?: string | null;
  title: string;
  updatedLabel: string;
  updateValue?: string | null;
  onButtonClick: () => void;
};

export function ClientAreaMarketSignalSummaryCard({
  buttonClassName,
  buttonLabel,
  borderClassName,
  entryLabel,
  entryValue,
  imageAlt,
  imageUrl,
  sourceLabel,
  sourceValue,
  stopLossLabel,
  stopLossValue,
  takeProfitLabel,
  takeProfitValue,
  timeframeLabel,
  timeframeValue,
  title,
  updatedLabel,
  updateValue,
  onButtonClick,
}: ClientAreaMarketSignalSummaryCardProps) {
  return (
    <div>
      <div className="mb-3 flex flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-white">{title}</p>
        {updateValue ? (
          <p className="text-xs text-zinc-500">
            {updatedLabel} {updateValue}
          </p>
        ) : null}
      </div>

      <div
        className={`overflow-hidden rounded-2xl border bg-white/[0.03] shadow-lg shadow-black/20 ${borderClassName}`}
      >
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-stretch sm:p-5">
          {imageUrl ? (
            <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl bg-black/30 sm:h-auto sm:w-44">
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                sizes="176px"
                className="object-cover"
                unoptimized
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          ) : null}

          <div className="w-full space-y-3">
            <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
              {entryValue ? (
                <ClientAreaMarketSignalStatItem
                  label={entryLabel}
                  value={entryValue}
                />
              ) : null}

              <ClientAreaMarketSignalStatItem
                label={takeProfitLabel}
                value={takeProfitValue}
              />

              <ClientAreaMarketSignalStatItem
                label={stopLossLabel}
                value={stopLossValue}
              />

              {sourceValue ? (
                <div className="col-span-2 sm:col-span-1">
                  <ClientAreaMarketSignalStatItem
                    label={sourceLabel}
                    value={sourceValue}
                  />
                </div>
              ) : null}
            </div>

            {timeframeValue ? (
              <div className="flex flex-col items-start gap-1.5 border-t border-white/10 pt-3 text-sm text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
                <span>{timeframeLabel}</span>
                <span className="font-semibold text-white">{timeframeValue}</span>
              </div>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          onClick={onButtonClick}
          className={`flex w-full items-center justify-center gap-2 px-5 py-3.5 text-center text-sm font-bold transition-colors ${buttonClassName}`}
        >
          {buttonLabel}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
