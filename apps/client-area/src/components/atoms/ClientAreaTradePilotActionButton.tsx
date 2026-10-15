import type { ReactNode } from "react";

type ClientAreaTradePilotActionButtonProps = {
  children: ReactNode;
  disabled?: boolean;
  icon: ReactNode;
  onClick?: () => void;
  variant: "primary" | "outline";
};

const VARIANT_CLASS_NAMES = {
  primary: "bg-yellow-500 text-black hover:bg-yellow-400",
  outline:
    "border border-yellow-500/60 text-yellow-400 hover:bg-yellow-500/10",
} as const;

export function ClientAreaTradePilotActionButton({
  children,
  disabled = false,
  icon,
  onClick,
  variant,
}: ClientAreaTradePilotActionButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex w-full items-center justify-center gap-3 rounded-2xl px-4 py-4 font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT_CLASS_NAMES[variant]}`}
    >
      {icon}
      {children}
    </button>
  );
}
