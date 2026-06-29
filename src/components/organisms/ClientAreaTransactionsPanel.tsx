import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ClientAreaTransactionRow } from "@/components/molecules/ClientAreaTransactionRow";
import type { DashboardCopy } from "@/components/organisms/client-area.types";

type ClientAreaTransactionsPanelProps = {
  copy: DashboardCopy;
};

export function ClientAreaTransactionsPanel({
  copy,
}: ClientAreaTransactionsPanelProps) {
  return (
    <div className="space-y-6 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
      <h2 className="flex items-center gap-2 text-xl font-bold text-yellow-500">
        <FontAwesomeIcon icon={["fas", "clock-rotate-left"]} />
        {copy.transactionTitle}
      </h2>

      <div className="space-y-3">
        {copy.transactions.map((item) => (
          <ClientAreaTransactionRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
