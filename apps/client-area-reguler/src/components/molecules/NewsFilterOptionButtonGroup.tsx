type NewsFilterOption = {
  value: string;
  label: string;
};

type NewsFilterOptionButtonGroupProps = {
  title: string;
  options: NewsFilterOption[];
  selectedValue: string;
  layout?: "stack" | "two-column" | "chips";
  onChange: (value: string) => void;
};

export function NewsFilterOptionButtonGroup({
  title,
  options,
  selectedValue,
  layout = "stack",
  onChange,
}: NewsFilterOptionButtonGroupProps) {
  const optionsClassName =
    layout === "chips"
      ? "grid grid-cols-2 gap-2 sm:grid-cols-3"
      : layout === "two-column"
        ? "grid grid-cols-2 gap-3"
        : "grid gap-3";

  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-yellow-400">
        {title}
      </p>

      <div className={optionsClassName}>
        {options.map((option) => {
          const isSelected = selectedValue === option.value;
          const isChip = layout === "chips";

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(option.value)}
              className={`flex min-w-0 items-center rounded-xl border transition ${
                isChip
                  ? "min-h-10 justify-center px-3 py-2 text-center"
                  : "min-h-12 justify-between gap-3 p-3 text-left"
              } ${
                isSelected
                  ? isChip
                    ? "border-yellow-400 bg-yellow-400 text-black shadow-[0_8px_24px_rgba(250,204,21,0.12)]"
                    : "border-yellow-500 bg-yellow-500/10"
                  : "border-white/10 bg-white/[0.025] text-white hover:border-yellow-500/30 hover:bg-white/[0.05]"
              }`}
            >
              <span
                className={`min-w-0 text-sm ${
                  isChip
                    ? "line-clamp-2 font-medium leading-5"
                    : "truncate text-white"
                }`}
              >
                {option.label}
              </span>

              {!isChip ? (
                <div
                  className={`h-4 w-4 shrink-0 rounded-full border-2 transition ${
                    isSelected
                      ? "border-yellow-500 bg-yellow-500"
                      : "border-zinc-600"
                  }`}
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export type { NewsFilterOption };
