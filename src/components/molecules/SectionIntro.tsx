import type { ReactNode } from "react";

import { SectionEyebrow } from "@/components/atoms/SectionEyebrow";

type SectionIntroProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  titleAs?: "h1" | "h2";
  className?: string;
  eyebrowClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

export function SectionIntro({
  eyebrow,
  title,
  description,
  align = "left",
  titleAs = "h2",
  className = "",
  eyebrowClassName = "",
  titleClassName = "",
  descriptionClassName = "",
}: SectionIntroProps) {
  const TitleTag = titleAs;
  const alignmentClassName = align === "center" ? "text-center" : "";

  return (
    <div className={`${alignmentClassName} ${className}`}>
      {eyebrow ? (
        <SectionEyebrow align={align} textClassName={eyebrowClassName}>
          {eyebrow}
        </SectionEyebrow>
      ) : null}

      <TitleTag
        className={`mt-5 font-mono text-3xl max-w-2xl mx-auto font-bold capitalize leading-[1.02] tracking-[-0.04em] text-white md:text-4xl lg:text-[2.8rem] ${titleClassName}`}
      >
        {title}
      </TitleTag>

      {description ? (
        <p
          className={`mt-4 text-sm leading-7 text-zinc-300 sm:text-base ${descriptionClassName}`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
