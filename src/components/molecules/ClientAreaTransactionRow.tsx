import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import type { TransactionItem } from "@/components/organisms/client-area.types";

type ClientAreaTransactionRowProps = {
  item: TransactionItem;
};

export function ClientAreaTransactionRow({
  item,
}: ClientAreaTransactionRowProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            item.type === "credit"
              ? "bg-emerald-500/10 text-emerald-500"
              : "bg-rose-500/10 text-rose-500"
          }`}
        >
          <FontAwesomeIcon
            icon={
              item.type === "credit"
                ? ["fas", "arrow-up-long"]
                : ["fas", "arrow-down-long"]
            }
          />
        </div>
        <div>
          <h4 className="text-sm font-bold text-zinc-200">{item.title}</h4>
          <p className="text-[10px] text-zinc-500">{item.subtitle}</p>
        </div>
      </div>

      <span
        className={`text-sm font-bold ${
          item.type === "credit" ? "text-emerald-500" : "text-rose-500"
        }`}
      >
        {item.amount}
      </span>
    </div>
  );
}
