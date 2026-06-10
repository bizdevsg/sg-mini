type SectionTitleProps = {
  title: string;
  subtitle?: string;
  theme?: "light" | "dark";
};

export function SectionTitle({
  title,
  subtitle,
  theme = "light",
}: SectionTitleProps) {
  const titleClass = theme === "dark" ? "text-yellow-500" : "text-yellow-500";
  const subtitleClass =
    theme === "dark" ? "text-foreground/72" : "text-foreground/72";

  return (
    <div className="mx-auto max-w-3xl md:mx-0">
      <h2
        className={`text-center font-mono text-2xl font-bold leading-tight tracking-[-0.04em] md:text-left md:text-3xl lg:text-4xl ${titleClass}`}
      >
        {title}
      </h2>
      <p
        className={`mt-2 text-center text-sm leading-7 md:text-left md:text-base lg:text-md ${subtitleClass}`}
      >
        {subtitle}
      </p>
    </div>
  );
}
