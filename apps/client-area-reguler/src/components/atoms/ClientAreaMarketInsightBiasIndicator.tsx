import { TrendingDown, TrendingUp } from "lucide-react";

type ClientAreaMarketInsightBiasIndicatorProps = {
  direction: "up" | "down";
  label: string;
};

const directionStyles = {
  up: {
    className: "text-green-400",
  },
  down: {
    className: "text-red-400",
  },
} as const;

export function ClientAreaMarketInsightBiasIndicator({
  direction,
  label,
}: ClientAreaMarketInsightBiasIndicatorProps) {
  const style = directionStyles[direction];

  const Icon = direction === "up" ? TrendingUp : TrendingDown;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full font-bold ${style.className}`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </div>
  );
}