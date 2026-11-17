"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type ClientAreaScrollArrowButtonProps = {
  ariaLabel: string;
  direction: "left" | "right";
  disabled?: boolean;
  className?: string;
  onClick: () => void;
};

export function ClientAreaScrollArrowButton({
  ariaLabel,
  direction,
  disabled = false,
  className,
  onClick,
}: ClientAreaScrollArrowButtonProps) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-zinc-900/80 text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-30 ${className}`}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
