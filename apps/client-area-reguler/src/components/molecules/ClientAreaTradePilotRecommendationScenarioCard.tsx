import Image from "next/image";

type ClientAreaTradePilotRecommendationScenarioCardProps = {
  brokerFundsLabel: string;
  brokerFundsValue: string;
  description: string;
  guidance: string;
  minimumRiskLabel: string;
  minimumRiskValue: string;
  title: string;
  variant: "buy" | "sell";
};

const SCENARIO_STYLES = {
  buy: {
    imageSrc: "/assets/Card_Utama_Skenario_Naik_(Buy).webp",
    border: "border-emerald-400/30",
    metricBorder: "border-emerald-400/25",
    title: "text-emerald-400",
  },
  sell: {
    imageSrc: "/assets/Card_Utama_Skenario_Turun_(Sell).webp",
    border: "border-red-400/30",
    metricBorder: "border-red-400/25",
    title: "text-red-400",
  },
} as const;

export function ClientAreaTradePilotRecommendationScenarioCard({
  brokerFundsLabel,
  brokerFundsValue,
  description,
  guidance,
  minimumRiskLabel,
  minimumRiskValue,
  title,
  variant,
}: ClientAreaTradePilotRecommendationScenarioCardProps) {
  const styles = SCENARIO_STYLES[variant];

  return (
    <article
      className={`relative min-h-80 overflow-hidden rounded-2xl border sm:min-h-72 xl:min-h-64 ${styles.border}`}
    >
      <Image
        alt=""
        aria-hidden="true"
        className="object-cover object-center"
        fill
        sizes="(min-width: 1280px) 1100px, 100vw"
        src={styles.imageSrc}
      />
      <div className="absolute inset-0 bg-linear-to-r from-black via-black/80 to-black/20" />

      <div className="relative z-10 flex min-h-80 max-w-4xl flex-col justify-center p-5 sm:min-h-72 sm:p-7 xl:min-h-64 xl:p-8">
        <h3 className={`text-xl font-black sm:text-2xl ${styles.title}`}>
          {title}
        </h3>
        <p className="mt-3 text-xs font-semibold leading-5 text-zinc-400 sm:text-sm sm:leading-6">
          {description}
        </p>
        <p className="mt-1 text-xs font-semibold leading-5 text-white sm:text-sm sm:leading-6">
          {guidance}
        </p>

        <div className="mt-5 grid max-w-2xl gap-3 sm:grid-cols-2">
          <div
            className={`rounded-2xl border bg-black/35 px-5 py-4 backdrop-blur-sm ${styles.metricBorder}`}
          >
            <span className="text-xs font-semibold text-zinc-400 sm:text-sm">
              {minimumRiskLabel}
            </span>
            <strong className="mt-1 block text-xl font-black text-white">
              {minimumRiskValue}
            </strong>
          </div>
          <div
            className={`rounded-2xl border bg-black/35 px-5 py-4 backdrop-blur-sm ${styles.metricBorder}`}
          >
            <span className="text-xs font-semibold text-zinc-400 sm:text-sm">
              {brokerFundsLabel}
            </span>
            <strong className="mt-1 block text-xl font-black text-white">
              {brokerFundsValue}
            </strong>
          </div>
        </div>
      </div>
    </article>
  );
}
