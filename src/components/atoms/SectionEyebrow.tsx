import type { ReactNode } from "react";

type SectionEyebrowProps = {
  children: ReactNode;
  className?: string;
};

export function SectionEyebrow({
  children,
  className = "",
}: SectionEyebrowProps) {
  return <p className={`text-sm font-semibold text-white/80 ${className}`}>{children}</p>;
}
