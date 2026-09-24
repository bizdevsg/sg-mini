"use client";

import Image from "next/image";
import Link from "next/link";

type LocaleOptionLinkProps = {
  activeLabel: string;
  href: string;
  iconAlt: string;
  iconSrc: string;
  isActive: boolean;
  localeCode: string;
  onClick: () => void;
  title: string;
};

export function LocaleOptionLink({
  activeLabel,
  href,
  iconAlt,
  iconSrc,
  isActive,
  localeCode,
  onClick,
  title,
}: LocaleOptionLinkProps) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      title={title}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-[22px] border px-4 py-3 text-left transition-all duration-200 ${
        isActive
          ? "border-yellow-500/35 bg-yellow-500/10 text-yellow-300"
          : "border-white/8 bg-white/[0.03] text-zinc-200 hover:border-white/14 hover:bg-white/[0.05] hover:text-white"
      }`}
    >
      <Image
        src={iconSrc}
        alt={iconAlt}
        width={28}
        height={28}
        className="h-7 w-7 rounded-full object-cover"
      />

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-0.5 text-xs uppercase tracking-[0.22em] text-zinc-500">
          {localeCode}
        </p>
      </div>

      {isActive ? (
        <span className="rounded-full border border-yellow-500/25 bg-yellow-500/12 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-yellow-300">
          {activeLabel}
        </span>
      ) : null}
    </Link>
  );
}
