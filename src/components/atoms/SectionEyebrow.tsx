import type { ReactNode } from "react";

type SectionEyebrowProps = {
  children: ReactNode;
  className?: string;
  textClassName?: string;
  align?: "left" | "center";
};

export function SectionEyebrow({
  children,
  className = "",
  textClassName = "",
  align = "left",
}: SectionEyebrowProps) {
  return (
    <div
      className={`inline-flex w-fit items-center rounded-full border border-line/80 bg-[linear-gradient(180deg,rgba(242,207,120,0.14),rgba(205,161,58,0.08))] px-4 py-1.5 shadow-[0_10px_24px_rgba(0,0,0,0.18)] backdrop-blur-sm ${align === "center" ? "mx-auto" : ""
        } ${className}`}
    >
      <p
        className={`font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-yellow-400 ${textClassName}`}
      >
        {children}
      </p>
    </div>
  );
}
