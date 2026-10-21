import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";

type ClientAreaQuickActionButtonProps = {
  href?: string;
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
};

export function ClientAreaQuickActionButton({
  href,
  icon,
  label,
  onClick,
}: ClientAreaQuickActionButtonProps) {
  const Icon = icon;
  const className =
    "group flex min-h-16 w-full items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-left transition-all duration-300 backdrop-blur-sm hover:border-yellow-500/40 hover:bg-zinc-800/60";
  const content = (
    <>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-yellow-500 transition-transform group-hover:scale-110">
        <Icon className="h-5 w-5" strokeWidth={2.2} />
      </div>
      <span className="min-w-0 flex-1 text-sm font-semibold text-zinc-200">
        {label}
      </span>
      <ChevronRight
        aria-hidden="true"
        className="h-4 w-4 shrink-0 text-zinc-600 transition-transform group-hover:translate-x-0.5 group-hover:text-yellow-500"
      />
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}
