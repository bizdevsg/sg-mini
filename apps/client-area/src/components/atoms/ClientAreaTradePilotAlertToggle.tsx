type ClientAreaTradePilotAlertToggleProps = {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
};

export function ClientAreaTradePilotAlertToggle({
  checked,
  label,
  onChange,
}: ClientAreaTradePilotAlertToggleProps) {
  return (
    <button
      aria-checked={checked}
      aria-label={label}
      className={`relative h-9 w-16 shrink-0 rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${
        checked
          ? "border-orange-400/70 bg-orange-500"
          : "border-zinc-700 bg-zinc-700/70"
      }`}
      onClick={() => onChange(!checked)}
      role="switch"
      type="button"
    >
      <span
        className={`absolute left-1 top-1 h-7 w-7 rounded-full border border-white/20 bg-zinc-200 shadow-sm transition-transform duration-200 ${
          checked ? "translate-x-7" : "translate-x-0"
        }`}
      />
    </button>
  );
}
