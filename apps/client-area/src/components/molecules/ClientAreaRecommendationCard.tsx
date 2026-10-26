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
}: ClientAreaRecommendationCardProps) {
  const signal = resolveSignalBadge(item.change);
  const SignalIcon = signal.icon;
  const symbolCode = item.code ?? item.name;

  const content = (
    <>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {symbolCode ? (
            <LiveQuoteInstrumentIcon symbol={symbolCode} img_variant="sm" />
          ) : (
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${iconClass}`}
            >
              <FontAwesomeIcon icon={icon} />
            </div>
          )}
          <div>
            <h3 className="text-xs font-extrabold text-zinc-200">{item.symbol}</h3>
            <span className="text-[10px] text-zinc-500">
              {displayCode ?? symbolCode}
            </span>
          </div>
        </div>

        <span className={`rounded-full border px-2 py-0.5 text-[9px] ${badgeClass}`}>
          {badge}
        </span>
      </div>

      <div className="flex items-end justify-between border-t border-zinc-800/50 pt-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            Price
          </p>
          <p className="text-base font-bold tracking-tight text-zinc-100">
            {formatUsd(item.bid)}
          </p>
        </div>

        <div className="text-right">
          <span
            className={`flex items-center justify-end gap-1 text-xs font-bold ${signal.className}`}
          >
            <SignalIcon className="h-3 w-3" />
            {formatSignedPercent(item.change)}
          </span>
          <span className="text-[9px] text-zinc-500">Live Tick</span>
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
