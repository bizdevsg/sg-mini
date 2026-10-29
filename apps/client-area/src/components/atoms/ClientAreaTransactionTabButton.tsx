import type { ReactNode } from "react";

type ClientAreaTransactionTabButtonProps = {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
  roundedClassName?: string;
};

export function ClientAreaTransactionTabButton({
  active,
  children,
  onClick,
  roundedClassName = "",
}: ClientAreaTransactionTabButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`min-h-10 flex-1 cursor-pointer px-4 text-xs font-semibold transition-all sm:flex-none sm:px-5 sm:text-sm ${roundedClassName} ${
        active
          ? "bg-yellow-500 text-black shadow-[0_8px_20px_rgba(234,179,8,0.25)]"
          : "text-zinc-300 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
