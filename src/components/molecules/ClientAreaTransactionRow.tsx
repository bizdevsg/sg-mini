import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
  const labels =
    locale === "id"
      ? {
          buy: "beli",
          sell: "jual",
          volume: "Volume",
          open: "Open",
          current: "Current",
          status: "Status",
          profit: "Profit",
          loss: "Loss",
        }
      : {
          buy: "buy",
          sell: "sell",
          volume: "Volume",
          open: "Open",
          current: "Current",
          status: "Status",
          profit: "Profit",
          loss: "Loss",
        };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4">
      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            isBuy
              ? "bg-emerald-500/10 text-emerald-500"
              : "bg-rose-500/10 text-rose-500"
          }`}
        >
          <FontAwesomeIcon
            icon={
              isBuy
                ? ["fas", "arrow-up-long"]
                : ["fas", "arrow-down-long"]
            }
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-sm font-bold text-zinc-100">{item.instrument}</h4>
                <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
                  {item.symbol}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] ${
                    isBuy
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-rose-500/10 text-rose-400"
                  }`}
                >
                  {isBuy ? labels.buy : labels.sell}
                </span>
              </div>

              <p className="mt-1 text-[11px] text-zinc-500">{item.openedAt}</p>
            </div>

            <span
              className={`text-sm font-bold ${
                isProfit ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {item.floatingPl}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
            <div className="rounded-xl border border-white/5 bg-black/20 px-3 py-2">
              <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                {labels.volume}
              </p>
              <p className="mt-1 font-semibold text-zinc-100">{item.volume}</p>
            </div>

            <div className="rounded-xl border border-white/5 bg-black/20 px-3 py-2">
              <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                {labels.open}
              </p>
              <p className="mt-1 font-semibold text-zinc-100">{item.openPrice}</p>
            </div>

            <div className="rounded-xl border border-white/5 bg-black/20 px-3 py-2">
              <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                {labels.current}
              </p>
              <p className="mt-1 font-semibold text-zinc-100">{item.currentPrice}</p>
            </div>

            <div className="rounded-xl border border-white/5 bg-black/20 px-3 py-2">
              <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                {labels.status}
              </p>
              <p
                className={`mt-1 font-semibold ${
                  isProfit ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {isProfit ? labels.profit : labels.loss}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
