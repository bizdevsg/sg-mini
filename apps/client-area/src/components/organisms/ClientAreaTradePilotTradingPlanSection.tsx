"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { LoaderCircle, ShieldCheck, TrendingDown, TrendingUp } from "lucide-react";

import { ClientAreaTradePilotStaticOption } from "@/components/atoms/ClientAreaTradePilotStaticOption";
import { ClientAreaTradePilotCurrencyField } from "@/components/molecules/ClientAreaTradePilotCurrencyField";
import { ClientAreaTradePilotRecommendationScenarioCard } from "@/components/molecules/ClientAreaTradePilotRecommendationScenarioCard";
import { ClientAreaTradePilotPlanDetails } from "@/components/organisms/ClientAreaTradePilotPlanDetails";
import type { ClientAreaTradePilotTradingPlanCopy } from "@/lib/client-area-trade-pilot.shared";
import { formatTradePilotDateTime } from "@/lib/trade-pilot/trade-pilot-format";
import type {
  TradePilotAnalysisResult,
  TradePilotPositionPlan,
  TradePilotSidePositionPlan,
} from "@/lib/trade-pilot/trade-pilot.types";

type ClientAreaTradePilotTradingPlanSectionProps = {
  analysis?: TradePilotAnalysisResult;
  copy: ClientAreaTradePilotTradingPlanCopy;
  locale: "id" | "en";
  onRecommendationVisibilityChange: (visible: boolean) => void;
};

type PlanState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; plan: TradePilotPositionPlan };

/** "moderate" di UI = "balanced" di mesin Adaptive Position Plan. */
const RISK_STYLE_TO_API = {
  conservative: "conservative",
  moderate: "balanced",
  aggressive: "aggressive",
} as const;

