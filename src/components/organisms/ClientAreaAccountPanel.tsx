import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import type {
  AccountSnapshot,
  DashboardCopy,
} from "@/components/organisms/client-area.types";

type ClientAreaAccountPanelProps = {
  copy: DashboardCopy;
  currentAccount: AccountSnapshot;
};

export function ClientAreaAccountPanel({
  copy,
  currentAccount,
}: ClientAreaAccountPanelProps) {
  return (
    <div className="space-y-6 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
      <h2 className="flex items-center gap-2 text-xl font-bold text-yellow-500">
        <FontAwesomeIcon icon={["fas", "user-gear"]} />
        {copy.accountTitle}
      </h2>

      <div className="grid gap-6 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 md:grid-cols-2">
        <div className="space-y-3">
          <div>
            <span className="text-xs text-zinc-500">Account Owner</span>
            <p className="text-sm font-bold text-zinc-200">
              {currentAccount.accountOwner}
            </p>
          </div>
          <div>
            <span className="text-xs text-zinc-500">Email Address</span>
            <p className="text-sm font-bold text-zinc-200">
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
            <p className="text-sm font-bold text-yellow-500">
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
    </div>
  );
}
