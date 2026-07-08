"use client";

import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type ClientAreaDecorativeIconBadgeProps = {
  className: string;
  icon: IconProp;
  iconClassName?: string;
  tone?: "dark" | "light";
};

export function ClientAreaDecorativeIconBadge({
  className,
  icon,
  iconClassName = "text-lg",
  tone = "dark",
}: ClientAreaDecorativeIconBadgeProps) {
  const palette =
    tone === "light"
      ? "border-zinc-700 bg-black/80 text-white"
      : "border-yellow-500/30 bg-black/75 text-yellow-400";

  return (
    <div
      className={`flex items-center justify-center shadow-[0_18px_35px_rgba(245,158,11,0.18)] ${palette} ${className}`}
    >
      <FontAwesomeIcon icon={icon} className={iconClassName} />
    </div>
  );
}
