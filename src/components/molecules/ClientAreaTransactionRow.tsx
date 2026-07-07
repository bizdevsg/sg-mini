import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LiveQuoteInstrumentIcon } from "@/components/atoms/LiveQuoteInstrumentIcon";

import type { PositionItem } from "@/components/organisms/client-area.types";
import type { AppLocale } from "@/locales";

type ClientAreaTransactionRowProps = {
  item: PositionItem;
  locale: AppLocale;
};

export function ClientAreaTransactionRow({
  item,
  locale,
}: ClientAreaTransactionRowProps) {
  const isBuy = item.side === "buy";
  const isProfit = item.floatingPl.startsWith("+");
  const [openedDate, openedTime] = item.openedAt
    .split(",")
    .map((value) => value.trim());
  const labels =
    locale === "id"
      ? {
          buy: "BUY",
          sell: "SELL",
          orderNumber: "No. Order",
          quantityLots: "Quantity Lots",
          currentPrice: "Current Price",
          floatingPl: "Floating P/L",
          storage: "Storage",
          facilityFee: "Facility Fee",
          vat: "VAT",
          priceLabel: isBuy ? "Buy Price" : "Sell Price",
        }
      : {
          buy: "BUY",
          sell: "SELL",
          orderNumber: "No. Order",
          quantityLots: "Quantity Lots",
          currentPrice: "Current Price",
          floatingPl: "Floating P/L",
          storage: "Storage",
          facilityFee: "Facility Fee",
          vat: "VAT",
          priceLabel: isBuy ? "Buy Price" : "Sell Price",
        };
  const accentClassName = isBuy ? "text-emerald-400" : "text-yellow-400";
  const orderNumber = item.orderNumber ?? item.id.replace(/\D/g, "").padEnd(10, "0");
  const storageFee = item.storageFee ?? "$ 0.00";
  const facilityFee = item.facilityFee ?? "$ -15.00*";
  const vat = item.vat ?? "$ -1.65";

  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_30%),linear-gradient(180deg,rgba(34,35,40,0.96),rgba(26,27,31,0.98))] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.28)] sm:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
        <div className="flex shrink-0 items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,208,77,0.22),rgba(18,18,18,0.95)_70%)] shadow-[inset_0_2px_16px_rgba(255,212,92,0.28),0_12px_28px_rgba(0,0,0,0.38)] ring-1 ring-yellow-500/20">
            <LiveQuoteInstrumentIcon symbol={item.symbol} className="h-14 w-14" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0">
              <h4 className="break-words text-lg font-black uppercase tracking-tight text-white sm:text-xl">
                {item.instrument}{" "}
                <span className="text-zinc-200">({item.symbol})</span>
              </h4>
              <p className={`mt-1.5 text-lg font-medium tracking-tight sm:text-xl ${accentClassName}`}>
                {isBuy ? labels.buy : labels.sell} $ {item.openPrice}
              </p>
            </div>

            <div className="grid gap-2 text-zinc-400 sm:justify-items-end">
              <div className="flex items-center gap-2.5 text-sm sm:text-base">
                <FontAwesomeIcon icon={["fas", "calendar-days"]} className="text-sm text-zinc-500" />
                <span>{openedDate ?? item.openedAt}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm sm:text-base">
                <FontAwesomeIcon icon={["fas", "clock"]} className="text-sm text-zinc-500" />
                <span>{openedTime ?? item.openedAt}</span>
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2 xl:grid-cols-3">
            <div className="grid gap-y-4">
              <div className="flex items-start justify-between gap-4">
                <p className="text-base font-semibold text-zinc-400">{labels.orderNumber}</p>
                <p className="text-right text-base font-bold text-white">{orderNumber}</p>
              </div>
              <div className="flex items-start justify-between gap-4">
                <p className="text-base font-semibold text-zinc-400">{labels.quantityLots}</p>
                <p className="text-right text-base font-bold text-white">{item.volume}</p>
              </div>
              <div className="flex items-start justify-between gap-4">
                <p className="text-base font-semibold text-zinc-400">{labels.priceLabel}</p>
                <p className="text-right text-base font-bold text-white">$ {item.openPrice}</p>
              </div>
            </div>

            <div className="grid gap-y-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-base font-semibold text-zinc-400">{labels.currentPrice}</p>
                <p className="text-right text-base font-bold text-white">$ {item.currentPrice}</p>
              </div>
              <div className="flex items-center justify-between gap-4">
                <p className="text-base font-semibold leading-tight text-zinc-400">{labels.storage}</p>
                <p className="text-right text-base font-bold text-white">{storageFee}</p>
              </div>
              <div className="flex items-center justify-between gap-4">
                <p className="text-base font-semibold leading-tight text-zinc-400">{labels.facilityFee}</p>
                <p className="text-right text-base font-bold text-white">{facilityFee}</p>
              </div>
            </div>

            <div className="grid gap-y-4 h-fit">
              <div className="flex items-center justify-between gap-4 h-fit">
                <p className="text-base font-semibold text-zinc-400">{labels.floatingPl}</p>
                <p className={`text-right text-base font-bold ${isProfit ? "text-emerald-400" : "text-white"}`}>
                  {item.floatingPl}
                </p>
              </div>
              <div className="flex items-center justify-between gap-4 h-fit">
                <p className="text-base font-semibold text-zinc-400">{labels.vat}</p>
                <p className="text-right text-base font-bold text-white">{vat}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