export function formatPlanMoney(value: number | null | undefined) {
  if (value == null || !Number.isFinite(value)) return "—";
  return `$${Math.max(0, value).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}

/** Rencana untuk satu sisi: utama (searah analisis) atau skenario alternatif. */
export function sidePlanFor(plan: TradePilotPositionPlan, side: "buy" | "sell"): TradePilotSidePositionPlan | null {
  return plan[side] ?? plan.sideEvaluations[side].conditionalPlan ?? null;
}

export function ClientAreaTradePilotTradingPlanSection({
  analysis,
  copy,
  locale,
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
  const [planState, setPlanState] = useState<PlanState>({ status: "idle" });
  const requestRef = useRef(0);
  const plan = planState.status === "ready" ? planState.plan : null;
  const [selectedDirection, setSelectedDirection] = useState<
    "buy" | "sell" | null
  >(null);

  const canCreateRecommendation =
    Boolean(analysis) &&
    Number(tradingCapital) > 0 &&
    Number(lossLimit) > 0 &&
    planState.status !== "loading";

  function resetRecommendation() {
    requestRef.current += 1;
    setPlanState({ status: "idle" });
    setSelectedDirection(null);
    onRecommendationVisibilityChange(false);
  }

  async function createRecommendation() {
    if (!analysis) return;
    if (analysis.source !== "api") {
      setPlanState({ status: "error", message: copy.planMockUnavailableMessage });
      return;
    }
    if (Number(lossLimit) > Number(tradingCapital)) {
      setPlanState({ status: "error", message: copy.planLossLimitExceedsCapitalMessage });
      return;
    }
    const requestId = ++requestRef.current;
    setPlanState({ status: "loading" });
    try {
      const response = await fetch(
        `/api/client-area/trade-pilot/analyses/${encodeURIComponent(analysis.id)}/position-plan`,
        {
          body: JSON.stringify({
            accountType,
            lossLimit: Number(lossLimit),
            riskStyle: RISK_STYLE_TO_API[riskStyle],
            tradingCapital: Number(tradingCapital),
          }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        },
      );
      if (!response.ok) throw new Error("position_plan_failed");
      const nextPlan = (await response.json()) as TradePilotPositionPlan;
      if (requestId !== requestRef.current) return;
      if (!nextPlan.valid && nextPlan.decision.posture === "not_recommended" && !nextPlan.buy && !nextPlan.sell &&
        nextPlan.sideEvaluations.buy.status === "unavailable" && nextPlan.sideEvaluations.sell.status === "unavailable") {
        // Analisis sudah selesai/kedaluwarsa: perlu analisis ulang.
        setPlanState({ status: "error", message: copy.planAnalysisExpiredMessage });
        return;
      }
      setPlanState({ status: "ready", plan: nextPlan });
      onRecommendationVisibilityChange(true);
      const preferred = nextPlan.decision.preferredSide;
      setSelectedDirection(
        preferred === "buy" || preferred === "sell"
          ? preferred
          : analysis.direction === "bullish"
            ? "buy"
            : analysis.direction === "bearish"
              ? "sell"
              : null,
      );
    } catch {
      if (requestId !== requestRef.current) return;
      setPlanState({ status: "error", message: copy.planErrorMessage });
    }
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
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-md p-5 sm:p-7">
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
        {analysis?.dataSnapshot?.asOf ? (
          <p>
            {copy.snapshotLabel}: {formatTradePilotDateTime(analysis.dataSnapshot.asOf, locale)}
          </p>
        ) : null}
      </div>

      <button
        type="button"
        disabled={!canCreateRecommendation}
        onClick={() => void createRecommendation()}
        className="mt-7 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-amber-400 px-5 py-3.5 text-sm font-bold text-black transition-colors hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {planState.status === "loading" ? (
          <LoaderCircle className="h-6 w-6 animate-spin" />
        ) : (
          <ShieldCheck className="h-6 w-6" />
        )}
        {planState.status === "loading" ? copy.planLoadingLabel : copy.createRecommendationLabel}
      </button>

      {planState.status === "error" ? (
        <p role="alert" className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 sm:text-sm">
          {planState.message}
        </p>
      ) : null}

      {plan ? (
        <div aria-live="polite" className="mt-7 rounded-2xl border border-zinc-700 bg-zinc-900/70 p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-zinc-400 sm:text-sm">{copy.planPostureLabel}:</span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${plan.decision.posture === "scaling_allowed"
                ? "bg-emerald-500/15 text-emerald-400"
                : plan.decision.posture === "entry_only"
                  ? "bg-amber-500/15 text-amber-400"
                  : "bg-rose-500/15 text-rose-400"
                }`}
            >
              {copy.planPostureLabels[plan.decision.posture]}
            </span>
          </div>
          {plan.decision.reasonCodes.length > 0 ? (
            <div className="mt-3">
              <p className="text-xs text-zinc-400">{copy.planReasonsLabel}</p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {plan.decision.reasonCodes.map((code) => (
                  <li key={code} className="rounded-lg border border-zinc-700 px-2 py-1 text-[11px] text-zinc-300">
                    {copy.planReasonLabels[code] ?? code}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <p className="mt-3 text-[11px] leading-4 text-zinc-500">
            {copy.planRulesSourceLabel.replace("{version}", plan.rulesVersion)}
          </p>
        </div>
      ) : null}

      {plan && analysis?.direction === "bullish" && (
        <div aria-live="polite" className="mt-7">
          <ScenarioSummary
            analysis={analysis}
            copy={copy}
            plan={plan}
            side="buy"
          />
        </div>
      )}

      {plan && analysis?.direction === "bearish" && (
        <div aria-live="polite" className="mt-7">
          <ScenarioSummary
            analysis={analysis}
            copy={copy}
            plan={plan}
            side="sell"
          />
        </div>
      )}

      {plan && analysis?.direction === "neutral" && (
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

      {plan &&
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

      {plan && selectedDirection === "buy" && analysis && (
        <ClientAreaTradePilotPlanDetails
          accountType={accountType}
          analysisId={analysis.source === "api" ? analysis.id : undefined}
          copy={copy}
          isPrimaryScenario={plan.decision.preferredSide === "buy"}
          levels={analysis.buyLevels}
          lossLimit={Number(lossLimit)}
          plan={plan}
          riskStyle={riskStyle}
          sidePlan={sidePlanFor(plan, "buy")}
          tradingCapital={Number(tradingCapital)}
          variant="buy"
        />
      )}

      {plan && selectedDirection === "sell" && analysis && (
        <ClientAreaTradePilotPlanDetails
          accountType={accountType}
          analysisId={analysis.source === "api" ? analysis.id : undefined}
          copy={copy}
          isPrimaryScenario={plan.decision.preferredSide === "sell"}
          levels={analysis.sellLevels}
          lossLimit={Number(lossLimit)}
          plan={plan}
          riskStyle={riskStyle}
          sidePlan={sidePlanFor(plan, "sell")}
          tradingCapital={Number(tradingCapital)}
          variant="sell"
        />
      )}
    </section>
  );
}

/** Kartu skenario utama: risiko di SL & dana yang dibutuhkan dari hasil backend. */
function ScenarioSummary({
  analysis,
  copy,
  plan,
  side,
}: {
  analysis: TradePilotAnalysisResult;
  copy: ClientAreaTradePilotTradingPlanCopy;
  plan: TradePilotPositionPlan;
  side: "buy" | "sell";
}) {
  const sidePlan = sidePlanFor(plan, side);
  const diagnostic = plan.sideEvaluations[side].diagnostic;
  const isBuy = side === "buy";
  return (
    <div className="space-y-3">
      <ClientAreaTradePilotRecommendationScenarioCard
        brokerFundsLabel={copy.brokerFundsUntilStopLabel}
        brokerFundsValue={formatPlanMoney(sidePlan?.totalFundsAtStop ?? diagnostic?.fundsRequiredAtStop)}
        description={isBuy ? copy.buyScenarioDescription : copy.sellScenarioDescription}
        guidance={(isBuy ? copy.buyScenarioGuidance : copy.sellScenarioGuidance).replace(
          "{entry}",
          isBuy ? analysis.buyLevels.entry : analysis.sellLevels.entry,
        )}
        minimumRiskLabel={copy.minimumStopRiskLabel}
        minimumRiskValue={formatPlanMoney(sidePlan?.estimatedCycleLoss ?? diagnostic?.riskAtStop)}
        title={isBuy ? copy.buyScenarioLabel : copy.sellScenarioLabel}
        variant={side}
      />
      {!sidePlan ? (
        <div role="status" className="rounded-2xl border border-amber-500/40 bg-amber-950/20 p-4 text-xs leading-5 text-amber-200 sm:text-sm">
          {diagnostic ? (
            <>
              <strong className="block text-amber-400">{copy.sideBlockedTitle}</strong>
              {copy.sideBlockedDescription
                .replace("{lot}", String(diagnostic.lot))
                .replace("{margin}", formatPlanMoney(diagnostic.marginRequired))
                .replace("{risk}", formatPlanMoney(diagnostic.riskAtStop))
                .replace("{fundsShortfall}", formatPlanMoney(diagnostic.marginShortfall))
                .replace("{riskShortfall}", formatPlanMoney(diagnostic.riskShortfall))}
            </>
          ) : (
            copy.sideUnavailableDescription
          )}
        </div>
      ) : null}
    </div>
  );
}
