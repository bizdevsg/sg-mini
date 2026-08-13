import Image from "next/image";
import Link from "next/link";

import { ClientAreaMarketInsightBiasIndicator } from "@/components/atoms/ClientAreaMarketInsightBiasIndicator";
import {
  formatMarketSignalUpdateTime,
  resolveMarketSignalCategoryIconSrc,
} from "@/components/organisms/client-area.shared";
import type { AppLocale } from "@/locales";
import type { MarketSignalRecord } from "@/lib/market-signal";

type ClientAreaMarketInsightCardProps = {
  item: MarketSignalRecord;
  locale: AppLocale;
};

export function ClientAreaMarketInsightCard({
  item,
  locale,
}: ClientAreaMarketInsightCardProps) {
  const isSell = item.potensi?.toLowerCase() === "sell";

  const biasDirection = isSell ? "down" : "up";
  const biasLabel = isSell ? "Potensi Melemah" : "Potensi Menguat";

  const theme = isSell
    ? {
      card: "from-red-900/50 to-zinc-900/50",
      border: "border-red-500/10",
      timeframe: "bg-red-700 text-red-200",
      imageBg: "bg-[#2a1111]",
      button: "bg-red-700 hover:bg-red-600 text-white",
    }
    : {
      card: "from-green-900/50 to-zinc-900/50",
      border: "border-green-500/10",
      timeframe: "bg-green-700 text-green-300",
      imageBg: "bg-[#0d241c]",
      button: "bg-green-700 hover:bg-green-600 text-white",
    };

  const categoryIconSrc = resolveMarketSignalCategoryIconSrc(item.categorySlug);
  const updateLabel = formatMarketSignalUpdateTime(item.updatedAt, locale);

  return (
    <div
      className={`w-80 space-y-2 rounded-3xl border bg-linear-to-br p-5 ${theme.card} ${theme.border}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative h-10 w-10 shrink-0">
            {categoryIconSrc ? (
              <Image
                src={categoryIconSrc}
                alt={item.categoryName}
                fill
                sizes="40px"
                className="object-contain"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                {item.categoryName.slice(0, 2)}
              </div>
            )}
          </div>

          <div>
            <h6 className="font-bold capitalize text-white">
              {item.categoryName}
            </h6>

            {updateLabel ? (
              <p className="text-xs text-zinc-400">
                Update {updateLabel}
              </p>
            ) : null}
          </div>
        </div>

        {item.timeframe ? (
          <div className={`rounded px-2 py-1 ${theme.timeframe}`}>
            <span className="text-sm font-bold">
              {item.timeframe}
            </span>
          </div>
        ) : null}
      </div>

      <div>
        <p className="text-zinc-400 text-sm">Bias</p>

        <ClientAreaMarketInsightBiasIndicator
          direction={biasDirection}
          label={biasLabel}
        />
      </div>

      {item.imageUrl ? (
        <div
          className={`relative h-[140px] w-full overflow-hidden rounded-xl ${theme.imageBg}`}
        >
          <Image
            src={item.imageUrl}
            alt={item.title || item.categoryName}
            fill
            sizes="320px"
            className="object-cover"
            unoptimized
          />
        </div>
      ) : null}

      <div className="flex items-end justify-between gap-3">
        <div className="flex-1 rounded-2xl bg-white/5 px-3.5 py-2.5">
          <p className="text-xxs text-zinc-400">Take Profit</p>
          <p className="mt-1 font-bold text-white">
            {item.takingProfit || "-"}
          </p>
        </div>

        <div className="flex-1 rounded-2xl bg-white/5 px-3.5 py-2.5">
          <p className="text-xxs text-zinc-400">Stop Loss</p>
          <p className="mt-1 font-bold text-white">
            {item.stopLoss || "-"}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        {item.source ? (
          <div className="text-[11px] italic leading-snug text-zinc-400">
            <p className="font-semibold">Source:</p>
            <p>{item.source}</p>
          </div>
        ) : (
          <span />
        )}

        <Link
          href={`/${locale}/client-area/market-signal/${encodeURIComponent(item.categorySlug)}`}
          className={`shrink-0 rounded-lg px-4 py-1.5 text-xs font-bold text-black transition-colors ${theme.button}`}
        >
          Lihat Insight
        </Link>
      </div>
    </div>
  );
}