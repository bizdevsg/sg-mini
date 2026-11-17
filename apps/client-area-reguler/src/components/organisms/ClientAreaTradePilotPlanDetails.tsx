"use client";

import {
  ArrowRight,
  BookOpen,
  Calculator,
  CircleAlert,
  Download,
  Info,
  LogIn,
  Share2,
  Target,
  TriangleAlert,
} from "lucide-react";
import { useState } from "react";

import { ClientAreaTradePilotPlanMetric } from "@/components/atoms/ClientAreaTradePilotPlanMetric";
import { ClientAreaTradePilotPlanAccordion } from "@/components/molecules/ClientAreaTradePilotPlanAccordion";
import {
  ClientAreaTradePilotPlanTabs,
  type ClientAreaTradePilotPlanTab,
} from "@/components/molecules/ClientAreaTradePilotPlanTabs";
import type {
  ClientAreaTradePilotScenarioLevels,
  ClientAreaTradePilotTradingPlanCopy,
} from "@/lib/client-area-trade-pilot.shared";
import { ClientAreaTradePilotPlanBreakdown } from "@/components/organisms/ClientAreaTradePilotPlanBreakdown";
import { ClientAreaTradePilotRecommendationUsage } from "@/components/organisms/ClientAreaTradePilotRecommendationUsage";
import { ClientAreaTradePilotUnusedLayers } from "@/components/organisms/ClientAreaTradePilotUnusedLayers";
import type {
  TradePilotPositionPlan,
  TradePilotSidePositionPlan,
} from "@/lib/trade-pilot/trade-pilot.types";

type ClientAreaTradePilotPlanDetailsProps = {
  accountType: "micro" | "mini" | "regular";
  /** Diisi bila analisis berasal dari API: rencana juga disimpan ke backend TradePilot. */
  analysisId?: string;
  copy: ClientAreaTradePilotTradingPlanCopy;
  isPrimaryScenario: boolean;
  levels: ClientAreaTradePilotScenarioLevels;
  lossLimit: number;
  /** Hasil Adaptive Position Plan dari backend (semua angka uang). */
  plan: TradePilotPositionPlan;
  riskStyle: "conservative" | "moderate" | "aggressive";
  sidePlan: TradePilotSidePositionPlan | null;
  tradingCapital: number;
  variant: "buy" | "sell";
};

