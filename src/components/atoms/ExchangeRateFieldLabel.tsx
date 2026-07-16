import type { ReactNode } from "react";

type ExchangeRateFieldLabelProps = {
  children: ReactNode;
};

export function ExchangeRateFieldLabel({
  children,
}: ExchangeRateFieldLabelProps) {
  return <span className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/55">{children}</span>;
}
