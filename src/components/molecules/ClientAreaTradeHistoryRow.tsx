import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { LiveQuoteInstrumentIcon } from "@/components/atoms/LiveQuoteInstrumentIcon";
import type { TransactionHistoryItem } from "@/components/organisms/client-area.types";

type ClientAreaTradeHistoryRowProps = {
  item: TransactionHistoryItem;
};

function getStatusClassName(tone: TransactionHistoryItem["statusTone"]) {
  if (tone === "profit") {
    return "text-yellow-400";
  }

  if (tone === "loss") {
    return "text-rose-400";
  }

  if (tone === "warning") {
    return "text-red-400";
  }

  return "text-zinc-300";
}

export function ClientAreaTradeHistoryRow({
  item,
}: ClientAreaTradeHistoryRowProps) {
  const statusClassName = getStatusClassName(item.statusTone);
  const sideLabel = item.sideLabel ?? "Date";
  const sidePrice = item.sidePrice ?? item.date;
  const closeLabel = item.closeLabel ?? "Price";
  const closePrice = item.closePrice ?? "-";
  const facilityFee = item.facilityFee ?? "-";
  const vat = item.vat ?? "-";
  const profitLoss = item.profitLoss ?? "-";
  const profitLossClassName =
    profitLoss === "-"
      ? "text-zinc-500"
      : profitLoss.startsWith("-")
        ? "text-rose-400"
        : "text-white";

  return (
    <div className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_26%),linear-gradient(180deg,rgba(34,35,40,0.96),rgba(26,27,31,0.98))] p-4 shadow-[0_18px_42px_rgba(0,0,0,0.22)] sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex shrink-0 items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,208,77,0.22),rgba(18,18,18,0.95)_70%)] shadow-[inset_0_2px_16px_rgba(255,212,92,0.28),0_8px_20px_rgba(0,0,0,0.32)] ring-1 ring-yellow-500/20">
            <LiveQuoteInstrumentIcon symbol={item.symbol} className="h-8 w-8" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h4 className="break-words text-sm font-black uppercase tracking-tight text-white sm:text-base">
                {item.instrument} <span className="text-zinc-200">({item.symbol})</span>
              </h4>
              <p className={`mt-1 text-sm font-semibold sm:text-base ${statusClassName}`}>
                {item.statusLabel}
              </p>
            </div>

            <div className="grid gap-1 text-zinc-400 sm:justify-items-end">
              <div className="text-sm sm:text-base">{item.date}</div>
              <div className="flex items-center gap-2 text-sm sm:text-base">
                <FontAwesomeIcon
                  icon={["fas", "clock"]}
                  className="text-xs text-zinc-500"
                />
                <span>{item.time}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2 xl:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-zinc-400">No. Order</p>
                <p className="text-sm font-bold text-white">{item.orderNumber}</p>
              </div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-zinc-400">Quantity Lots</p>
                <p className="text-sm font-bold text-white">{item.volume}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-zinc-400">{closeLabel}</p>
                <p className="text-sm font-bold text-white">{closePrice}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-zinc-400">Facility Fee</p>
                <p className="text-sm font-bold text-white">{facilityFee}</p>
              </div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-zinc-400">VAT</p>
                <p className="text-sm font-bold text-white">{vat}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-zinc-400">Profit Loss</p>
                <p className={`text-sm font-bold ${profitLossClassName}`}>
                  {profitLoss}
                </p>
              </div>

              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-zinc-400">{sideLabel}</p>
                <p className="text-sm font-bold text-white">{sidePrice}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
