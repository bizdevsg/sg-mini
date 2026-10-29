"use client";

import { useEffect, useRef, useState, useTransition } from "react";

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
import { ClientAreaTradePilotTechnicalIndicatorsSection } from "@/components/organisms/ClientAreaTradePilotTechnicalIndicatorsSection";
import { ClientAreaTradePilotTradingPlanSection } from "@/components/organisms/ClientAreaTradePilotTradingPlanSection";
import { useClientAreaAccountMode } from "@/components/providers/ClientAreaAccountModeProvider";
import { useLiveQuoteStream } from "@/hooks/useLiveQuoteStream";
import { getTradePilotPauseReason } from "@/lib/trade-pilot/trade-pilot-availability";
import {
  CLIENT_AREA_TRADE_PILOT_INSTRUMENTS,
  CLIENT_AREA_TRADE_PILOT_TIMEFRAMES,
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
import type { NewsFeedArticle } from "@/lib/news.shared";

type ClientAreaTradePilotPanelProps = {
  copy: ClientAreaTradePilotCopy;
  economicCalendarEvents: EconomicCalendarEvent[];
  latestNews: NewsFeedArticle[];
  livePriceLabel: string;
  locale: AppLocale;
  bootstrap: TradePilotBootstrap;
  mockDataLabel: string;
  newsLabel: string;
};

export function ClientAreaTradePilotPanel({
  copy,
  economicCalendarEvents,
  latestNews,
  livePriceLabel,
  locale,
  bootstrap,
  mockDataLabel,
  newsLabel,
}: ClientAreaTradePilotPanelProps) {
  const { accountMode, setAccountMode } = useClientAreaAccountMode();
  const { quotes } = useLiveQuoteStream();
  const [isAnalyzing, startAnalysisTransition] = useTransition();
  const [credits, setCredits] = useState(bootstrap.credits);
  const [latestAnalyses, setLatestAnalyses] = useState(bootstrap.latestAnalyses);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  // Lokasi tampilan error: tombol Analisis (picker) atau baris Ganti Timeframe.
  const [errorOrigin, setErrorOrigin] = useState<"picker" | "timeframe">("picker");
  const [pendingTimeframe, setPendingTimeframe] =
    useState<ClientAreaTradePilotTimeframe | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(bootstrap.isNewUser);
  // Idempotency-Key dibuat sekali per klik. Retry setelah error jaringan/timeout
  // dengan payload yang sama memakai key yang sama agar kredit tidak terpotong dua kali.
  const pendingAnalysisRef = useRef<{ key: string; signature: string } | null>(null);
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

  useEffect(() => {
    const current = latestAnalyses[mode];
    if (!current || current.source !== "api" || current.status !== "still_valid") {
      return;
    }
    const controller = new AbortController();
    const refresh = () => {
      void fetch(
        `/api/client-area/trade-pilot/analyses/${encodeURIComponent(current.id)}`,
        { cache: "no-store", signal: controller.signal },
      )
        .then((response) => {
          if (!response.ok) throw new Error("analysis_refresh_failed");
          return response.json() as Promise<TradePilotAnalysisResult>;
        })
        .then((nextAnalysis) => {
          setLatestAnalyses((value) => ({ ...value, [mode]: nextAnalysis }));
        })
        .catch(() => undefined);
    };
    const interval = window.setInterval(refresh, 60_000);
    return () => {
      controller.abort();
      window.clearInterval(interval);
    };
  }, [latestAnalyses, mode]);

  const selectedInstrument =
    CLIENT_AREA_TRADE_PILOT_INSTRUMENTS.find(
      ({ id }) => id === selectedInstrumentId,
    ) ?? CLIENT_AREA_TRADE_PILOT_INSTRUMENTS[0];
  const { symbol: quoteSymbol, tick } = findClientAreaTradePilotTick(
    quotes,
    selectedInstrument,
  );
  const analysis: TradePilotAnalysisResult | undefined = latestAnalyses[mode];

  // Kill switch dari konsol admin TradePilot: nonaktifkan tombol sebelum diklik.
  const availability = bootstrap.analysisAvailability;
  const pauseReason = getTradePilotPauseReason(availability, {
    instrumentId: selectedInstrument.id,
    mode,
    timeframe,
  });
  const generalPauseMessage = availability?.message || copy.analysisPausedMessage;
  const pauseMessage =
    pauseReason === "global" || pauseReason === "mode"
      ? generalPauseMessage
      : pauseReason === "instrument"
        ? copy.analysisPausedSelectionMessage.replace("{target}", selectedInstrument.label)
        : pauseReason === "timeframe"
          ? copy.analysisPausedSelectionMessage.replace(
              "{target}",
              CLIENT_AREA_TRADE_PILOT_TIMEFRAMES.find(({ value }) => value === timeframe)?.label ?? timeframe,
            )
          : null;
  const resultPauseReason = analysis
    ? getTradePilotPauseReason(availability, {
        instrumentId: analysis.instrumentId,
        mode,
        timeframe: analysis.timeframe,
      })
    : null;

  function handleRecommendationVisibilityChange(visible: boolean) {
    setTechnicalIndicatorsAnalysisId(visible && analysis ? analysis.id : null);
  }

  function handleAnalyze() {
    setErrorOrigin("picker");
    runAnalysis({ instrumentId: selectedInstrument.id, mode, timeframe });
  }

  /** Ganti timeframe dari hasil analisis: instrumen sama, analisis baru (1 kredit). */
  function handleTimeframeAnalyze(nextTimeframe: ClientAreaTradePilotTimeframe) {
    if (!analysis || isAnalyzing) return;
    setSelectedInstrumentId(analysis.instrumentId);
    setTimeframe(nextTimeframe);
    setPendingTimeframe(nextTimeframe);
    setErrorOrigin("timeframe");
    runAnalysis(
      { instrumentId: analysis.instrumentId, mode, timeframe: nextTimeframe },
      () => setPendingTimeframe(null),
    );
  }

  function runAnalysis(
    input: { instrumentId: ClientAreaTradePilotInstrument["id"]; mode: TradePilotMode; timeframe: ClientAreaTradePilotTimeframe },
    onSettled?: () => void,
  ) {
    setAnalysisError(null);
    const signature = `${input.instrumentId}:${input.mode}:${input.timeframe}`;
    const pending = pendingAnalysisRef.current;
    const idempotencyKey =
      pending && pending.signature === signature
        ? pending.key
        : crypto.randomUUID();
    pendingAnalysisRef.current = { key: idempotencyKey, signature };

    startAnalysisTransition(async () => {
      try {
        await executeAnalysis(input, idempotencyKey);
      } finally {
        onSettled?.();
      }
    });
  }

  async function executeAnalysis(
    input: { instrumentId: ClientAreaTradePilotInstrument["id"]; mode: TradePilotMode; timeframe: ClientAreaTradePilotTimeframe },
    idempotencyKey: string,
  ) {
    const { mode } = input;
    let result: Awaited<ReturnType<typeof runClientAreaTradePilotAnalysis>>;
    try {
      result = await runClientAreaTradePilotAnalysis(input, idempotencyKey, locale);
    } catch {
      // Gagal jaringan: simpan key supaya klik ulang = retry, bukan analisis baru.
      setAnalysisError(copy.analysisErrorMessage);
      return;
    }

    // Hanya error sementara (5xx/timeout) yang boleh di-retry dengan key yang sama.
    if (result.status !== "error" && result.status !== "analysis_unavailable") {
      pendingAnalysisRef.current = null;
    }

    if (result.status === "success") {
      setCredits((current) => ({ ...current, [mode]: result.credit }));
      setLatestAnalyses((current) => ({ ...current, [mode]: result.analysis }));
      return;
    }

    if (result.status === "insufficient_credit") {
      const resetsAt = result.resetsAt ?? credits[mode]?.resetsAt;
      setAnalysisError(
        resetsAt
          ? `${copy.insufficientCreditMessage} ${copy.creditResetsMessage.replace(
              "{date}",
              formatResetDate(resetsAt, locale),
            )}`
          : copy.insufficientCreditMessage,
      );
      return;
    }

    if (result.status === "analysis_paused") {
      setAnalysisError(result.message || copy.analysisPausedMessage);
      return;
    }

    if (result.status === "rate_limited") {
      setAnalysisError(
        result.retryAfterSeconds
          ? copy.rateLimitedRetryMessage.replace(
              "{seconds}",
              String(result.retryAfterSeconds),
            )
          : copy.rateLimitedMessage,
      );
      return;
    }

    setAnalysisError(
      result.status === "access_denied"
        ? copy.accessDeniedMessage
        : result.status === "analysis_unavailable"
          ? copy.analysisUnavailableMessage
          : copy.analysisErrorMessage,
    );
  }

  return (
    <div className="min-w-0 space-y-4 text-sm sm:space-y-5">
      <ClientAreaLivePriceTicker
        label={livePriceLabel}
        latestNews={latestNews}
        locale={locale}
        newsLabel={newsLabel}
      />
      <ClientAreaTradePilotPageHeader
        copy={copy}
        credit={credits[mode]}
        mockDataLabel={mockDataLabel}
      />

      {bootstrap.unavailable ? (
        <p role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
          {copy.serviceUnavailableMessage}
        </p>
      ) : null}

      {showOnboarding ? (
        <section
          aria-labelledby="trade-pilot-onboarding-title"
          className="rounded-3xl border border-amber-500/40 bg-amber-500/10 p-5 sm:p-6"
        >
          <h2 id="trade-pilot-onboarding-title" className="font-bold text-white">
            {copy.onboardingTitle}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-300">
            {copy.onboardingDescription}
          </p>
          <button
            type="button"
            onClick={() => setShowOnboarding(false)}
            className="mt-4 rounded-xl bg-amber-400 px-4 py-2 text-sm font-bold text-black transition hover:bg-amber-300"
          >
            {copy.onboardingDismissLabel}
          </button>
        </section>
      ) : null}

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
            disabled={(credits[mode]?.remaining ?? 0) < 1 || pauseReason !== null}
            isAnalyzing={isAnalyzing}
            onAnalyze={handleAnalyze}
          />
          {analysisError && errorOrigin === "picker" ? (
            <p role="alert" className="mt-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
              {analysisError}
            </p>
          ) : pauseMessage ? (
            <p role="status" className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
              {pauseMessage}
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
          mockDataLabel={mockDataLabel}
          analysisError={errorOrigin === "timeframe" ? analysisError : null}
          hasCredit={(credits[mode]?.remaining ?? 0) >= 1}
          isAnalyzing={isAnalyzing}
          isTimeframePaused={(nextTimeframe) =>
            getTradePilotPauseReason(availability, {
              instrumentId: analysis.instrumentId,
              mode,
              timeframe: nextTimeframe,
            }) !== null
          }
          analysisPausedMessage={
            resultPauseReason === "global" || resultPauseReason === "mode" || resultPauseReason === "instrument"
              ? resultPauseReason === "instrument"
                ? copy.analysisPausedSelectionMessage.replace("{target}", analysis.instrumentLabel)
                : generalPauseMessage
              : null
          }
          onTimeframeAnalyze={handleTimeframeAnalyze}
          locale={locale}
          pendingTimeframe={pendingTimeframe}
        />
      ) : (
        <section className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-900/70 backdrop-blur-sm p-8 text-center">
          <h2 className="font-bold text-white">{copy.noAnalysisTitle}</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-zinc-400">{copy.noAnalysisDescription}</p>
        </section>
      )}

      <ClientAreaTradePilotFundamentalSection
        copy={copy.fundamentalContext}
        events={economicCalendarEvents}
        instrumentId={bootstrap.source === "api" ? selectedInstrument.id : undefined}
        locale={locale}
      />
      {analysis ? (
        <ClientAreaTradePilotMarketContextSection
          analysis={analysis}
          copy={copy.marketContextSummary}
        />
      ) : null}
      <ClientAreaTradePilotTradingPlanSection
        locale={locale}
        key={analysis?.id ?? "no-analysis"}
        analysis={analysis}
        copy={copy.tradingPlan}
        onRecommendationVisibilityChange={
          handleRecommendationVisibilityChange
        }
      />
      {analysis && technicalIndicatorsAnalysisId === analysis.id ? (
        <ClientAreaTradePilotTechnicalIndicatorsSection
          analysis={analysis}
          copy={copy.technicalIndicators}
        />
      ) : null}
      <ClientAreaTradePilotFooterSection copy={copy.footer} />
    </div>
  );
}

function formatResetDate(value: string, locale: AppLocale) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
