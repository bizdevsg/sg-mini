import type { LucideIcon } from "lucide-react";
import Link from "next/link";

type ClientAreaSidebarButtonProps = {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
};

export function ClientAreaSidebarButton({
  href,
  icon: Icon,
  label,
  isActive,
}: ClientAreaSidebarButtonProps) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-200 ${isActive
        ? "bg-amber-500/12 text-amber-400"
        : "text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-100"
        }`}
    >
      <span
        className={`absolute inset-y-2 left-0 w-0.5 rounded-full bg-amber-400 transition-opacity ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
      />
      <Icon
        className={`h-[18px] w-[18px] shrink-0 transition-colors ${
          isActive ? "text-amber-400" : "text-zinc-500 group-hover:text-zinc-300"
        }`}
      />
      <span className="text-sm font-medium leading-tight">{label}</span>
    </Link>
  );
}
