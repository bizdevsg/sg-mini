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
  centerControls?: boolean;
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
  centerControls = false,
}: PaginationControlsProps) {
  const isPreviousDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  return (
    <div
      className={``}
    >
      <div
        className={`flex items-center gap-2 justify-between`}
      >
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

      {centerControls ? <div className="hidden sm:block" /> : null}
    </div>
  );
}
