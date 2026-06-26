import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

import { getMessages, type AppLocale } from "@/locales";

type ClientAreaDashboardProps = {
  locale: AppLocale;
};

function resolveLocalizedHref(locale: AppLocale, href = "/") {
  if (href === "/") {
    return `/${locale}`;
  }

  if (href.startsWith(`/${locale}`)) {
    return href;
  }

  return href.startsWith("/") ? `/${locale}${href}` : href;
}

function resolveQuickActionHref(locale: AppLocale, actionId: string) {
  switch (actionId) {
    case "deposit":
    case "withdraw":
    case "overbook":
      return "#services";
    default:
      return resolveLocalizedHref(locale, "/client-area");
  }
}

function resolveShortcutHref(locale: AppLocale, actionId: string) {
  switch (actionId) {
    case "signal":
    case "mover":
    case "trending":
      return "#market";
    case "products":
      return resolveLocalizedHref(locale, "/produk/multilateral");
    case "education":
      return resolveLocalizedHref(locale, "/education/cara-memulai");
    default:
      return "#services";
  }
}

function resolveServiceHref(locale: AppLocale, label: string) {
  if (/live quote/i.test(label)) {
    return resolveLocalizedHref(locale, "/live-quote");
  }

  if (/calendar|kalender/i.test(label)) {
    return resolveLocalizedHref(locale, "/economic-calendar");
  }

  return resolveLocalizedHref(locale, "/contact-us");
}

