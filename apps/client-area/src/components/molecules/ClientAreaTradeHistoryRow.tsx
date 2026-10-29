import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { LiveQuoteInstrumentIcon } from "@/components/atoms/LiveQuoteInstrumentIcon";
import type { TransactionHistoryItem } from "@/components/organisms/client-area.types";
import { getMessages, type AppLocale } from "@/locales";

type ClientAreaTradeHistoryRowProps = {
  item: TransactionHistoryItem;
  locale: AppLocale;
};

function getStatusClassName(tone: TransactionHistoryItem["statusTone"]) {
  if (tone === "profit") {
    return "bg-yellow-400/15 text-yellow-300";
  }

  if (tone === "loss") {
    return "bg-rose-400/15 text-rose-300";
  }

  if (tone === "warning") {
    return "bg-red-400/15 text-red-300";
  }

  return "bg-white/10 text-zinc-300";
}

export function ClientAreaTradeHistoryRow({
  item,
  locale,
}: ClientAreaTradeHistoryRowProps) {
  const labels = getMessages(locale).clientArea.marketTransactions.tradeHistoryRow;
  const sideLabel = item.sideLabel ?? labels.date;
  const sidePrice = item.sidePrice ?? item.date;
  const closeLabel = item.closeLabel ?? labels.price;
  const profitLoss = item.profitLoss ?? "-";
  const profitLossClassName =
    profitLoss === "-"
      ? "text-zinc-500"
      : profitLoss.startsWith("-")
        ? "text-rose-400"
        : "text-white";
  const stats: Array<{ label: string; value: string }> = [
    { label: labels.quantityLots, value: item.volume },
    { label: sideLabel, value: sidePrice },
    { label: closeLabel, value: item.closePrice ?? "-" },
    { label: labels.facilityFee, value: item.facilityFee ?? "-" },
    { label: labels.vat, value: item.vat ?? "-" },
  ];

  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/70 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black/40 ring-1 ring-yellow-500/20">
            <LiveQuoteInstrumentIcon symbol={item.symbol} className="h-7 w-7" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="wrap-break-word text-base font-black uppercase tracking-tight text-white sm:text-lg">
                {item.instrument}
              </h4>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider ${getStatusClassName(item.statusTone)}`}
              >
                {item.statusLabel}
              </span>
            </div>
            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-zinc-400">
              <span>
                {labels.orderNumber} {item.orderNumber}
              </span>
              <span>{item.date}</span>
              <span className="flex items-center gap-1.5">
                <FontAwesomeIcon icon={["fas", "clock"]} className="text-[11px] text-zinc-500" />
                {item.time}
              </span>
            </p>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            {labels.profitLoss}
          </p>
          <p className={`text-xl font-black tabular-nums sm:text-2xl ${profitLossClassName}`}>
            {profitLoss}
          </p>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-white/5 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-zinc-900/90 px-3 py-2.5">
            <dt className="text-[11px] font-medium text-zinc-500">{stat.label}</dt>
            <dd className="mt-0.5 text-sm font-bold tabular-nums text-white">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
