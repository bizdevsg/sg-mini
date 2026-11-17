import { Fragment, type ReactNode } from "react";

type ClientAreaSuperscriptDecimalProps = {
  value: string;
};

const FOUR_DECIMAL_VALUE = /([+-]?\$?\s?\d[\d,]*\.\d{2})(\d{2})(?=\D|$)/g;

export function ClientAreaSuperscriptDecimal({
  value,
}: ClientAreaSuperscriptDecimalProps) {
  const parts: ReactNode[] = [];
  let cursor = 0;

  for (const match of value.matchAll(FOUR_DECIMAL_VALUE)) {
    const index = match.index ?? 0;
    const regularDigits = match[1];
    const superscriptDigits = match[2];

    parts.push(value.slice(cursor, index));
    parts.push(
      <Fragment key={`${index}-${match[0]}`}>
        {regularDigits}
        <sup className="ml-px text-[0.68em] leading-none">
          {superscriptDigits}
        </sup>
      </Fragment>,
    );
    cursor = index + match[0].length;
  }

  if (parts.length === 0) return value;

  parts.push(value.slice(cursor));
  return <>{parts}</>;
}
