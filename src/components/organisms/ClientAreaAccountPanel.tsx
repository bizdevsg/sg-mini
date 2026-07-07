import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import type {
  AccountSnapshot,
  DashboardCopy,
  TransactionHistoryItem,
} from "@/components/organisms/client-area.types";

type ClientAreaAccountPanelProps = {
  copy: DashboardCopy;
  currentAccount: AccountSnapshot;
  transactionHistory: TransactionHistoryItem[];
};

export function ClientAreaAccountPanel({
  copy,
  currentAccount,
  transactionHistory,
}: ClientAreaAccountPanelProps) {
  return (
    <div className="space-y-6 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-6">
      <h2 className="flex flex-wrap items-center gap-2 text-lg font-bold text-yellow-500 sm:text-xl">
        <FontAwesomeIcon icon={["fas", "user-gear"]} />
        {copy.accountTitle}
      </h2>

      <div className="grid gap-6 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 sm:p-6 md:grid-cols-2">
        <div className="space-y-3">
          <div>
            <span className="text-xs text-zinc-500">Account Owner</span>
            <p className="break-words text-sm font-bold text-zinc-200">
              {currentAccount.accountOwner}
            </p>
          </div>
          <div>
            <span className="text-xs text-zinc-500">Email Address</span>
            <p className="break-all text-sm font-bold text-zinc-200">
              {currentAccount.email}
            </p>
          </div>
          <div>
            <span className="text-xs text-zinc-500">Status Akun</span>
            <div className="mt-1">
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                {currentAccount.status}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <span className="text-xs text-zinc-500">Broker Resmi</span>
            <p className="break-words text-sm font-bold text-yellow-500">
              {currentAccount.broker}
            </p>
          </div>
          <div>
            <span className="text-xs text-zinc-500">Tipe Likuidasi</span>
            <p className="text-sm font-bold text-zinc-200">
              {currentAccount.liquidationType}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 sm:p-6">
        <div className="flex flex-wrap items-center gap-2 text-lg font-bold text-zinc-100">
          <FontAwesomeIcon icon={["fas", "clock-rotate-left"]} className="text-yellow-500" />
          <h3>{copy.transactionHistoryTitle}</h3>
        </div>

        <div className="space-y-3">
          {transactionHistory.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    item.type === "credit"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-rose-500/10 text-rose-400"
                  }`}
                >
                  <FontAwesomeIcon
                    icon={
                      item.type === "credit"
                        ? ["fas", "arrow-down"]
                        : ["fas", "arrow-up"]
                    }
                  />
                </div>

                <div className="min-w-0">
                  <p className="break-words text-sm font-semibold text-zinc-100">{item.title}</p>
                  <p className="text-[11px] text-zinc-500">{item.subtitle}</p>
                </div>
              </div>

              <span
                className={`text-sm font-bold sm:text-right ${
                  item.type === "credit" ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {item.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
