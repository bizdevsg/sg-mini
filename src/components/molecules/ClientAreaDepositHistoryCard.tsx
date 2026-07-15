import { formatUsd } from "@/components/organisms/client-area.shared";
import type {
  DepositHistoryItem,
  DepositHistoryStatus,
} from "@/components/organisms/client-area.types";
import { getMessages } from "@/locales";

type ClientAreaDepositHistoryCardProps = {
  item: DepositHistoryItem;
  labels: ReturnType<typeof getMessages>["clientArea"]["depositHistoryPage"];
};

function maskAccountNumber(value: string) {
  if (value.length <= 4) {
    return value;
  }

  return `****${value.slice(-4)}`;
}

function getStatusTone(status: DepositHistoryStatus) {
  switch (status) {
    case "completed":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    case "processing":
      return "border-sky-500/30 bg-sky-500/10 text-sky-300";
    case "rejected":
      return "border-rose-500/30 bg-rose-500/10 text-rose-300";
    case "pending":
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
  }
}

function getStatusLabel(
  status: DepositHistoryStatus,
  labels: ReturnType<typeof getMessages>["clientArea"]["depositHistoryPage"]["status"],
) {
  switch (status) {
    case "completed":
      return labels.completed;
    case "processing":
      return labels.processing;
    case "rejected":
      return labels.rejected;
    case "pending":
      return labels.pending;
  }
}

export function ClientAreaDepositHistoryCard({
  item,
  labels,
}: ClientAreaDepositHistoryCardProps) {
  return (
    <article className="rounded-[22px] border border-zinc-800 bg-zinc-900/70 px-4 py-4 sm:px-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold text-white">{item.id}</h3>
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${getStatusTone(item.status)}`}
            >
              {getStatusLabel(item.status, labels.status)}
            </span>
          </div>
          <p className="mt-2 text-sm text-zinc-400">{item.requestedAt}</p>
        </div>

        <div className="sm:text-right">
          <p className="text-xl font-black text-white">{formatUsd(item.amount)}</p>
          <p className="mt-1 text-xs text-zinc-500">
            {labels.list.creditedAmount}: {formatUsd(item.creditedAmount)}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            {labels.list.source}
          </p>
          <p className="mt-1 text-zinc-100">
            {item.sourceBank} / {maskAccountNumber(item.sourceAccountNumber)}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            {labels.list.senderName}
          </p>
          <p className="mt-1 text-zinc-100">{item.senderName}</p>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            {labels.list.tradingAccount}
          </p>
          <p className="mt-1 text-zinc-100">{item.tradingAccountId}</p>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            {labels.list.fee}
          </p>
          <p className="mt-1 text-zinc-100">{formatUsd(item.fee)}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 border-t border-white/5 pt-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            {labels.list.processedDate}
          </p>
          <p className="mt-1 text-zinc-100">{item.processedAt ?? "-"}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            {labels.list.reference}
          </p>
          <p className="mt-1 text-zinc-100">{item.referenceNumber}</p>
        </div>
        <div className="sm:max-w-[60%] sm:text-right">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            {labels.list.note}
          </p>
          <p className="mt-1 text-zinc-300">{item.note ?? "-"}</p>
        </div>
      </div>
    </article>
  );
}
