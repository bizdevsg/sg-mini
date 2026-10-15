"use client";

import { useEffect, useState, useTransition } from "react";

import { runClientAreaTradePilotAnalysis } from "@/app/actions/clientAreaTradePilot";

import { ClientAreaLivePriceTicker } from "@/components/molecules/ClientAreaLivePriceTicker";
import { ClientAreaTradePilotActions } from "@/components/molecules/ClientAreaTradePilotActions";
import { ClientAreaTradePilotInstrumentPicker } from "@/components/molecules/ClientAreaTradePilotInstrumentPicker";
import { ClientAreaTradePilotPageHeader } from "@/components/molecules/ClientAreaTradePilotPageHeader";
import { ClientAreaTradePilotChartPanel } from "@/components/organisms/ClientAreaTradePilotChartPanel";
import { ClientAreaTradePilotAnalysisResultSection } from "@/components/organisms/ClientAreaTradePilotAnalysisResultSection";
import { ClientAreaTradePilotFundamentalSection } from "@/components/organisms/ClientAreaTradePilotFundamentalSection";
import { ClientAreaTradePilotFooterSection } from "@/components/organisms/ClientAreaTradePilotFooterSection";
import { ClientAreaTradePilotMarketContextSection } from "@/components/organisms/ClientAreaTradePilotMarketContextSection";
import { ClientAreaTradePilotPriceAlertSection } from "@/components/organisms/ClientAreaTradePilotPriceAlertSection";
import { ClientAreaTradePilotTechnicalIndicatorsSection } from "@/components/organisms/ClientAreaTradePilotTechnicalIndicatorsSection";
import { ClientAreaTradePilotTradingPlanSection } from "@/components/organisms/ClientAreaTradePilotTradingPlanSection";
import { useClientAreaAccountMode } from "@/components/providers/ClientAreaAccountModeProvider";
import { useLiveQuoteStream } from "@/hooks/useLiveQuoteStream";
import {
  CLIENT_AREA_TRADE_PILOT_INSTRUMENTS,
  findClientAreaTradePilotTick,
  type ClientAreaTradePilotCopy,
  type ClientAreaTradePilotInstrument,
  type ClientAreaTradePilotTimeframe,
} from "@/lib/client-area-trade-pilot.shared";
import type {
  TradePilotAnalysisResult,
  TradePilotBootstrap,
  TradePilotMode,
} from "@/lib/trade-pilot/trade-pilot.types";
import type { AppLocale } from "@/locales";
import type { EconomicCalendarEvent } from "@/lib/economic-calendar.shared";

type ClientAreaTradePilotPanelProps = {
  copy: ClientAreaTradePilotCopy;
  economicCalendarEvents: EconomicCalendarEvent[];
  livePriceLabel: string;
  locale: AppLocale;
  bootstrap: TradePilotBootstrap;
  mockDataLabel: string;
};

