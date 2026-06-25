import { NEWS_FILTER_CATEGORIES } from "@/lib/news.shared";

type NewsCategoryFilterProps = {
  title: string;
  allCategoriesLabel: string;
  categories: typeof NEWS_FILTER_CATEGORIES;
  selectedCategory: string | null;
  categoryLabels: Record<string, string>;
  summaryText: string;
  emptyBodyText: string;
  onCategoryChange: (category: string | null) => void;
};

function getCategoryLabel(
  category: (typeof NEWS_FILTER_CATEGORIES)[number],
  categoryLabels: Record<string, string>,
) {
  return categoryLabels[category] ?? category;
}

export function NewsCategoryFilter({
  title,
  allCategoriesLabel,
  categories,
  selectedCategory,
  categoryLabels,
  summaryText,
  emptyBodyText,
  onCategoryChange,
}: NewsCategoryFilterProps) {
  return (
    <aside className="h-fit xl:sticky xl:top-24">
      <div className="rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-sm sm:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-yellow-400">
          {title}
        </p>
        <p className="mt-3 text-sm leading-7 text-zinc-400">{summaryText}</p>

        {categories.length ? (
          <>
            <div className="mt-5 xl:hidden">
              <select
                value={selectedCategory ?? ""}
                onChange={(event) =>
                  onCategoryChange(event.target.value || null)
                }
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white focus:border-yellow-500 focus:outline-none"
              >
                <option value="">{allCategoriesLabel}</option>

                {categories.map((category) => (
                  <option key={category} value={category}>
                    {getCategoryLabel(category, categoryLabels)}
                  </option>
                ))}
              </select>
            </div>

            <ul className="mt-6 hidden space-y-2 xl:block">
              <li>
                <button
                  type="button"
                  onClick={() => onCategoryChange(null)}
                  className={`block w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${!selectedCategory
                      ? "border-yellow-500/30 bg-yellow-500/12 text-yellow-400"
                      : "border-white/8 bg-black/20 text-white hover:border-yellow-500/15 hover:bg-yellow-500/8"
                    }`}
                >
                  {allCategoriesLabel}
                </button>
              </li>

              {categories.map((category) => (
                <li key={category}>
                  <button
                    type="button"
                    onClick={() => onCategoryChange(category)}
                    className={`block w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${selectedCategory === category
                        ? "border-yellow-500/30 bg-yellow-500/12 text-yellow-400"
                        : "border-white/8 bg-black/20 text-white hover:border-yellow-500/15 hover:bg-yellow-500/8"
                      }`}
                  >
                    {getCategoryLabel(category, categoryLabels)}
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="mt-5 text-sm text-gray-400">{emptyBodyText}</p>
        )}
      </div>
    </aside>
  );
}
