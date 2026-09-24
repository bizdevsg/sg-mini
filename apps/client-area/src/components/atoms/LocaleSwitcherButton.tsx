"use client";

import Image from "next/image";

type LocaleSwitcherButtonProps = {
  ariaControls: string;
  ariaExpanded: boolean;
  ariaLabel: string;
  iconAlt: string;
  iconSrc: string;
  mobilePanel?: boolean;
  onClick: () => void;
};

export function LocaleSwitcherButton({
  ariaControls,
  ariaExpanded,
  ariaLabel,
  iconAlt,
  iconSrc,
  mobilePanel = false,
  onClick,
}: LocaleSwitcherButtonProps) {
  const buttonClass = mobilePanel
    ? "h-10 w-10 justify-center rounded-full border border-white/12 bg-[rgba(22,22,22,0.96)] p-0 text-yellow-500 shadow-[0_12px_28px_rgba(0,0,0,0.35)]"
    : "rounded-full border border-white/10 bg-[rgba(20,20,20,0.94)] p-2 text-yellow-500 shadow-[0_10px_26px_rgba(0,0,0,0.35)]";

  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
      aria-label={ariaLabel}
      onClick={onClick}
      className={`flex cursor-pointer items-center gap-2 text-xs transition-colors duration-300 hover:bg-[#1b1b1b] sm:text-sm ${buttonClass}`}
    >
      <Image
        src={iconSrc}
        alt={iconAlt}
        width={24}
        height={24}
        className="h-5 w-5 rounded-full object-cover"
      />
    </button>
  );
}