function formatMoney(value: number | null | undefined) {
  if (value == null || !Number.isFinite(value)) return "—";
  return `$${Math.max(0, value).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}

function formatLot(value: number) {
  return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function ClientAreaTradePilotPlanDetails({
  accountType,
  analysisId,
  copy,
  isPrimaryScenario,
  levels,
  lossLimit,
  plan,
  riskStyle,
  sidePlan,
  tradingCapital,
  variant,
}: ClientAreaTradePilotPlanDetailsProps) {
  const [activeTab, setActiveTab] =
    useState<ClientAreaTradePilotPlanTab>("summary");
  const isBuy = variant === "buy";
  // Semua angka berikut berasal dari backend (TP Standard Trading Rules).
  const firstLayer = sidePlan?.ladder[0] ?? null;
  const initialLot = formatLot(firstLayer?.lot ?? sidePlan?.totalLots ?? plan.recommendation?.initialLot ?? 0);
  const totalLot = formatLot(sidePlan?.totalLots ?? 0);
  const positions = Math.max(1, sidePlan?.ladder.length ?? 1);
  const riskPercentage = plan.recommendation?.riskUtilizationRate ?? 0;
  const usableRiskBudget = plan.recommendation?.usableRiskBudget ?? 0;
  const riskAtStop = sidePlan?.estimatedCycleLoss ?? 0;
  const marginRequired = sidePlan?.marginRequired ?? 0;
  const firstProfit = sidePlan?.profitToTakeProfit1 ?? null;
  const secondProfit = sidePlan?.profitToTakeProfit2 ?? null;
  const entryLabel = sidePlan ? String(sidePlan.entry) : levels.entry;
  const title = isBuy ? copy.buyScenarioLabel : copy.sellScenarioLabel;
  const riskStyleLabel =
    riskStyle === "conservative"
      ? copy.conservativeLabel
      : riskStyle === "moderate"
        ? copy.moderateLabel
        : copy.aggressiveLabel;
  const planText = [
    title,
    `${copy.initialEntryLabel}: ${entryLabel} · ${initialLot} ${copy.lotUnitLabel}`,
    `${copy.stopLossLabel}: ${levels.stopLoss}`,
    `${copy.takeProfitOneLabel}: ${levels.takeProfitOne}`,
    `${copy.takeProfitTwoLabel}: ${levels.takeProfitTwo}`,
    `${copy.maximumLossEstimateLabel}: ${formatMoney(riskAtStop)}`,
    `${copy.usedMarginLabel}: ${formatMoney(marginRequired)}`,
  ].join("\n");

  function persistPlan() {
    if (!analysisId) return;
    // Hasil dihitung backend (position-plan); di sini hanya disimpan (best effort).
    void fetch("/api/client-area/trade-pilot/trading-plans", {
      body: JSON.stringify({
        accountType,
        analysisId,
        lossLimit: lossLimit.toFixed(2),
        // Snapshot hasil hitungan backend (untuk riwayat rencana).
        result: {
          lot: totalLot,
          margin: marginRequired.toFixed(2),
          riskAtStop: riskAtStop.toFixed(2),
          takeProfitOne: firstProfit?.toFixed(2) ?? null,
          takeProfitTwo: secondProfit?.toFixed(2) ?? null,
          posture: plan.decision.posture,
          rulesVersion: plan.rulesVersion,
        },
        riskStyle: plan.riskStyle,
        tradingCapital: tradingCapital.toFixed(2),
        variant,
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    }).catch(() => undefined);
  }

  function handleSave() {
    persistPlan();
    const blob = new Blob([planText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `trade-pilot-${variant}-plan.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function handleShare() {
    try {
      if (navigator.share) {
        await navigator.share({ text: planText, title });
        return;
      }

      await navigator.clipboard.writeText(planText);
    } catch {
      // Sharing can be cancelled or unavailable outside a secure browser context.
    }
  }

  if (!sidePlan) {
    const diagnostic = plan.sideEvaluations[variant].diagnostic;
    return (
      <section
        id="trade-pilot-plan-details"
        role="status"
        className="mt-5 rounded-3xl border border-amber-500/40 bg-amber-950/20 p-5 text-sm leading-6 text-amber-200 sm:p-7"
      >
        <h3 className="text-lg font-black text-white">{title}</h3>
        {diagnostic ? (
          <>
            <strong className="mt-3 block text-amber-400">{copy.sideBlockedTitle}</strong>
            <p className="mt-1">
              {copy.sideBlockedDescription
                .replace("{lot}", String(diagnostic.lot))
                .replace("{margin}", formatMoney(diagnostic.marginRequired))
                .replace("{risk}", formatMoney(diagnostic.riskAtStop))
                .replace("{fundsShortfall}", formatMoney(diagnostic.marginShortfall))
                .replace("{riskShortfall}", formatMoney(diagnostic.riskShortfall))}
            </p>
          </>
        ) : (
          <p className="mt-3">{copy.sideUnavailableDescription}</p>
        )}
      </section>
    );
  }

  return (
    <section
      className={`mt-5 overflow-hidden rounded-3xl border ${isBuy ? "border-emerald-500/40 bg-emerald-950/5" : "border-red-500/40 bg-red-950/10"}`}
    >
      <div className="grid xl:grid-cols-[minmax(0,1fr)_330px]">
        <div id="trade-pilot-plan-details" className="min-w-0 p-5 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-xl font-black text-white">{title}</h3>
              {!isPrimaryScenario ? (
                <p
                  id="trade-pilot-alternate-scenario-status"
                  className="mt-1.5 w-fit rounded-full border border-yellow-500 px-3 py-1 text-[10px] font-medium leading-none text-yellow-400 sm:text-xs"
                >
                  {copy.alternateScenarioPendingLabel}
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                aria-describedby={!isPrimaryScenario ? "trade-pilot-alternate-scenario-status" : undefined}
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/70 backdrop-blur-sm px-4 py-2 text-xs font-bold text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:border-zinc-800 disabled:text-zinc-600 disabled:opacity-70 disabled:hover:bg-zinc-900/70 sm:text-sm"
                disabled={!isPrimaryScenario}
                onClick={handleSave}
                type="button"
              >
                <Download className="h-4 w-4" />
                {copy.savePlanLabel}
              </button>
              <button
                aria-describedby={!isPrimaryScenario ? "trade-pilot-alternate-scenario-status" : undefined}
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/70 backdrop-blur-sm px-4 py-2 text-xs font-bold text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:border-zinc-800 disabled:text-zinc-600 disabled:opacity-70 disabled:hover:bg-zinc-900/70 sm:text-sm"
                disabled={!isPrimaryScenario}
                onClick={() => void handleShare()}
                type="button"
              >
                <Share2 className="h-4 w-4" />
                {copy.shareLabel}
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <ClientAreaTradePilotPlanMetric
              description={copy.initialEntryDescription}
              label={copy.entryPositionLabel}
              value={`${entryLabel} · ${initialLot} ${copy.lotUnitLabel}`}
            />
            <ClientAreaTradePilotPlanMetric
              description={copy.finalStopLossDescription}
              label={copy.stopLossLabel}
              tone="danger"
              value={levels.stopLoss}
            />
            <ClientAreaTradePilotPlanMetric
              description={copy.riskBudgetDescription.replace(
                "{percentage}",
                String(Math.round(riskPercentage * 100)),
              ).replace("{limit}", formatMoney(lossLimit))}
              label={copy.riskBudgetLabel}
              value={formatMoney(usableRiskBudget)}
            />
            <ClientAreaTradePilotPlanMetric
              description={`+${formatMoney(firstProfit)} · +${formatMoney(secondProfit)}`}
              descriptionTone="success"
              label={copy.targetProfitLabel}
              value={`${copy.takeProfitOneShortLabel} ${levels.takeProfitOne} · ${copy.takeProfitTwoShortLabel} ${levels.takeProfitTwo}`}
            />
            <ClientAreaTradePilotPlanMetric
              description={copy.riskStyleDescriptions[riskStyle]}
              label={copy.riskStyleLabel}
              value={riskStyleLabel}
            />
          </div>

          <ClientAreaTradePilotPlanTabs
            activeTab={activeTab}
            copy={copy}
            onChange={setActiveTab}
            variant={variant}
          />

          {activeTab === "summary" ? (
            <div className="mt-5 space-y-4" role="tabpanel">
              <ClientAreaTradePilotPlanAccordion
                icon={<LogIn className="h-5 w-5 text-sky-400" />}
                subtitle={copy.allEntriesFilledDescription
                  .replace("{positions}", String(positions))
                  .replace("{lot}", totalLot)}
                title={copy.entryAndLotTitle}
              >
                <div className="mt-5 space-y-2">
                  {(sidePlan?.ladder.length ? sidePlan.ladder : []).map((layer, index) => (
                    <div
                      key={layer.level}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-zinc-700 bg-zinc-900/70 backdrop-blur-sm p-4"
                    >
                      <div>
                        <p className="text-xs text-zinc-400">
                          {index === 0
                            ? copy.initialEntryLabel
                            : copy.layerLabel
                                .replace("{level}", String(index + 1))
                                .replace("{price}", String(layer.price))}
                        </p>
                        <strong className="mt-1 block text-sm text-white">
                          {layer.price} · {formatLot(layer.lot)} {copy.lotUnitLabel}
                        </strong>
                      </div>
                      <span className="text-right text-[11px] leading-4 text-zinc-400">
                        {copy.positionMarginLabel}: {formatMoney(layer.dayMarginForLot)}
                        <br />
                        {copy.positionRiskAtStopLabel}: {formatMoney(layer.riskToStopForLot)}
                      </span>
                    </div>
                  ))}
                  {positions > 1 ? (
                    <p className="flex gap-2 text-xs leading-5 text-zinc-300">
                      <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                      {copy.additionalLayersNote}
                    </p>
                  ) : null}
                </div>
              </ClientAreaTradePilotPlanAccordion>

              <ClientAreaTradePilotPlanAccordion
                icon={<CircleAlert className="h-5 w-5 text-red-400" />}
                title={copy.riskSectionTitle}
              >
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <ClientAreaTradePilotPlanMetric
                    label={copy.finalStopLossLabel}
                    tone="danger"
                    value={levels.stopLoss}
                  />
                  <ClientAreaTradePilotPlanMetric
                    label={copy.maximumLossEstimateLabel}
                    value={formatMoney(riskAtStop)}
                  />
                </div>
              </ClientAreaTradePilotPlanAccordion>

              <ClientAreaTradePilotPlanAccordion
                icon={<Target className="h-5 w-5 text-emerald-400" />}
                title={copy.targetProfitSectionTitle}
              >
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <ClientAreaTradePilotPlanMetric
                    description={`${copy.estimatedProfitLabel}: +${formatMoney(firstProfit)}`}
                    label={copy.takeProfitOneLabel}
                    tone="success"
                    value={levels.takeProfitOne}
                  />
                  <ClientAreaTradePilotPlanMetric
                    description={`${copy.estimatedProfitLabel}: +${formatMoney(secondProfit)}`}
                    label={copy.takeProfitTwoLabel}
                    tone="success"
                    value={levels.takeProfitTwo}
                  />
                </div>
              </ClientAreaTradePilotPlanAccordion>

              <ClientAreaTradePilotPlanAccordion
                icon={<Calculator className="h-5 w-5 text-amber-400" />}
                title={copy.riskContextTitle}
              >
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <ClientAreaTradePilotPlanMetric
                    description={copy.guardrailDescription.replace(
                      "{percentage}",
                      String(Math.round(riskPercentage * 100)),
                    )}
                    label={copy.usableRiskBudgetLabel}
                    value={formatMoney(usableRiskBudget)}
                  />
                  <ClientAreaTradePilotPlanMetric
                    label={copy.proposedLossLimitLabel}
                    value={formatMoney(lossLimit)}
                  />
                </div>
                <p className="mt-4 flex gap-2 text-xs leading-5 text-zinc-300">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                  {positions > 1 ? copy.additionalLayersNote : copy.noAdditionalLayersNote}
                </p>
              </ClientAreaTradePilotPlanAccordion>
            </div>
          ) : activeTab === "details" ? (
            <div role="tabpanel">
              <ClientAreaTradePilotPlanBreakdown
                accountLabel={
                  accountType === "micro"
                    ? copy.microAccountLabel
                    : accountType === "mini"
                      ? copy.miniAccountLabel
                      : copy.regularAccountLabel
                }
                copy={copy}
                sidePlan={sidePlan}
                tradingCapital={tradingCapital}
              />
            </div>
          ) : activeTab === "unused" ? (
            <ClientAreaTradePilotUnusedLayers
              copy={copy}
              layers={sidePlan?.rejectedLadder ?? []}
            />
          ) : (
            <ClientAreaTradePilotRecommendationUsage
              copy={copy}
              lossLimit={lossLimit}
              riskBudget={usableRiskBudget}
              riskPercentage={riskPercentage}
            />
          )}
        </div>

        <aside
          className={`border-t p-5 sm:p-7 xl:border-l xl:border-t-0 ${isBuy ? "border-emerald-500/30" : "border-red-500/30"}`}
        >
          <div className="rounded-2xl border border-zinc-700 bg-zinc-900/95 p-5">
            <h4 className="flex items-center gap-3 text-sm font-bold text-white">
              <Calculator className="h-5 w-5 text-sky-400" />
              {copy.otherCalculationDetailsLabel}
            </h4>
            <dl className="mt-5 space-y-4 text-xs sm:text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-400">{copy.weightedAverageEntryLabel}</dt>
                <dd className="font-bold text-white">{sidePlan ? sidePlan.weightedAverageEntry : levels.entry}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-400">{copy.usedMarginLabel}</dt>
                <dd className="font-bold text-white">{formatMoney(marginRequired)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-400">{copy.marginAndStopLossLabel}</dt>
                <dd className="font-bold text-white">
                  {formatMoney(sidePlan?.totalFundsAtStop ?? marginRequired + riskAtStop)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-5 rounded-2xl border border-amber-500/60 bg-amber-500/10 p-5 text-amber-400">
            <h4 className="flex items-center gap-3 text-sm font-bold">
              <BookOpen className="h-5 w-5" />
              {copy.understandDetailsLabel}
            </h4>
            <p className="mt-4 text-xs leading-5 text-zinc-400 sm:text-sm sm:leading-6">
              {copy.understandDetailsDescription}
            </p>
            <a
              className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-black text-black transition hover:bg-amber-400"
              href="#trade-pilot-plan-details"
            >
              {copy.understandDetailsLabel}
              <ArrowRight className="h-5 w-5" />
            </a>
            <p className="mt-4 flex items-center gap-2 border-t border-amber-500/40 pt-4 text-xs text-zinc-300">
              <TriangleAlert className="h-4 w-4" />
              {copy.cancellationConditionsLabel}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
