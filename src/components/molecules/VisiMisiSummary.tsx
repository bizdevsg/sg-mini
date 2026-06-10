import type { ReactNode } from "react";

type VisiMisiSummaryProps = {
  children: ReactNode;
};

export function VisiMisiSummary({ children }: VisiMisiSummaryProps) {
  return (
    <div className="mt-4 rounded-[28px] border border-white/8 bg-black/20 p-5 text-zinc-300 sm:p-6">
      {children}
    </div>
  );
}
