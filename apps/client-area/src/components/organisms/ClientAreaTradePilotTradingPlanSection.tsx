"use client";

import { useState } from "react";
import Image from "next/image";
import { ShieldCheck, TrendingDown, TrendingUp } from "lucide-react";

import { ClientAreaTradePilotStaticOption } from "@/components/atoms/ClientAreaTradePilotStaticOption";
import { ClientAreaTradePilotCurrencyField } from "@/components/molecules/ClientAreaTradePilotCurrencyField";
import { ClientAreaTradePilotRecommendationScenarioCard } from "@/components/molecules/ClientAreaTradePilotRecommendationScenarioCard";
import { ClientAreaTradePilotPlanDetails } from "@/components/organisms/ClientAreaTradePilotPlanDetails";
import type { ClientAreaTradePilotTradingPlanCopy } from "@/lib/client-area-trade-pilot.shared";
import type { TradePilotAnalysisResult } from "@/lib/trade-pilot/trade-pilot.types";

type ClientAreaTradePilotTradingPlanSectionProps = {
  analysis?: TradePilotAnalysisResult;
  copy: ClientAreaTradePilotTradingPlanCopy;
  onRecommendationVisibilityChange: (visible: boolean) => void;
};

export function ClientAreaTradePilotTradingPlanSection({
  analysis,
  copy,
  onRecommendationVisibilityChange,
}: ClientAreaTradePilotTradingPlanSectionProps) {
  const [accountType, setAccountType] = useState<"micro" | "mini" | "regular">(
    "mini",
  );
  const [riskStyle, setRiskStyle] = useState<
    "conservative" | "moderate" | "aggressive"
  >("conservative");
  const [tradingCapital, setTradingCapital] = useState("1000");
  const [lossLimit, setLossLimit] = useState("800");
  const [hasRecommendation, setHasRecommendation] = useState(false);
  const [selectedDirection, setSelectedDirection] = useState<
    "buy" | "sell" | null
  >(null);

  const canCreateRecommendation =
    Boolean(analysis) && Number(tradingCapital) > 0 && Number(lossLimit) > 0;

  function resetRecommendation() {
    setHasRecommendation(false);
    setSelectedDirection(null);
    onRecommendationVisibilityChange(false);
  }

  function createRecommendation() {
    setHasRecommendation(true);
    onRecommendationVisibilityChange(true);
    setSelectedDirection(
      analysis?.direction === "bullish"
        ? "buy"
        : analysis?.direction === "bearish"
          ? "sell"
          : null,
    );
  }

  function selectDirection(direction: "buy" | "sell") {
    setSelectedDirection(direction);
    requestAnimationFrame(() => {
      document
        .getElementById("trade-pilot-plan-details")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <section className="rounded-3xl border border-zinc-800 bg-blue-950/15 p-5 sm:p-7">
      <div className="flex items-center gap-2">
        <div className="p-3 bg-yellow-500/20 rounded-lg">
          <Image src={"/assets/carbon_content-navigator-sync-warning.webp"} alt="" width={300} height={300} className="w-7 h-7" />
        </div>

        <div>
          <h2 className="text-base font-bold text-white sm:text-lg">{copy.title}</h2>
          <p className="text-xs leading-5 text-zinc-400 sm:text-sm">
            {copy.description}
          </p>
        </div>
      </div>

      <div className="mt-7 space-y-7">
        <div>
          <p className="mb-2 text-xs font-semibold text-zinc-400 sm:text-sm">
            {copy.accountTypeLabel}
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <ClientAreaTradePilotStaticOption
              active={accountType === "micro"}
              label={copy.microAccountLabel}
              desc={copy.microAccountDesc}
              onClick={() => {
                setAccountType("micro");
                resetRecommendation();
              }}
            />
            <ClientAreaTradePilotStaticOption
              active={accountType === "mini"}
              label={copy.miniAccountLabel}
              desc={copy.miniAccountDesc}
              onClick={() => {
                setAccountType("mini");
                resetRecommendation();
              }}
            />
            <ClientAreaTradePilotStaticOption
              active={accountType === "regular"}
              label={copy.regularAccountLabel}
              desc={copy.regularAccountDesc}
              onClick={() => {
                setAccountType("regular");
                resetRecommendation();
              }}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <ClientAreaTradePilotCurrencyField
            label={copy.tradingCapitalLabel}
            onValueChange={(value) => {
              setTradingCapital(value);
              resetRecommendation();
            }}
            value={tradingCapital}
          />
          <ClientAreaTradePilotCurrencyField
            label={copy.lossLimitLabel}
            onValueChange={(value) => {
              setLossLimit(value);
              resetRecommendation();
            }}
            value={lossLimit}
          />
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold text-zinc-400 sm:text-sm">
            {copy.riskStyleLabel}
          </p>
          <div className="grid gap-3 sm:grid-cols-3 lg:max-w-4xl">
            <ClientAreaTradePilotStaticOption
              active={riskStyle === "conservative"}
              label={copy.conservativeLabel}
              textAlign="center"
              onClick={() => {
                setRiskStyle("conservative");
                resetRecommendation();
              }}
            />
            <ClientAreaTradePilotStaticOption
              active={riskStyle === "moderate"}
              label={copy.moderateLabel}
              textAlign="center"
              onClick={() => {
                setRiskStyle("moderate");
                resetRecommendation();
              }}
            />
            <ClientAreaTradePilotStaticOption
              active={riskStyle === "aggressive"}
              label={copy.aggressiveLabel}
              textAlign="center"
              onClick={() => {
                setRiskStyle("aggressive");
                resetRecommendation();
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-7 space-y-1 text-xs leading-5 text-zinc-400 sm:text-sm sm:leading-6">
        <p>{copy.intradayNote}</p>
        <p>
          {copy.snapshotLabel}: {copy.snapshotValue}
        </p>
      </div>

      <button
        type="button"
        disabled={!canCreateRecommendation}
        onClick={createRecommendation}
        className="mt-7 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-amber-400 px-5 py-3.5 text-sm font-bold text-black transition-colors hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ShieldCheck className="h-6 w-6" />
        {copy.createRecommendationLabel}
      </button>

      {hasRecommendation && analysis?.direction === "bullish" && (
        <div aria-live="polite" className="mt-7">
          <ClientAreaTradePilotRecommendationScenarioCard
            brokerFundsLabel={copy.brokerFundsUntilStopLabel}
            brokerFundsValue="$400"
            description={copy.buyScenarioDescription}
            guidance={copy.buyScenarioGuidance.replace(
              "{entry}",
              analysis.buyLevels.entry,
            )}
            minimumRiskLabel={copy.minimumStopRiskLabel}
            minimumRiskValue="$300"
            title={copy.buyScenarioLabel}
            variant="buy"
          />
        </div>
      )}

      {hasRecommendation && analysis?.direction === "bearish" && (
        <div aria-live="polite" className="mt-7">
          <ClientAreaTradePilotRecommendationScenarioCard
            brokerFundsLabel={copy.brokerFundsUntilStopLabel}
            brokerFundsValue="$450"
            description={copy.sellScenarioDescription}
            guidance={copy.sellScenarioGuidance.replace(
              "{entry}",
              analysis.sellLevels.entry,
            )}
            minimumRiskLabel={copy.minimumStopRiskLabel}
            minimumRiskValue="$350"
            title={copy.sellScenarioLabel}
            variant="sell"
          />
        </div>
      )}

      {hasRecommendation && analysis?.direction === "neutral" && (
        <div
          aria-live="polite"
          className="mt-7 rounded-2xl border border-amber-500/30 bg-amber-950/15 p-5 sm:p-7"
        >
          <div className="flex flex-wrap items-center gap-3">
            <strong className="text-lg font-black uppercase text-amber-400">
              {copy.waitStatusLabel}
            </strong>
            <span className="rounded-lg bg-amber-300/80 px-3 py-1 text-[11px] font-bold text-black sm:text-xs">
              {copy.limitedOptionsLabel}
            </span>
          </div>
          <p className="mt-4 text-sm font-semibold leading-6 text-zinc-200">
            {copy.waitDescription}
          </p>
          <p className="mt-3 text-sm leading-6 text-amber-400">
            {copy.waitGuidance}
          </p>
        </div>
      )}

      {hasRecommendation &&
        (analysis?.direction === "bullish" ||
          analysis?.direction === "bearish") && (
          <div className="mt-7 space-y-3">
            <h3 className="text-base font-bold text-white sm:text-lg">
              {copy.selectDirectionLabel}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                aria-pressed={selectedDirection === "buy"}
                className={`flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-center text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${selectedDirection === "buy"
                  ? "cursor-pointer border-emerald-500 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/15"
                  : "border-zinc-700 text-zinc-400 hover:border-emerald-500/60 hover:bg-emerald-500/5 hover:text-emerald-400"
                  }`}
                onClick={() => selectDirection("buy")}
                type="button"
              >
                <TrendingUp className="h-6 w-6" />
                <span>{copy.buyScenarioLabel}</span>
              </button>
              <button
                aria-pressed={selectedDirection === "sell"}
                className={`flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-center text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 ${selectedDirection === "sell"
                  ? "cursor-pointer border-red-500 bg-red-500/10 text-red-400 hover:bg-red-500/15"
                  : "border-zinc-700 text-zinc-400 hover:border-red-500/60 hover:bg-red-500/5 hover:text-red-400"
                  }`}
                onClick={() => selectDirection("sell")}
                type="button"
              >
                <TrendingDown className="h-6 w-6" />
                <span>{copy.sellScenarioLabel}</span>
              </button>
            </div>
          </div>
        )}

      {hasRecommendation && selectedDirection === "buy" && analysis && (
        <ClientAreaTradePilotPlanDetails
          accountType={accountType}
          copy={copy}
          levels={analysis.buyLevels}
          lossLimit={Number(lossLimit)}
          riskStyle={riskStyle}
          tradingCapital={Number(tradingCapital)}
          variant="buy"
        />
      )}

      {hasRecommendation && selectedDirection === "sell" && analysis && (
        <ClientAreaTradePilotPlanDetails
          accountType={accountType}
          copy={copy}
          levels={analysis.sellLevels}
          lossLimit={Number(lossLimit)}
          riskStyle={riskStyle}
          tradingCapital={Number(tradingCapital)}
          variant="sell"
        />
      )}
    </section>
  );
}
