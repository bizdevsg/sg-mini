import type { LucideIcon } from "lucide-react";

type ClientAreaTradePilotPlanTabButtonProps = {
  active: boolean;
  badge?: string;
  Icon: LucideIcon;
  label: string;
  onClick: () => void;
  tone?: "buy" | "sell" | "warning";
};

export function ClientAreaTradePilotPlanTabButton({
  active,
  badge,
  Icon,
  label,
  onClick,
  tone = "buy",
}: ClientAreaTradePilotPlanTabButtonProps) {
  const activeClassName =
    tone === "warning"
      ? "border-orange-400 text-orange-400"
      : tone === "sell"
        ? "border-red-400 text-red-400"
        : "border-emerald-400 text-emerald-400";

  const focusClassName =
    tone === "warning"
      ? "focus-visible:ring-orange-400"
      : tone === "sell"
        ? "focus-visible:ring-red-400"
        : "focus-visible:ring-emerald-400";

  return (
    <button
      aria-selected={active}
      className={`flex min-h-14 cursor-pointer items-center justify-center gap-2 border-b-2 px-3 py-2.5 text-center text-xs font-semibold transition hover:bg-white/5 hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 sm:text-sm ${focusClassName} ${active ? activeClassName : "border-transparent text-zinc-400"}`}
      onClick={onClick}
      role="tab"
      type="button"
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span>{label}</span>
      {badge ? (
        <span className="rounded-full border border-zinc-500 px-1.5 py-0.5 text-[10px]">
          {badge}
        </span>
      ) : null}
    </button>
  );
}
