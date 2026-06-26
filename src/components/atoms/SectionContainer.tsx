import type { CSSProperties, ReactNode } from "react";

type SectionContainerProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function SectionContainer({
  children,
  className = "",
  style,
}: SectionContainerProps) {
  return (
    <div
      className={`mx-auto max-w-8xl px-4 sm:px-6 lg:px-10 ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}