"use client";

import { useState } from "react";

import { SectionEyebrow } from "@/components/atoms/SectionEyebrow";
import { ExchangeRateConverter } from "@/components/organisms/ExchangeRateConverter";
import { ExchangeRateMatrix } from "@/components/organisms/ExchangeRateMatrix";
import type { ExchangeRateSnapshot } from "@/lib/exchange-rates";
import type { AppLocale, AppMessages } from "@/locales";
import { RefreshCw } from "lucide-react";

type ExchangeRatePanelClientProps = {
  locale: AppLocale;
  labels: AppMessages["liveQuotePage"]["exchangeRate"];
  initialSnapshot: ExchangeRateSnapshot;
  formattedUpdatedDate: string;
};

export function ExchangeRatePanelClient({
  locale,
  labels,
  initialSnapshot,
  formattedUpdatedDate,
}: ExchangeRatePanelClientProps) {
  const [showMatrix, setShowMatrix] = useState(false);
  const [activeSnapshot, setActiveSnapshot] =
    useState<ExchangeRateSnapshot>(initialSnapshot);

  return (
    <section className="rounded-[1.75rem] border border-line p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <SectionEyebrow>{labels.eyebrow}</SectionEyebrow>
          <h2 className="mt-4 font-mono text-2xl font-bold tracking-[-0.04em] text-white sm:text-3xl">
            {labels.title}
          </h2>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setShowMatrix((currentValue) => !currentValue)}
            className={`group flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${showMatrix
              ? "border-yellow-500/40 bg-yellow-500/12 text-yellow-400"
              : "border-line bg-white/5 text-foreground/68 hover:border-yellow-500/30 hover:text-yellow-400"
              }`}
          >
            <RefreshCw
              className={`h-4 w-4 transition-transform duration-500 ${showMatrix ? "rotate-180" : "rotate-0"
                }`}
            />

            {showMatrix
              ? labels.calculatorToggleLabel
              : labels.matrixToggleLabel}
          </button>

          <div className="flex shrink-0 items-center gap-2 rounded-full border border-line bg-white/5 px-4 py-2 text-xs text-foreground/62">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            {labels.updatedLabel}: {formattedUpdatedDate}
          </div>
        </div>
      </div>

      {showMatrix ? (
        <ExchangeRateMatrix
          locale={locale}
          labels={labels}
          snapshot={activeSnapshot}
        />
      ) : (
        <ExchangeRateConverter
          locale={locale}
          labels={labels}
          initialSnapshot={initialSnapshot}
          onSnapshotChange={setActiveSnapshot}
        />
      )}
    </section>
  );
}
