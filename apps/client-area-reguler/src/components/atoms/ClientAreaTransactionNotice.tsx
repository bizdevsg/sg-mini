import type { ReactNode } from "react";

type ClientAreaTransactionNoticeProps = {
  actionLabel?: string;
  children: ReactNode;
  onAction?: () => void;
  tone?: "default" | "error";
};

export function ClientAreaTransactionNotice({
  actionLabel,
  children,
  onAction,
  tone = "default",
}: ClientAreaTransactionNoticeProps) {
  const isError = tone === "error";

  return (
    <div
      className={
        isError
          ? "flex items-center justify-between gap-3 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-4 text-sm text-red-300"
          : "rounded-2xl border border-dashed border-zinc-700 bg-black/20 px-4 py-6 text-center text-sm text-zinc-400"
      }
    >
      <span>{children}</span>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="cursor-pointer rounded-lg border border-red-400/40 px-3 py-1 text-xs font-semibold text-red-200 transition hover:bg-red-500/15"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
