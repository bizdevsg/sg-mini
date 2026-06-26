import Image from "next/image";

import { getLiveQuoteDisplay, getLiveQuoteIconSrc } from "@/lib/live-quotes";

type LiveQuoteInstrumentIconProps = {
  symbol: string;
};

function getFallbackText(input: string) {
  if (input.includes("/")) {
    return input
      .split("/")
      .map((part) => part.trim().charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  }

  const compact = input.replace(/[^A-Z]/gi, "").toUpperCase();
  return compact.slice(0, 3) || "?";
}

export function LiveQuoteInstrumentIcon({
  symbol,
}: LiveQuoteInstrumentIconProps) {
  const display = getLiveQuoteDisplay(symbol);
  const iconSrc = getLiveQuoteIconSrc(symbol);
  const fallbackText = getFallbackText(display.label);

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center">
      {iconSrc ? (
        <Image
          src={iconSrc}
          alt={`${display.label} icon`}
          width={42}
          height={42}
          sizes="42px"
          className="h-[42px] w-[42px] object-contain"
        />
      ) : (
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
          {fallbackText}
        </span>
      )}
    </div>
  );
}
