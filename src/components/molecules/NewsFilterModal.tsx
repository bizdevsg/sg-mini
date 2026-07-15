import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  NewsFilterOptionButtonGroup,
  type NewsFilterOption,
} from "@/components/molecules/NewsFilterOptionButtonGroup";

type NewsFilterModalProps = {
  isOpen: boolean;
  labels: {
    title: string;
    subtitle: string;
    sortBy: string;
    period: string;
    apply: string;
    reset: string;
    close: string;
  };
  sortOptions: NewsFilterOption[];
  periodOptions: NewsFilterOption[];
  draftSort: string;
  draftPeriod: string;
  onDraftSortChange: (value: string) => void;
  onDraftPeriodChange: (value: string) => void;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;
};

export function NewsFilterModal({
  isOpen,
  labels,
  sortOptions,
  periodOptions,
  draftSort,
  draftPeriod,
  onDraftSortChange,
  onDraftPeriodChange,
  onClose,
  onApply,
  onReset,
}: NewsFilterModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="news-filter-title"
        className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#090909]/95 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.7)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400">
              <FontAwesomeIcon icon={["fas", "sliders"]} />
            </div>

            <div>
              <h3 id="news-filter-title" className="text-lg font-semibold text-white">
                {labels.title}
              </h3>

              <p className="text-sm text-zinc-500">{labels.subtitle}</p>
            </div>
          </div>

          <button
            type="button"
            aria-label={labels.close}
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-white/5 hover:text-white"
          >
            <FontAwesomeIcon icon={["fas", "xmark"]} />
          </button>
        </div>

        <div className="mt-6 space-y-6">
          <NewsFilterOptionButtonGroup
            title={labels.sortBy}
            options={sortOptions}
            selectedValue={draftSort}
            onChange={onDraftSortChange}
          />

          <NewsFilterOptionButtonGroup
            title={labels.period}
            options={periodOptions}
            selectedValue={draftPeriod}
            onChange={onDraftPeriodChange}
          />
        </div>

        <div className="mt-8 border-t border-white/10 pt-5">
          <button
            type="button"
            onClick={onApply}
            className="w-full rounded-xl bg-yellow-500 py-3 text-sm font-semibold text-black transition hover:bg-yellow-400"
          >
            {labels.apply}
          </button>

          <button
            type="button"
            onClick={onReset}
            className="mt-3 w-full rounded-xl border border-white/10 py-3 text-sm font-medium text-zinc-300 transition hover:bg-white/5"
          >
            {labels.reset}
          </button>
        </div>
      </div>
    </div>
  );
}
