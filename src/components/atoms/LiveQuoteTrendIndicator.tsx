import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getMessages, type AppLocale } from "@/locales";

type LiveQuoteTrendIndicatorProps = {
  direction: string;
  locale: AppLocale;
};

const trendStyles = {
  up: {
    icon: ["fas", "chevron-up"] as IconProp,
    className:
      "text-emerald-400 bg-emerald-400/10 border border-emerald-400/20",
  },
  down: {
    icon: ["fas", "chevron-down"] as IconProp,
    className: "text-rose-400 bg-rose-400/10 border border-rose-400/20",
  },
  neutral: {
    icon: ["fas", "minus"] as IconProp,
    className:
      "text-white/58 bg-white/10 border border-white/20",
  },
} as const;

function getTrendKey(direction: string) {
  if (direction === "up") {
    return "up";
  }

  if (direction === "down") {
    return "down";
  }

  return "neutral";
}

export function LiveQuoteTrendIndicator({
  direction,
  locale,
}: LiveQuoteTrendIndicatorProps) {
  const trendLabels = getMessages(locale).liveQuoteTable.trend;
  const trendKey = getTrendKey(direction);
  const trend = trendStyles[trendKey];
  const label = trendLabels[trendKey];

  return (
    <div
      aria-label={label}
      title={label}
      className={`text-xs uppercase tracking-[0.18em] p-1 rounded-full ${trend.className}`}
    >
      <FontAwesomeIcon icon={trend.icon} />
    </div>
  );
}
