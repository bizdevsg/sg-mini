import type { ComponentPropsWithoutRef } from "react";

type ButtonLinkProps = ComponentPropsWithoutRef<"a"> & {
  variant?: "primary" | "dark" | "ghost";
};

const variants = {
  primary:
    "bg-[linear-gradient(180deg,#f2cf78_0%,#cda13a_100%)] text-[#120f08] shadow-[0_18px_40px_rgba(205,161,58,0.3)] ring-1 ring-[rgba(242,207,120,0.4)] hover:brightness-110",
  dark: "bg-[#141414] text-yellow-500 ring-1 ring-[rgba(205,161,58,0.22)] hover:bg-[#1d1d1d]",
  ghost:
    "text-yellow-500 bg-foreground/20 ring-1 ring-transparent hover:bg-foreground/50 hover:ring-[rgba(205,161,58,0.16)]",
};

export function ButtonLink({
  className = "",
  variant = "primary",
  ...props
}: ButtonLinkProps) {
  return (
    <a
      className={`inline-flex items-center justify-center rounded-lg text-center text-base font-semibold ${variants[variant]} ${className} transition-all duration-300`}
      {...props}
    />
  );
}
