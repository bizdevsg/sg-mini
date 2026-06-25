import type { ReactNode } from "react";

type SectionTitleProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  theme?: "light" | "dark";
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
};

export function SectionTitle({
  title,
  subtitle,
  theme = "light",
  align = "left",
  className = "",
  titleClassName = "",
  subtitleClassName = "",
}: SectionTitleProps) {
  const titleClass =
    theme === "dark" ? "text-yellow-500" : "text-white";
  const subtitleClass =
    theme === "dark" ? "text-foreground/72" : "text-white/40";
  const alignmentClassName =
    align === "center" ? "mx-auto text-center" : "md:mx-0 md:text-left";

  return (
    <div className={`max-w-3xl ${alignmentClassName} ${className}`}>
      <h2
        className={`font-mono text-3xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-4xl ${titleClass} ${titleClassName}`}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={`mt-3 text-xs leading-7 sm:text-sm ${subtitleClass} ${subtitleClassName}`}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
