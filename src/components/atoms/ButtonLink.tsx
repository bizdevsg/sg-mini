import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type ButtonLinkProps = ComponentPropsWithoutRef<"a"> & {
  variant?: "primary" | "dark" | "ghost";
  size?: "sm" | "md" | "lg";
};

const variants = {
  primary:
    "bg-[linear-gradient(180deg,#f2cf78_0%,#cda13a_100%)] text-[#120f08] shadow-[0_18px_40px_rgba(205,161,58,0.28)] ring-1 ring-[rgba(242,207,120,0.42)] hover:brightness-110",
  dark:
    "bg-[rgba(18,18,18,0.96)] text-yellow-400 ring-1 ring-[rgba(205,161,58,0.24)] hover:bg-[rgba(26,26,26,0.98)]",
  ghost:
    "bg-white/[0.04] text-yellow-400 ring-1 ring-white/10 hover:bg-white/[0.08] hover:ring-[rgba(205,161,58,0.18)]",
};

const sizes = {
  sm: "min-h-10 px-4 text-sm",
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-12 px-6 text-base",
};

function isInternalHref(href?: string): href is string {
  return Boolean(href && href.startsWith("/") && !href.startsWith("//"));
}

export function ButtonLink({
  className = "",
  variant = "primary",
  size = "md",
  ...props
}: ButtonLinkProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full text-center font-semibold tracking-[-0.01em] ${variants[variant]} ${sizes[size]} ${className} transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]`;
  const href = props.href;

  if (isInternalHref(href)) {
    return <Link className={classes} {...props} href={href} />;
  }

  return (
    <a
      className={classes}
      {...props}
    />
  );
}
