import type { MouseEventHandler, ReactNode } from "react";

type ClientAreaTradePilotIconButtonProps = {
  active?: boolean;
  children: ReactNode;
  disabled?: boolean;
  label: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export function ClientAreaTradePilotIconButton({
  active,
  children,
  disabled = false,
  label,
  onClick,
}: ClientAreaTradePilotIconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-xl border p-2.5 transition disabled:cursor-not-allowed disabled:opacity-50 ${
        active
          ? "border-yellow-500/60 bg-yellow-500/15 text-yellow-400"
          : "border-zinc-800 bg-zinc-900/70 backdrop-blur-sm text-zinc-400 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
