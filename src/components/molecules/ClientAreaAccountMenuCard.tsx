import Link from "next/link";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type ClientAreaAccountMenuCardProps = {
  helperText: string;
  href?: string;
  icon: IconProp;
  label: string;
  onClick?: () => void;
};

export function ClientAreaAccountMenuCard({
  helperText,
  href,
  icon,
  label,
  onClick,
}: ClientAreaAccountMenuCardProps) {
  const isInteractive = Boolean(href || onClick);
  const className = `group flex min-h-40 w-full flex-col rounded-2xl border p-5 text-left transition-all duration-300 ${
    isInteractive
      ? "border-white/10 bg-[#1a1a1a]/85 hover:-translate-y-1 hover:border-yellow-500/45 hover:bg-[#202020] hover:shadow-xl hover:shadow-black/25"
      : "cursor-default border-white/[0.06] bg-[#171717]/65"
  }`;

  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        <span
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border text-yellow-400 ${
            isInteractive
              ? "border-yellow-500/30 bg-yellow-500/10"
              : "border-white/10 bg-white/[0.035] text-zinc-500"
          }`}
        >
          <FontAwesomeIcon icon={icon} className="text-lg" />
        </span>
        {isInteractive ? (
          <FontAwesomeIcon
            icon={["fas", "arrow-right"]}
            className="mt-2 text-xs text-zinc-600 transition group-hover:translate-x-1 group-hover:text-yellow-400"
          />
        ) : (
          <FontAwesomeIcon
            icon={["fas", "lock"]}
            className="mt-2 text-xs text-zinc-700"
          />
        )}
      </div>

      <span className={`mt-5 text-base font-semibold ${isInteractive ? "text-white" : "text-zinc-400"}`}>
        {label}
      </span>
      <span className="mt-2 text-sm leading-5 text-zinc-500">
        {helperText}
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} prefetch={false} className={className}>
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {content}
      </button>
    );
  }

  return (
    <div aria-disabled="true" className={className}>
      {content}
    </div>
  );
}
