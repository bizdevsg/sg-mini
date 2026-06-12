import type { ReactNode } from "react";

type PaginationControlsProps = {
  previousLabel: string;
  nextLabel: string;
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  summary?: ReactNode;
  centerContent?: ReactNode;
  className?: string;
};

export function PaginationControls({
  previousLabel,
  nextLabel,
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  summary,
  centerContent,
  className = "",
}: PaginationControlsProps) {
  const isPreviousDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  return (
    <div
      className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      {summary ? <div className="text-sm text-foreground/58">{summary}</div> : <div />}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrevious}
          disabled={isPreviousDisabled}
          className="rounded-full border border-line px-4 py-2 text-sm text-foreground/78 transition-colors hover:border-yellow-500/60 hover:text-yellow-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {previousLabel}
        </button>

        {centerContent}

        <button
          type="button"
          onClick={onNext}
          disabled={isNextDisabled}
          className="rounded-full border border-line px-4 py-2 text-sm text-foreground/78 transition-colors hover:border-yellow-500/60 hover:text-yellow-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {nextLabel}
        </button>
      </div>
    </div>
  );
}
