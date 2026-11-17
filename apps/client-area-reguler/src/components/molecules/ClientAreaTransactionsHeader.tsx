import { ClientAreaTransactionTabButton } from "@/components/atoms/ClientAreaTransactionTabButton";

export type ClientAreaTransactionTab = "open" | "history";

type ClientAreaTransactionsHeaderProps = {
  activeTab: ClientAreaTransactionTab;
  allTransactionsLabel: string;
  description: string;
  onShowAllTransactions: () => void;
  onTabChange: (tab: ClientAreaTransactionTab) => void;
  tabLabels: Record<ClientAreaTransactionTab, string>;
  title: string;
  transactionFilter?: string | null;
};

export function ClientAreaTransactionsHeader({
  activeTab,
  allTransactionsLabel,
  description,
  onShowAllTransactions,
  onTabChange,
  tabLabels,
  title,
  transactionFilter,
}: ClientAreaTransactionsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-2xl font-bold">{title}</h3>
          {transactionFilter ? (
            <span className="rounded-full border border-yellow-400/25 bg-yellow-400/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-yellow-300">
              {transactionFilter.replace(/_BBJ$/, "")}
            </span>
          ) : null}
        </div>
        <p>{description}</p>
      </div>

      <div
        role="group"
        aria-label={title}
        className="inline-flex w-full rounded-full border border-white/10 bg-black/40 p-1 sm:w-auto"
      >
        <button
          type="button"
          aria-pressed={!transactionFilter}
          onClick={onShowAllTransactions}
          className={`min-h-10 flex-1 cursor-pointer rounded-l-full px-4 text-xs font-semibold transition-all sm:flex-none sm:px-5 sm:text-sm ${
            transactionFilter
              ? "text-zinc-300 hover:text-yellow-300"
              : "bg-yellow-500/15 text-yellow-300"
          }`}
        >
          {allTransactionsLabel}
        </button>

        {(["open", "history"] as const).map((tab) => (
          <ClientAreaTransactionTabButton
            key={tab}
            active={activeTab === tab}
            onClick={() => onTabChange(tab)}
            roundedClassName={tab === "history" ? "rounded-r-full" : ""}
          >
            {tabLabels[tab]}
          </ClientAreaTransactionTabButton>
        ))}
      </div>
    </div>
  );
}