export function ClientAreaTradePilotPanel({
  copy,
  economicCalendarEvents,
  livePriceLabel,
  locale,
  bootstrap,
  mockDataLabel,
}: ClientAreaTradePilotPanelProps) {
  const { accountMode, setAccountMode } = useClientAreaAccountMode();
  const { quotes } = useLiveQuoteStream();
  const [isAnalyzing, startAnalysisTransition] = useTransition();
  const [credits, setCredits] = useState(bootstrap.credits);
  const [latestAnalyses, setLatestAnalyses] = useState(bootstrap.latestAnalyses);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [technicalIndicatorsAnalysisId, setTechnicalIndicatorsAnalysisId] =
    useState<string | null>(null);
  const [selectedInstrumentId, setSelectedInstrumentId] =
    useState<ClientAreaTradePilotInstrument["id"]>("gold");
  const [timeframe, setTimeframe] =
    useState<ClientAreaTradePilotTimeframe>("60");
  const mode: TradePilotMode = bootstrap.access.availableModes.includes(accountMode)
    ? accountMode
    : "real";

  useEffect(() => {
    if (accountMode !== mode) setAccountMode(mode);
  }, [accountMode, mode, setAccountMode]);

  const selectedInstrument =
    CLIENT_AREA_TRADE_PILOT_INSTRUMENTS.find(
      ({ id }) => id === selectedInstrumentId,
    ) ?? CLIENT_AREA_TRADE_PILOT_INSTRUMENTS[0];
  const { symbol: quoteSymbol, tick } = findClientAreaTradePilotTick(
    quotes,
    selectedInstrument,
  );
  const analysis: TradePilotAnalysisResult | undefined = latestAnalyses[mode];

  function handleRecommendationVisibilityChange(visible: boolean) {
    setTechnicalIndicatorsAnalysisId(visible && analysis ? analysis.id : null);
  }

  function handleAnalyze() {
    setAnalysisError(null);
    startAnalysisTransition(async () => {
      const result = await runClientAreaTradePilotAnalysis(
        {
          instrumentId: selectedInstrument.id,
          instrumentLabel: selectedInstrument.label,
          mode,
          timeframe,
        },
        crypto.randomUUID(),
      );

      if (result.status === "success") {
        setCredits((current) => ({ ...current, [mode]: result.credit }));
        setLatestAnalyses((current) => ({ ...current, [mode]: result.analysis }));
        return;
      }

      setAnalysisError(
        result.status === "insufficient_credit"
          ? copy.insufficientCreditMessage
          : copy.analysisErrorMessage,
      );
    });
  }

  return (
    <div className="min-w-0 space-y-4 text-sm sm:space-y-5">
      <ClientAreaLivePriceTicker label={livePriceLabel} />
      <ClientAreaTradePilotPageHeader
        availableModes={bootstrap.access.availableModes}
        copy={copy}
        credit={credits[mode]}
        mockDataLabel={mockDataLabel}
        mode={mode}
        onModeChange={setAccountMode}
      />

      <div className="grid min-w-0 items-start gap-4 sm:gap-5 xl:grid-cols-[minmax(250px,300px)_minmax(0,1fr)]">
        <aside className="grid min-w-0 gap-4 sm:gap-5 md:grid-cols-[minmax(0,1fr)_minmax(220px,0.45fr)] xl:block xl:space-y-5">
          <ClientAreaTradePilotInstrumentPicker
            copy={copy}
            instruments={CLIENT_AREA_TRADE_PILOT_INSTRUMENTS}
            onSelect={setSelectedInstrumentId}
            quotes={quotes}
            selectedInstrumentId={selectedInstrumentId}
          />
          <ClientAreaTradePilotActions
            copy={copy}
            disabled={(credits[mode]?.remaining ?? 0) < 1}
            isAnalyzing={isAnalyzing}
            onAnalyze={handleAnalyze}
          />
          {analysisError ? (
            <p role="alert" className="mt-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
              {analysisError}
            </p>
          ) : null}
        </aside>

        <ClientAreaTradePilotChartPanel
          copy={copy}
          instrument={selectedInstrument}
          locale={locale}
          onTimeframeChange={setTimeframe}
          quoteSymbol={quoteSymbol}
          tick={tick}
          timeframe={timeframe}
        />
      </div>

      {analysis ? (
        <ClientAreaTradePilotAnalysisResultSection
          analysis={analysis}
          copy={copy}
          locale={locale}
          mockDataLabel={mockDataLabel}
        />
      ) : (
        <section className="rounded-3xl border border-dashed border-zinc-700 bg-[#101113] p-8 text-center">
          <h2 className="font-bold text-white">{copy.noAnalysisTitle}</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-zinc-400">{copy.noAnalysisDescription}</p>
        </section>
      )}

      <ClientAreaTradePilotFundamentalSection
        copy={copy.fundamentalContext}
        events={economicCalendarEvents}
        locale={locale}
      />
      {analysis ? (
        <ClientAreaTradePilotMarketContextSection
          copy={copy.marketContextSummary}
          sentiment={analysis.marketSentiment}
        />
      ) : null}
      <ClientAreaTradePilotTradingPlanSection
        key={analysis?.id ?? "no-analysis"}
        analysis={analysis}
        copy={copy.tradingPlan}
        onRecommendationVisibilityChange={
          handleRecommendationVisibilityChange
        }
      />
      {analysis && technicalIndicatorsAnalysisId === analysis.id ? (
        <>
          <ClientAreaTradePilotTechnicalIndicatorsSection
            analysis={analysis}
            copy={copy.technicalIndicators}
          />
          <ClientAreaTradePilotPriceAlertSection
            analysis={analysis}
            copy={copy.priceAlert}
          />
        </>
      ) : null}
      <ClientAreaTradePilotFooterSection
        copy={copy.footer}
        locale={locale}
      />
    </div>
  );
}
