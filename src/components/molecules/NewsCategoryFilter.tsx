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
    <aside className="space-y-4">
      <div className="rounded-xl border border-yellow-500/50 p-4">
        <h4 className="mb-4 font-bold uppercase text-yellow-500">{title}</h4>

        {categories.length ? (
          <>
            <div className="xl:hidden">
              <select
                value={selectedCategory ?? ""}
                onChange={(event) =>
                  onCategoryChange(event.target.value || null)
                }
                className="w-full rounded-lg border border-yellow-500/20 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-yellow-500 focus:outline-none"
              >
                <option value="">{allCategoriesLabel}</option>

                {categories.map((category) => (
                  <option key={category} value={category}>
                    {getCategoryLabel(category, categoryLabels)}
                  </option>
                ))}
              </select>
            </div>

            <ul className="hidden space-y-3 xl:block">
              <li>
                <button
                  type="button"
                  onClick={() => onCategoryChange(null)}
                  className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                    !selectedCategory
                      ? "bg-yellow-500/15 text-yellow-400"
                      : "text-white hover:bg-yellow-500/8"
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
                    className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                      selectedCategory === category
                        ? "bg-yellow-500/15 text-yellow-400"
                        : "text-white hover:bg-yellow-500/8"
                    }`}
                  >
                    {getCategoryLabel(category, categoryLabels)}
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-sm text-gray-400">{emptyBodyText}</p>
        )}

        <p className="mt-4 text-xs text-gray-400">{summaryText}</p>
      </div>
    </aside>
  );
}
