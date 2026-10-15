import type { LucideIcon } from "lucide-react";

type ClientAreaTradePilotGuideCategoryButtonProps = {
  active: boolean;
  icon: LucideIcon;
  label: string;
  onClick: () => void;
};

export function ClientAreaTradePilotGuideCategoryButton({
  active,
  icon: Icon,
  label,
  onClick,
}: ClientAreaTradePilotGuideCategoryButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition sm:px-4 ${active
        ? "border-yellow-500 bg-yellow-500/10 text-yellow-400"
        : "border-zinc-800 bg-[#101113]/50 text-zinc-400 hover:border-zinc-700 hover:text-white"
        }`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </button>
  );
}
