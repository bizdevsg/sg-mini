import type { LucideIcon } from "lucide-react";

type ClientAreaTradePilotStatCardProps = {
  featured?: boolean;
  icon: LucideIcon;
  label: string;
  tone: "amber" | "emerald" | "orange" | "rose" | "sky" | "teal";
  value: string;
};

const TONE_STYLES = {
  amber: {
    accent: "bg-amber-400",
    border: "border-amber-500/25",
    glow: "bg-amber-400/10",
    icon: "bg-amber-400/10 text-amber-400 ring-amber-400/20",
  },
  emerald: {
    accent: "bg-emerald-400",
    border: "border-emerald-500/20",
    glow: "bg-emerald-400/10",
    icon: "bg-emerald-400/10 text-emerald-400 ring-emerald-400/20",
  },
  orange: {
    accent: "bg-orange-400",
    border: "border-orange-500/20",
    glow: "bg-orange-400/10",
    icon: "bg-orange-400/10 text-orange-400 ring-orange-400/20",
  },
  rose: {
    accent: "bg-rose-400",
    border: "border-rose-500/20",
    glow: "bg-rose-400/10",
    icon: "bg-rose-400/10 text-rose-400 ring-rose-400/20",
  },
  sky: {
    accent: "bg-sky-400",
    border: "border-sky-500/20",
    glow: "bg-sky-400/10",
    icon: "bg-sky-400/10 text-sky-400 ring-sky-400/20",
  },
  teal: {
    accent: "bg-teal-400",
    border: "border-teal-500/20",
    glow: "bg-teal-400/10",
    icon: "bg-teal-400/10 text-teal-400 ring-teal-400/20",
  },
} as const;

export function ClientAreaTradePilotStatCard({
  featured = false,
  icon: Icon,
  label,
  tone,
  value,
}: ClientAreaTradePilotStatCardProps) {
  const styles = TONE_STYLES[tone];

  return (
    <article
      className={`relative min-w-0 overflow-hidden rounded-xl border bg-zinc-900/70 backdrop-blur-sm p-3 shadow-md shadow-black/10 ${styles.border}`}
    >
      {/* <span className={`absolute inset-x-0 top-0 h-px ${styles.accent}`} /> */}
      <span
        aria-hidden="true"
        className={`absolute -right-8 -top-8 h-20 w-20 rounded-full blur-2xl ${styles.glow}`}
      />
      <div className="relative flex items-center gap-3">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1 ${styles.icon}`}
        >
          <Icon aria-hidden="true" className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <strong
            className={`block font-bold leading-none text-white tabular-nums ${featured ? "text-lg" : "text-base"
              }`}
          >
            {value}
          </strong>
          <p className="mt-1 text-xs leading-4 text-zinc-400">{label}</p>
        </div>
      </div>
    </article>
  );
}
