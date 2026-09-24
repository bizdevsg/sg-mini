import Link from "next/link";
import type { LucideIcon } from "lucide-react";

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
    "group flex min-h-24 flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/50 p-3 text-center transition-all duration-300 backdrop-blur-sm hover:border-yellow-500/40 hover:bg-zinc-800/60 sm:min-h-32";
  const content = (
    <>
      <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-yellow-500 transition-transform group-hover:scale-110 sm:h-12 sm:w-12">
        <Icon className="h-5 w-5" strokeWidth={2.2} />
      </div>
      <span className="line-clamp-2 text-[11px] font-semibold leading-snug text-zinc-300 sm:text-xs">
        {label}
      </span>
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
