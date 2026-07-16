import { ExchangeRatePanelClient } from "@/components/organisms/ExchangeRatePanelClient";
import { getExchangeRateSnapshot } from "@/lib/exchange-rates";
import { getLocaleConfig, getMessages, type AppLocale } from "@/locales";
import { SectionEyebrow } from "@/components/atoms/SectionEyebrow";

type ExchangeRatePanelProps = {
  locale: AppLocale;
};

function formatExchangeRateDate(value: string, locale: AppLocale) {
  const parsedDate = new Date(`${value}T00:00:00Z`);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(getLocaleConfig(locale).intl, {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(parsedDate);
}

export function ExchangeRatePanelFallback({
  locale,
}: ExchangeRatePanelProps) {
  const labels = getMessages(locale).liveQuotePage.exchangeRate;

  return (
    <section className="rounded-[1.75rem] border border-line p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <SectionEyebrow>{labels.eyebrow}</SectionEyebrow>
          <h2 className="mt-4 font-mono text-2xl font-bold tracking-[-0.04em] text-white sm:text-3xl">
            {labels.title}
          </h2>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">
        <div className="rounded-2xl border border-line bg-white/5 p-5">
          <div className="flex flex-col gap-4">
            <div className="h-11 animate-pulse rounded-lg bg-white/8" />
            <div className="grid grid-cols-[minmax(0,1fr)_40px_minmax(0,1fr)] gap-3">
              <div className="h-11 animate-pulse rounded-lg bg-white/8" />
              <div className="h-11 animate-pulse rounded-lg bg-white/8" />
              <div className="h-11 animate-pulse rounded-lg bg-white/8" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-yellow-500/15 bg-[linear-gradient(180deg,rgba(205,161,58,0.07),rgba(10,10,10,0.88)_45%)] p-5">
          <div className="h-3 w-16 animate-pulse rounded bg-white/8" />
          <div className="mt-4 h-10 w-44 animate-pulse rounded-lg bg-white/10" />
          <div className="mt-3 h-px w-full animate-pulse rounded bg-white/6" />
          <div className="mt-3 h-3 w-36 animate-pulse rounded bg-white/8" />
          <div className="mt-2 h-3 w-28 animate-pulse rounded bg-white/6" />
        </div>
      </div>
    </section>
  );
}

export async function ExchangeRatePanel({ locale }: ExchangeRatePanelProps) {
  const labels = getMessages(locale).liveQuotePage.exchangeRate;
  const snapshot = await getExchangeRateSnapshot();

  if (!snapshot) {
    return (
      <section className="rounded-[1.75rem] border border-line p-5 sm:p-6">
        <div>
          <SectionEyebrow>{labels.eyebrow}</SectionEyebrow>
          <h2 className="mt-4 font-mono text-2xl font-bold tracking-[-0.04em] text-white sm:text-3xl">
            {labels.title}
          </h2>
        </div>

        <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line bg-white/[0.02] px-5 py-12 text-center">
          <p className="text-sm text-foreground/50">{labels.unavailable}</p>
        </div>
      </section>
    );
  }

  return (
    <ExchangeRatePanelClient
      locale={locale}
      labels={labels}
      initialSnapshot={snapshot}
      formattedUpdatedDate={formatExchangeRateDate(snapshot.date, locale)}
    />
  );
}