export function ClientAreaDashboard({
  locale,
}: ClientAreaDashboardProps) {
  const { clientArea } = getMessages(locale);
  const actionIconMap: Record<string, IconProp> = {
    deposit: ["fas", "circle-down"],
    withdraw: ["fas", "circle-up"],
    overbook: ["fas", "right-left"],
  };
  const shortcutIconMap: Record<string, IconProp> = {
    signal: ["fas", "tower-broadcast"],
    mover: ["fas", "arrow-trend-up"],
    trending: ["fas", "chart-line"],
    products: ["fas", "layer-group"],
    education: ["fas", "book-open"],
    rewards: ["fas", "gift"],
    deposit: ["fas", "wallet"],
    more: ["fas", "ellipsis"],
  };
  const signalToneMap = {
    buy: {
      card: "border-[#d8e8ff] bg-[#eef5ff]",
      chip: "bg-[#d7ecff] text-[#2563eb]",
      line: "#2563eb",
    },
    sell: {
      card: "border-[#ffd9dd] bg-[#fff1f2]",
      chip: "bg-[#ffe1e5] text-[#dc2626]",
      line: "#dc2626",
    },
    neutral: {
      card: "border-[#dde3ea] bg-[#f8fafc]",
      chip: "bg-[#e2e8f0] text-[#475569]",
      line: "#64748b",
    },
  } as const;
  const surfaceClassName =
    "rounded-[24px] bg-white p-4 shadow-[0_12px_36px_rgba(15,23,42,0.08)] sm:p-5";

  return (
    <div className="space-y-6">
      <section
        id="overview"
        className="grid gap-6 xl:grid-cols-[1.05fr_1fr]"
      >
        <article className="rounded-[24px] bg-white p-6 shadow-[0_12px_36px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-400">
                {clientArea.accountPanel.eyebrow}
              </p>
              <h1 className="mt-1 text-4xl font-bold tracking-[-0.03em] text-[#163245]">
                {clientArea.accountPanel.title}
              </h1>
            </div>

            <a
              href="#services"
              className="inline-flex items-center justify-center rounded-xl bg-[#10b567] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-105"
            >
              {clientArea.accountPanel.primaryCta}
            </a>
          </div>

          <div className="mt-8 grid gap-4 border-t border-slate-200 pt-6 sm:grid-cols-2">
            {clientArea.accountPanel.items.map((item, index) => (
              <div
                key={item.id}
                className={`flex items-center justify-between gap-4 ${
                  index === 0 ? "sm:border-r sm:border-slate-200 sm:pr-6" : ""
                }`}
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#ebf8f1] text-[#10b567]">
                  <FontAwesomeIcon
                    icon={index === 0 ? ["fas", "wallet"] : ["fas", "chart-pie"]}
                    className="h-5 w-5"
                  />
                </span>

                <div className="ml-auto text-right">
                  <p className="text-sm font-medium text-slate-400">
                    {item.label}
                  </p>
                  <p className="mt-1 text-3xl font-bold tracking-[-0.03em] text-[#0f9f60]">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article
          className="relative overflow-hidden rounded-[24px] bg-[#0f2333] p-6 text-white shadow-[0_18px_40px_rgba(15,23,42,0.14)]"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(6,20,31,0.96) 0%, rgba(6,20,31,0.82) 46%, rgba(6,20,31,0.3) 100%), url('/assets/BANNER-UTAMA-SOLID-2.png')",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="max-w-[340px]">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#f5d477]">
              {clientArea.promoPanel.eyebrow}
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-[-0.03em]">
              {clientArea.promoPanel.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/80">
              {clientArea.promoPanel.description}
            </p>
            <a
              href="#services"
              className="mt-5 inline-flex rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#0f2333] transition hover:bg-white/90"
            >
              {clientArea.promoPanel.cta}
            </a>
          </div>
        </article>
      </section>

      <section className={surfaceClassName}>
        <div className="grid gap-4 md:grid-cols-3">
          {clientArea.quickActions.items.map((item) => (
            <a
              key={item.id}
              href={resolveQuickActionHref(locale, item.id)}
              className="flex items-center justify-center gap-3 rounded-[18px] border-2 border-[#10b567] bg-white px-5 py-5 text-center text-lg font-semibold text-[#0f9f60] transition hover:bg-[#f3fcf7]"
            >
              <FontAwesomeIcon
                icon={actionIconMap[item.id] ?? ["fas", "circle"]}
                className="h-5 w-5"
              />
              {item.label}
            </a>
          ))}
        </div>
      </section>

      <section className={surfaceClassName}>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 xl:grid-cols-8">
          {clientArea.shortcutPanel.items.map((item) => (
            <a
              key={item.id}
              href={resolveShortcutHref(locale, item.id)}
              className="flex flex-col items-center gap-3 rounded-[20px] px-3 py-4 text-center transition hover:bg-slate-50"
            >
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f8ef] text-[#10b567]">
                <FontAwesomeIcon
                  icon={shortcutIconMap[item.id] ?? ["fas", "circle"]}
                  className="h-6 w-6"
                />
              </span>
              <span className="text-sm font-semibold text-slate-700">
                {item.label}
              </span>
            </a>
          ))}
        </div>
      </section>

      <section id="market">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-[-0.03em] text-[#163245]">
              {clientArea.signalsPanel.title}
            </h2>
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[11px] font-bold text-slate-500">
              i
            </span>
          </div>

          <Link
            href={resolveLocalizedHref(locale, "/news")}
            className="text-sm font-semibold text-[#0f9f60] transition hover:text-[#0b7b4a]"
          >
            {clientArea.signalsPanel.cta}
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {clientArea.signalsPanel.items.map((item) => {
            const tone = signalToneMap[item.bias];

            return (
              <article
                key={`${item.symbol}-${item.time}`}
                className={`rounded-[24px] border p-4 shadow-[0_10px_26px_rgba(15,23,42,0.05)] ${tone.card}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xl font-bold tracking-[-0.02em] text-[#163245]">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">{item.time}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${tone.chip}`}>
                    {item.bias}
                  </span>
                </div>

                <div className="mt-4 rounded-[18px] bg-white/80 p-3">
                  <div className="mb-3 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                    <span>{item.symbol}</span>
                    <span>Signal</span>
                  </div>

                  <svg viewBox="0 0 220 120" className="h-28 w-full">
                    <path
                      d={
                        item.bias === "sell"
                          ? "M10 25 C40 28, 55 45, 85 58 S140 85, 210 102"
                          : item.bias === "buy"
                            ? "M10 95 C42 84, 66 73, 96 68 S160 42, 210 20"
                            : "M10 72 C42 70, 66 68, 96 66 S160 62, 210 58"
                      }
                      fill="none"
                      stroke={tone.line}
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M10 110 H210"
                      fill="none"
                      stroke="#cbd5e1"
                      strokeWidth="2"
                      strokeDasharray="5 5"
                    />
                  </svg>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="services" className={surfaceClassName}>
        <h2 className="text-2xl font-bold tracking-[-0.03em] text-[#163245]">
          {clientArea.servicePanel.title}
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {clientArea.servicePanel.items.map((item) => (
            <article
              key={item.label}
              className="rounded-[20px] border border-slate-200 bg-slate-50 p-5"
            >
              <h3 className="text-lg font-semibold text-[#163245]">
                {item.label}
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {item.description}
              </p>
              <a
                href={resolveServiceHref(locale, item.label)}
                className="mt-4 inline-flex text-sm font-semibold text-[#0f9f60] transition hover:text-[#0b7b4a]"
              >
                {item.cta}
              </a>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
