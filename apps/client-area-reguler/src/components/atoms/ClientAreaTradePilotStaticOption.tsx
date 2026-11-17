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
        ? "border-yellow-500 bg-yellow-500/10 text-white"
        : "border-zinc-700 bg-zinc-800/70 text-zinc-300 hover:border-yellow-500/60 hover:bg-zinc-700/70"
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
