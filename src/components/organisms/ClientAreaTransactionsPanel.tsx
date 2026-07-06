import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ClientAreaTransactionRow } from "@/components/molecules/ClientAreaTransactionRow";
import type {
  DashboardCopy,
  PositionItem,
} from "@/components/organisms/client-area.types";
import type { AppLocale } from "@/locales";

type ClientAreaTransactionsPanelProps = {
  copy: DashboardCopy;
  locale: AppLocale;
  positions: PositionItem[];
};

export function ClientAreaTransactionsPanel({
  copy,
  locale,
  positions,
}: ClientAreaTransactionsPanelProps) {
  const openBuyCount = positions.filter((item) => item.side === "buy").length;
  const openSellCount = positions.length - openBuyCount;
  const labels =
    locale === "id"
      ? {
          total: "Total Posisi",
          buy: "Buy",
          sell: "Sell",
        }
      : {
          total: "Open Positions",
          buy: "Buy",
          sell: "Sell",
        };

  return (
    <div className="space-y-6 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
      <h2 className="flex items-center gap-2 text-xl font-bold text-yellow-500">
        <FontAwesomeIcon icon={["fas", "wave-square"]} />
        {copy.transactionTitle}
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
          <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            {labels.total}
          </p>
          <p className="mt-2 text-2xl font-bold text-zinc-100">
            {positions.length}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-4">
          <p className="text-[10px] uppercase tracking-[0.18em] text-emerald-300/70">
            {labels.buy}
          </p>
          <p className="mt-2 text-2xl font-bold text-emerald-400">
            {openBuyCount}
          </p>
        </div>

        <div className="rounded-2xl border border-rose-500/15 bg-rose-500/5 p-4">
          <p className="text-[10px] uppercase tracking-[0.18em] text-rose-300/70">
            {labels.sell}
          </p>
          <p className="mt-2 text-2xl font-bold text-rose-400">
            {openSellCount}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {positions.map((item) => (
          <ClientAreaTransactionRow key={item.id} item={item} locale={locale} />
        ))}
      </div>
    </div>
  );
}
