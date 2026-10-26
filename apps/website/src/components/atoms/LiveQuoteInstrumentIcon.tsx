import Image from "next/image";

import { getLiveQuoteDisplay, getLiveQuoteIconSrc } from "@/lib/live-quotes";

type LiveQuoteInstrumentIconProps = {
  symbol: string;
  className?: string;
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
    <div className={`flex shrink-0 items-center justify-center`}>
      {iconSrc ? (
        <div className="bg-zinc-800 p-1 w-15 h-15 rounded-full border border-zinc-100/20">
          <Image
            src={iconSrc}
            alt={`${display.label} icon`}
            width={45}
            height={45}
            sizes="10px"
            className="h-full w-full object-contain"
          />
        </div>
      ) : (
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
          {fallbackText}
        </span>
      )}
    </div>
  );
}
