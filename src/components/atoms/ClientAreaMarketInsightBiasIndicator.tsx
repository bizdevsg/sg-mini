import { TrendingDown, TrendingUp } from "lucide-react";

type ClientAreaMarketInsightBiasIndicatorProps = {
  direction: "up" | "down";
  label: string;
};

const directionStyles = {
  up: {
    className: "text-green-500",
  },
  down: {
    className: "text-red-500",
  },
} as const;

export function ClientAreaMarketInsightBiasIndicator({
  direction,
  label,
}: ClientAreaMarketInsightBiasIndicatorProps) {
  const style = directionStyles[direction];

  const Icon = direction === "up" ? TrendingUp : TrendingDown;

  return (
    <div className={`flex items-center gap-1 font-bold ${style.className}`}>
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </div>
  );
}