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
  categoryTitle?: string;
  categoryOptions?: NewsFilterOption[];
  sortOptions: NewsFilterOption[];
  periodOptions: NewsFilterOption[];
  draftCategory?: string;
  draftSort: string;
  draftPeriod: string;
  onDraftCategoryChange?: (value: string) => void;
  onDraftSortChange: (value: string) => void;
  onDraftPeriodChange: (value: string) => void;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;
};

export function NewsFilterModal({
  isOpen,
  labels,
  categoryTitle,
  categoryOptions,
  sortOptions,
  periodOptions,
  draftCategory,
  draftSort,
  draftPeriod,
  onDraftCategoryChange,
  onDraftSortChange,
  onDraftPeriodChange,
  onClose,
  onApply,
  onReset,
}: NewsFilterModalProps) {
  if (!isOpen) {
    return null;
  }

  const hasCategoryFilter = Boolean(
    categoryTitle &&
      categoryOptions &&
      draftCategory !== undefined &&
      onDraftCategoryChange,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="news-filter-title"
        className={`flex max-h-[calc(100vh-2rem)] w-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0b0c0f]/97 shadow-[0_30px_80px_rgba(0,0,0,0.7)] ${
          hasCategoryFilter ? "max-w-2xl" : "max-w-lg"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6 sm:py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-yellow-500/20 bg-yellow-500/10 text-yellow-400">
              <FontAwesomeIcon icon={["fas", "sliders"]} />
            </div>

            <div>
              <h3 id="news-filter-title" className="text-lg font-semibold text-white">
                {labels.title}
              </h3>

              <p className="mt-0.5 text-xs text-zinc-500 sm:text-sm">
                {labels.subtitle}
              </p>
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

        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          {categoryTitle &&
          categoryOptions &&
          draftCategory !== undefined &&
          onDraftCategoryChange ? (
            <NewsFilterOptionButtonGroup
              title={categoryTitle}
              options={categoryOptions}
              selectedValue={draftCategory}
              layout="chips"
              onChange={onDraftCategoryChange}
            />
          ) : null}

          <NewsFilterOptionButtonGroup
            title={labels.sortBy}
            options={sortOptions}
            selectedValue={draftSort}
            layout={hasCategoryFilter ? "two-column" : "stack"}
            onChange={onDraftSortChange}
          />

          <NewsFilterOptionButtonGroup
            title={labels.period}
            options={periodOptions}
            selectedValue={draftPeriod}
            layout={hasCategoryFilter ? "two-column" : "stack"}
            onChange={onDraftPeriodChange}
          />
        </div>

        <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-white/10 bg-[#0b0c0f] px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onReset}
            className="min-h-11 rounded-xl border border-white/10 px-5 text-sm font-medium text-zinc-300 transition hover:border-white/20 hover:bg-white/5 sm:min-w-28"
          >
            {labels.reset}
          </button>

          <button
            type="button"
            onClick={onApply}
            className="min-h-11 rounded-xl bg-yellow-500 px-6 text-sm font-semibold text-black transition hover:bg-yellow-400 sm:min-w-36"
          >
            {labels.apply}
          </button>
        </div>
      </div>
    </div>
  );
}
