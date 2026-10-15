import { DollarSign } from "lucide-react";

type ClientAreaTradePilotCurrencyFieldProps = {
  label: string;
  onValueChange: (value: string) => void;
  value: string;
};

export function ClientAreaTradePilotCurrencyField({
  label,
  onValueChange,
  value,
}: ClientAreaTradePilotCurrencyFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold text-zinc-400 sm:text-sm">
        {label}
      </span>
      <span className="flex items-center gap-4 overflow-hidden rounded-xl border border-zinc-700 bg-blue-900/10 text-zinc-200 focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500">
        <span className="bg-blue-50/10 px-4 py-3.5 text-zinc-400">
          <DollarSign className="h-4 w-4" />
        </span>
        <input
          aria-label={label}
          className="min-w-0 flex-1 bg-transparent text-sm font-bold outline-none"
          min="0"
          onChange={(event) => onValueChange(event.target.value)}
          step="1"
          type="number"
          value={value}
        />
      </span>
    </label>
  );
}
