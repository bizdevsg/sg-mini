import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { LiveQuoteInstrumentIcon } from "@/components/atoms/LiveQuoteInstrumentIcon";
import type { PositionItem } from "@/components/organisms/client-area.types";
import type { AppLocale } from "@/locales";

type ClientAreaTransactionRowProps = {
  item: PositionItem;
  locale: AppLocale;
};

type PlTone = "profit" | "loss" | "flat";

function getPlTone(item: PositionItem): PlTone {
  if (typeof item.floatingValue === "number") {
    if (item.floatingValue > 0) return "profit";
    if (item.floatingValue < 0) return "loss";

    return "flat";
  }

  if (item.floatingPl.startsWith("+")) return "profit";
  if (item.floatingPl.startsWith("-")) return "loss";

  return "flat";
}

const PL_TEXT_CLASS: Record<PlTone, string> = {
  profit: "text-emerald-400",
  loss: "text-rose-400",
  flat: "text-zinc-200",
};

const LABELS = {
  id: {
    orderNumber: "No. Order",
    lots: "Lot",
    openPrice: "Harga Buka",
    currentPrice: "Harga Saat Ini",
    storage: "Storage",
    facilityFee: "Facility Fee",
    vat: "VAT",
    floatingPl: "Floating P/L",
  },
  en: {
    orderNumber: "Order No.",
    lots: "Lots",
    openPrice: "Open Price",
    currentPrice: "Current Price",
    storage: "Storage",
    facilityFee: "Facility Fee",
    vat: "VAT",
    floatingPl: "Floating P/L",
  },
} as const;

/**
 * One open position. Missing values show "—" — never an invented figure.
 */
export function ClientAreaTransactionRow({
  item,
  locale,
}: ClientAreaTransactionRowProps) {
  const labels = LABELS[locale];
  const isBuy = item.side === "buy";
  const tone = getPlTone(item);
  const [openedDate, openedTime] = item.openedAt
    .split(",")
    .map((value) => value.trim());
  const stats: Array<{ label: string; value: string }> = [
    { label: labels.openPrice, value: `$ ${item.openPrice}` },
    { label: labels.currentPrice, value: `$ ${item.currentPrice}` },
    { label: labels.lots, value: item.volume },
    { label: labels.storage, value: item.storageFee ?? "—" },
    { label: labels.facilityFee, value: item.facilityFee ?? "—" },
    { label: labels.vat, value: item.vat ?? "—" },
  ];

  return (
    <article className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/70 p-4 pl-5 sm:p-5 sm:pl-6">
      <span
        aria-hidden="true"
        className={`absolute inset-y-0 left-0 w-1 ${isBuy ? "bg-emerald-400" : "bg-amber-400"}`}
      />

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
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider ${isBuy
                  ? "bg-emerald-400/15 text-emerald-300"
                  : "bg-amber-400/15 text-amber-300"
                  }`}
              >
                {isBuy ? "Buy" : "Sell"}
              </span>
            </div>
            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-zinc-400">
              <span>
                {labels.orderNumber} {item.orderNumber ?? "—"}
              </span>
              <span className="flex items-center gap-1.5">
                <FontAwesomeIcon icon={["fas", "calendar-days"]} className="text-[11px] text-zinc-500" />
                {openedDate ?? item.openedAt}
              </span>
              {openedTime ? (
                <span className="flex items-center gap-1.5">
                  <FontAwesomeIcon icon={["fas", "clock"]} className="text-[11px] text-zinc-500" />
                  {openedTime}
                </span>
              ) : null}
            </p>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            {labels.floatingPl}
          </p>
          <p className={`text-xl font-black tabular-nums sm:text-2xl ${PL_TEXT_CLASS[tone]}`}>
            {item.floatingPl}
          </p>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-white/5 sm:grid-cols-3 lg:grid-cols-6">
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
