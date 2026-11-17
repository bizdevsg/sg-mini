type ClientAreaMarketActionsProps = {
  isTransactionFilterActive: boolean;
  liveChartLabel: string;
  onOpenLiveChart: () => void;
  onViewTransactions: () => void;
  viewTransactionsLabel: string;
};

export function ClientAreaMarketActions({
  isTransactionFilterActive,
  liveChartLabel,
  onOpenLiveChart,
  onViewTransactions,
  viewTransactionsLabel,
}: ClientAreaMarketActionsProps) {
  return (
    <div className="relative mt-auto grid grid-cols-2 gap-3 pt-7">
      <button
        type="button"
        onClick={onOpenLiveChart}
        className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/15 bg-transparent px-3 text-center text-sm font-bold text-zinc-100 transition hover:border-yellow-400/40 hover:bg-yellow-400/10 hover:text-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300/80"
      >
        {liveChartLabel}
      </button>

      <button
        type="button"
        aria-pressed={isTransactionFilterActive}
        onClick={onViewTransactions}
        className={`inline-flex min-h-12 cursor-pointer items-center justify-center rounded-xl px-3 text-center text-sm font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-200 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 ${isTransactionFilterActive ? "bg-yellow-300 text-black" : "bg-yellow-400 text-black hover:bg-yellow-300"}`}
      >
        {viewTransactionsLabel}
      </button>
    </div>
  );
}
