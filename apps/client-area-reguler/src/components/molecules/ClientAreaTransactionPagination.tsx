import { ChevronLeft, ChevronRight } from "lucide-react";

type ClientAreaTransactionPaginationProps = {
  hasNextPage: boolean;
  nextLabel: string;
  onPageChange: (page: number) => void;
  page: number;
  pageLabel: string;
  previousLabel: string;
};

export function ClientAreaTransactionPagination({
  hasNextPage,
  nextLabel,
  onPageChange,
  page,
  pageLabel,
  previousLabel,
}: ClientAreaTransactionPaginationProps) {
  if (page === 0 && !hasNextPage) {
    return null;
  }

  const buttonClassName =
    "inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-yellow-500/50 hover:text-yellow-400 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="flex items-center justify-between gap-3 pt-2">
      <button
        type="button"
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
        className={buttonClassName}
      >
        <ChevronLeft aria-hidden="true" className="h-4 w-4" />
        {previousLabel}
      </button>
      <span className="text-sm text-zinc-400">
        {pageLabel} {page + 1}
      </span>
      <button
        type="button"
        disabled={!hasNextPage}
        onClick={() => onPageChange(page + 1)}
        className={buttonClassName}
      >
        {nextLabel}
        <ChevronRight aria-hidden="true" className="h-4 w-4" />
      </button>
    </div>
  );
}
