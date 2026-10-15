type ClientAreaTradePilotStaticOptionProps = {
  active?: boolean;
  disabled?: boolean;
  label: string;
  desc?: string;
  onClick?: () => void;
  textAlign?: "center" | "left";
};

export function ClientAreaTradePilotStaticOption({
  active = false,
  disabled = false,
  label,
  desc,
  onClick,
  textAlign = "left",
}: ClientAreaTradePilotStaticOptionProps) {
  const textAlignClassName =
    textAlign === "center" ? "text-center" : "text-left";

  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`w-full cursor-pointer rounded-xl border px-4 py-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm ${textAlignClassName} ${active
        ? "border-amber-500 bg-amber-500/10 text-white"
        : "border-blue-700/20 bg-blue-500/10 text-zinc-300 hover:border-amber-500/60 hover:bg-amber-500/5"
        }`}
    >
      <div className="flex flex-col">
        <span>{label}</span>
        {desc ? (
          <span className="mt-1 text-[11px] font-normal leading-4 text-zinc-400 sm:text-xs">
            {desc}
          </span>
        ) : null}
      </div>
    </button>
  );
}
