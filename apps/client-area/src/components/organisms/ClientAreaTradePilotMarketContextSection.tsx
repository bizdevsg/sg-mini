import type { ClientAreaTradePilotMarketContextSummaryCopy } from "@/lib/client-area-trade-pilot.shared";
import type { TradePilotAnalysisResult } from "@/lib/trade-pilot/trade-pilot.types";

type ClientAreaTradePilotMarketContextSectionProps = {
  analysis: TradePilotAnalysisResult;
  copy: ClientAreaTradePilotMarketContextSummaryCopy;
};

const MARKET_CONTEXT_STYLES = {
  bearish: {
    backgroundImage: "url(/assets/bearishBG.webp)",
    borderClass: "border-red-600/90",
    badgeClass: "bg-red-800 text-white",
    titleClass: "text-red-500",
  },
  bullish: {
    backgroundImage: "url(/assets/bullishBG.webp)",
    borderClass: "border-emerald-500/90",
    badgeClass: "bg-emerald-700 text-white",
    titleClass: "text-emerald-400",
  },
  neutral: {
    backgroundImage: "url(/assets/waitBg.webp)",
    borderClass: "border-amber-500/80",
    badgeClass: "bg-amber-500 text-black",
    titleClass: "text-amber-400",
  },
} as const;

export function ClientAreaTradePilotMarketContextSection({
  analysis,
  copy,
}: ClientAreaTradePilotMarketContextSectionProps) {
  // Ikuti rekomendasi AI (`direction`), bukan mayoritas indikator
  // (`marketSentiment`), supaya kartu ini konsisten dengan rekomendasi Wait.
  const direction = analysis.direction;
  const style = MARKET_CONTEXT_STYLES[direction];
  const title =
    direction === "bullish"
      ? copy.bullishTitle
      : direction === "bearish"
        ? copy.bearishTitle
        : copy.neutralTitle;
  const badge =
    direction === "bullish"
      ? copy.buyLabel
      : direction === "bearish"
        ? copy.sellLabel
        : copy.waitLabel;
  const note =
    direction === "bullish"
      ? copy.bullishNote
      : direction === "bearish"
        ? copy.bearishNote
        : copy.neutralNote;

  const tally = analysis.indicators.reduce(
    (total, indicator) => ({ ...total, [indicator.status]: total[indicator.status] + 1 }),
    { buy: 0, neutral: 0, sell: 0 },
  );
  const indicatorCount = analysis.indicators.length;
  const tallyText = copy.indicatorTallyDescription
    .replace("{bullish}", String(tally.buy))
    .replace("{total}", String(indicatorCount))
    .replace("{bearish}", String(tally.sell))
    .replace("{neutral}", String(tally.neutral));

  return (
    <section
      className={`relative isolate min-h-56 overflow-hidden rounded-3xl border bg-black bg-cover bg-right ${style.borderClass}`}
      style={{ backgroundImage: style.backgroundImage }}
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/85 to-black/10 sm:via-black/60" />
      <div className="flex min-h-56 max-w-4xl flex-col justify-center px-5 py-8 sm:px-8 lg:px-10">
        <p className="text-sm font-bold uppercase tracking-wide text-zinc-300">
          {copy.eyebrow}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3 sm:gap-4">
          <h2 className={`text-xl font-bold sm:text-2xl ${style.titleClass}`}>
            {title}
          </h2>
          <span
            className={`rounded-lg px-4 py-1.5 text-sm font-bold uppercase ${style.badgeClass}`}
          >
            {badge}
          </span>
        </div>
        <div className="mt-5 max-w-3xl space-y-1 text-sm leading-6 text-zinc-300 sm:text-base">
          {indicatorCount > 0 ? <p>{tallyText}</p> : null}
          <p>{note}</p>
          {analysis.marketContext?.description ? (
            <p className="pt-2 text-zinc-400">{analysis.marketContext.description}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
