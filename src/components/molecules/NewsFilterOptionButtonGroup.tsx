type NewsFilterOption = {
  value: string;
  label: string;
};

type NewsFilterOptionButtonGroupProps = {
  title: string;
  options: NewsFilterOption[];
  selectedValue: string;
  onChange: (value: string) => void;
};

export function NewsFilterOptionButtonGroup({
  title,
  options,
  selectedValue,
  onChange,
}: NewsFilterOptionButtonGroupProps) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-yellow-400">{title}</p>

      <div className="grid gap-3">
        {options.map((option) => {
          const isSelected = selectedValue === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`flex items-center justify-between rounded-xl border p-4 text-left transition ${
                isSelected
                  ? "border-yellow-500 bg-yellow-500/10"
                  : "border-white/10 bg-white/[0.02] hover:border-white/20"
              }`}
            >
              <span className="text-sm text-white">{option.label}</span>

              <div
                className={`h-5 w-5 rounded-full border-2 transition ${
                  isSelected
                    ? "border-yellow-500 bg-yellow-500"
                    : "border-zinc-600"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export type { NewsFilterOption };
