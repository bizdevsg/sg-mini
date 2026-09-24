import { type ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type ClientAreaAccordionItemProps = {
  children: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  title: string;
};

export function ClientAreaAccordionItem({
  children,
  isOpen,
  onToggle,
  title,
}: ClientAreaAccordionItemProps) {
  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-[26px] bg-gradient-to-r from-yellow-500 to-amber-400 px-4 py-4 text-left text-base font-bold text-black shadow-[0_10px_30px_rgba(245,158,11,0.18)] transition hover:brightness-105 sm:px-7 sm:text-lg"
      >
        <span className="min-w-0">{title}</span>
        <FontAwesomeIcon
          icon={["fas", "chevron-down"]}
          className={`text-base transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen ? (
        <div className="rounded-[18px] border border-zinc-800 bg-[#232428] p-4">
          {children}
        </div>
      ) : null}
    </div>
  );
}
