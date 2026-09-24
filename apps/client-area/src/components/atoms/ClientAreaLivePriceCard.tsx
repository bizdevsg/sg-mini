import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

type ClientAreaLivePriceCardProps = {
  label: string;
  tone: "buy" | "netral" | "sell";
  value: string;
};

const toneClassNames = {
  buy: {
    surface: "border-green-500/20 bg-green-500/5",
    value: "text-green-400",
    icon: "text-green-500",
    Icon: ArrowUpRight,
  },

  netral: {
    surface: "border-white/10 bg-white/[0.03]",
    value: "text-zinc-100",
    icon: "text-zinc-500",
    Icon: Minus,
  },

  sell: {
    surface: "border-red-500/20 bg-red-500/5",
    value: "text-red-400",
    icon: "text-red-500",
    Icon: ArrowDownRight,
  },
};

export function ClientAreaLivePriceCard({
  label,
  tone,
  value,
}: ClientAreaLivePriceCardProps) {
  const theme = toneClassNames[tone];
  const Icon = theme.Icon;

  return (
    <div
      className={`rounded-xl border p-3 transition-colors sm:p-4 ${theme.surface}`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-zinc-400">{label}</p>
        <Icon className={`h-3.5 w-3.5 shrink-0 ${theme.icon}`} />
      </div>
      <p className={`mt-1.5 text-lg font-bold sm:text-xl ${theme.value}`}>
        {value}
      </p>
    </div>
  );
}
