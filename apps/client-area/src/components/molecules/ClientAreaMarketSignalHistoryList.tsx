import Image from "next/image";

import {
  formatMarketSignalUpdateTime,
  resolveMarketSignalCategoryIconSrc,
} from "@/components/organisms/client-area.shared";
import type { MarketSignalRecord } from "@/lib/market-signal";
import type { AppLocale } from "@/locales";

type ClientAreaMarketSignalHistoryListProps = {
  items: MarketSignalRecord[];
  locale: AppLocale;
};

function formatSignalTime(dateInput: string | number | Date, locale: AppLocale) {
  const date = new Date(dateInput);
  const time = date.toLocaleTimeString(locale === "id" ? "id-ID" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const now = new Date();
  const isSameDay = date.toDateString() === now.toDateString();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const dayLabel = isSameDay
    ? locale === "id"
      ? "Hari Ini"
      : "Today"
    : isYesterday
      ? locale === "id"
        ? "Kemarin"
        : "Yesterday"
      : date.toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
        day: "2-digit",
        month: "short",
      });

  return { time, dayLabel };
}

export function ClientAreaMarketSignalHistoryList({
  items,
  locale,
}: ClientAreaMarketSignalHistoryListProps) {
  return (
    <>
      <div className="space-y-3 sm:hidden">
        {items.map((item, index) => {
          const isSell = item.potensi?.toLowerCase() === "sell";
          const isExpired = item.isExpired ?? index !== 0;
          const potensiLabel = isExpired
            ? "Expired"
            : item.potensi
              ? `Potensi ${item.potensi.charAt(0).toUpperCase()}${item.potensi.slice(1).toLowerCase()}`
              : isSell
                ? "Potensi Sell"
                : "Potensi Buy";
          const theme = isExpired
            ? {
              badge: "border-zinc-600/60 bg-zinc-800 text-zinc-300",
              card: "border-zinc-500/10 bg-white/[0.03]",
              button: "bg-zinc-700 text-zinc-400",
            }
            : isSell
              ? {
                badge: "border-red-500/30 bg-red-500/10 text-red-300",
                card: "border-red-500/10 bg-red-500/[0.03]",
                button: "bg-red-600 text-white",
              }
              : {
                badge: "border-blue-500/30 bg-blue-500/10 text-blue-300",
                card: "border-blue-500/10 bg-blue-500/[0.03]",
                button: "bg-blue-600 text-white",
              };
          const categoryIconSrc = resolveMarketSignalCategoryIconSrc(item.categorySlug);
          const { time, dayLabel } = formatSignalTime(item.updatedAt, locale);

          return (
            <article
              key={item.id}
              className={`overflow-hidden rounded-2xl border p-4 ${theme.card}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                    {categoryIconSrc ? (
                      <Image
                        src={categoryIconSrc}
                        alt={item.categoryName}
                        fill
                        sizes="44px"
                        className="object-contain p-2"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs font-semibold uppercase text-white/70">
                        {item.categoryName.slice(0, 2)}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold capitalize text-white">
                      {item.categoryName}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {dayLabel} • {time}
                    </p>
                  </div>
                </div>

                <span
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-bold whitespace-nowrap ${theme.badge}`}
                >
                  {potensiLabel}
                </span>
              </div>

              {item.imageUrl ? (
                <div className="relative mt-4 h-36 overflow-hidden rounded-2xl bg-black/30">
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

              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <div className="rounded-xl border border-white/5 bg-white/[0.04] p-3">
                  <p className="text-[11px] text-zinc-100">Take Profit</p>
                  <p className="mt-1 text-sm font-bold text-white">
                    {item.takingProfit || "-"}
                  </p>
                </div>

                <div className="rounded-xl border border-white/5 bg-white/[0.04] p-3">
                  <p className="text-[11px] text-zinc-100">Stop Loss</p>
                  <p className="mt-1 text-sm font-bold text-white">
                    {item.stopLoss || "-"}
                  </p>
                </div>

                {item.source ? (
                  <div className="col-span-2 rounded-xl border border-white/5 bg-white/[0.04] p-3">
                    <p className="text-[11px] text-zinc-100">Sumber</p>
                    <p className="mt-1 text-sm font-bold text-white">
                      {item.source}
                    </p>
                  </div>
                ) : null}
              </div>

              {item.timeframe ? (
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-3 text-xs text-zinc-400">
                  <span>Timeframe</span>
                  <span className="font-semibold text-white">{item.timeframe}</span>
                </div>
              ) : null}

              <div className={`mt-4 rounded-xl px-4 py-3 text-center text-sm font-bold ${theme.button}`}>
                {potensiLabel}
              </div>
            </article>
          );
        })}
      </div>

      <div className="hidden space-y-4 sm:block">
        {items.map((item, index) => {
          const isSell = item.potensi?.toLowerCase() === "sell";
          const isExpired = item.isExpired ?? index !== 0;
          const potensiLabel = isExpired
            ? "Expired"
            : item.potensi
              ? `Potensi ${item.potensi.charAt(0).toUpperCase()}${item.potensi.slice(1).toLowerCase()}`
              : isSell
                ? "Potensi Sell"
                : "Potensi Buy";

          const theme = isExpired
            ? { border: "border-zinc-500/10", button: "bg-zinc-700 text-zinc-400" }
            : isSell
              ? { border: "border-red-500/10", button: "bg-red-600 hover:bg-red-500 text-white" }
              : { border: "border-blue-500/10", button: "bg-blue-600 hover:bg-blue-500 text-white" };

          const categoryIconSrc = resolveMarketSignalCategoryIconSrc(item.categorySlug);
          const { time, dayLabel } = formatSignalTime(item.updatedAt, locale);
          const isLast = index === items.length - 1;

          return (
            <div key={item.id} className="flex gap-4">
              <div className="w-16 flex-none pt-1 text-right">
                <p className="text-sm font-semibold text-white">{time}</p>
                <p className="text-xs text-zinc-500">{dayLabel}</p>
              </div>

              <div className="relative flex-none">
                <span
                  className={`absolute left-1/2 top-1.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 bg-zinc-950 ${isExpired ? "border-zinc-600" : "border-yellow-500"
                    }`}
                />
                {!isLast ? (
                  <span
                    className={`absolute left-1/2 top-1.5 bottom-[-1rem] w-px -translate-x-1/2 ${isExpired ? "bg-zinc-700/50" : "bg-yellow-500/50"
                      }`}
                  />
                ) : null}
              </div>

              <div
                className={`min-w-0 flex-1 overflow-hidden rounded-2xl border bg-white/[0.03] transition-colors ${theme.border} ${isExpired ? "opacity-70" : ""
                  }`}
              >
                <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                  {item.imageUrl ? (
                    <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-xl bg-black/30 sm:h-24 sm:w-40">
                      <Image
                        src={item.imageUrl}
                        alt={item.title || item.categoryName}
                        fill
                        sizes="260px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : null}

                  <div className="w-full space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-9 w-9 shrink-0">
                        {categoryIconSrc ? (
                          <Image
                            src={categoryIconSrc}
                            alt={item.categoryName}
                            fill
                            sizes="36px"
                            className="object-contain"
                          />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-semibold uppercase text-white/70">
                            {item.categoryName.slice(0, 2)}
                          </div>
                        )}
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <p className="truncate text-sm font-bold capitalize text-white">
                          {item.categoryName}
                        </p>
                        <p className="hidden text-xs text-zinc-500 sm:block">{time}</p>
                      </div>
                    </div>

                    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
                      <div className="w-full rounded-xl border border-white/5 bg-white/[0.04] p-2">
                        <p className="text-xs text-zinc-500">Take Profit</p>
                        <p className="text-sm font-bold text-white">
                          {item.takingProfit || "-"}
                        </p>
                      </div>

                      <div className="w-full rounded-xl border border-white/5 bg-white/[0.04] p-2">
                        <p className="text-xs text-zinc-500">Stop Loss</p>
                        <p className="text-sm font-bold text-white">
                          {item.stopLoss || "-"}
                        </p>
                      </div>

                      {item.source ? (
                        <div className="w-full rounded-xl border border-white/5 bg-white/[0.04] p-2">
                          <p className="text-xs text-zinc-500">Sumber</p>
                          <p className="text-sm font-bold text-white">{item.source}</p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                {item.timeframe ? (
                  <div className="flex flex-col items-start gap-1 border-t border-white/10 px-4 py-2.5 text-xs text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
                    <span>Timeframe Analisis Signal</span>
                    <span className="font-semibold text-white">{item.timeframe}</span>
                  </div>
                ) : null}

                <button
                  type="button"
                  className={`block w-full px-4 py-3 text-center text-sm font-bold transition-colors ${theme.button}`}
                >
                  {potensiLabel}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
