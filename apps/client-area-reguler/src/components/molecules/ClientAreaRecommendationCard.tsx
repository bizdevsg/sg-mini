import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { LiveQuoteInstrumentIcon } from "@/components/atoms/LiveQuoteInstrumentIcon";
import {
  formatSignedPercent,
  formatUsd,
  resolveSignalBadge,
} from "@/components/organisms/client-area.shared";
import type { MarketPrice } from "@/components/organisms/client-area.types";

type ClientAreaRecommendationCardProps = {
  item: MarketPrice;
  badge: string;
  badgeClass: string;
  displayCode?: string;
  icon: IconProp;
  iconClass: string;
  isSelected?: boolean;
  onClick?: () => void;
  liveTickLabel: string;
  priceLabel: string;
};

export function ClientAreaRecommendationCard({
  item,
  badge,
  badgeClass,
  displayCode,
  icon,
  iconClass,
  isSelected = false,
  onClick,
  liveTickLabel,
  priceLabel,
}: ClientAreaRecommendationCardProps) {
  const signal = item.change === null ? null : resolveSignalBadge(item.change);
  const SignalIcon = signal?.icon;
  const symbolCode = item.code ?? item.name;

  const content = (
    <>
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex min-w-0 items-center gap-2.5">
          {symbolCode ? (
            <LiveQuoteInstrumentIcon symbol={symbolCode} img_variant="sm" />
          ) : (
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${iconClass}`}
            >
              <FontAwesomeIcon icon={icon} />
            </div>
          )}
          <div className="min-w-0">
            <h3 className="truncate text-xs font-extrabold text-zinc-200 sm:text-sm">
              {item.symbol}
            </h3>
            <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-zinc-500">
                {displayCode ?? symbolCode}
              </span>
              <span
                className={`rounded-full border px-1.5 py-px text-[9px] ${badgeClass}`}
              >
                {badge}
              </span>
            </div>
          </div>
        </div>

        <div className="min-w-0 flex-1 border-l border-zinc-800/50 pl-3 sm:pl-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            {priceLabel}
          </p>
          <p className="truncate text-base font-bold tracking-tight text-zinc-100 sm:text-xl">
            {item.bid === null ? "-" : formatUsd(item.bid)}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <span
            className={`flex items-center justify-end gap-1 text-xs font-bold sm:text-sm ${signal?.className ?? "text-zinc-500"}`}
          >
            {SignalIcon ? <SignalIcon className="h-3 w-3" /> : null}
            {item.change === null ? "-" : formatSignedPercent(item.change)}
          </span>
          {item.bid !== null ? (
            <span className="text-[9px] text-zinc-500">{liveTickLabel}</span>
          ) : null}
        </div>
      </div>
    </>
  );

  const className = `group relative w-full overflow-hidden rounded-2xl border bg-zinc-900/80 p-4 text-left transition-all ${isSelected
    ? "border-yellow-400/70 shadow-[0_0_0_1px_rgba(250,204,21,0.18)]"
    : "border-zinc-800/80 hover:border-yellow-500/30"
    }`;

  return onClick ? (
    <button
      type="button"
      aria-pressed={isSelected}
      className={`${className} cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black`}
      onClick={onClick}
    >
      {content}
    </button>
  ) : (
    <div className={className}>{content}</div>
  );
}
