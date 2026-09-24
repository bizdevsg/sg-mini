import { PageHeroBanner } from "./PageHeroBanner";
import { SectionContainer } from "@/components/atoms/SectionContainer";
import type { AppLocale, TradingRulesPageContent } from "@/locales";

type Props = {
  homeLabel: string;
  locale: AppLocale;
  page: TradingRulesPageContent;
};

export function TradingRulesPage({ homeLabel, locale, page }: Props) {
  return (
    <main>
      <PageHeroBanner
        locale={locale}
        homeLabel={homeLabel}
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
        breadcrumbs={[
          {
            label: page.education,
            href: `/${locale}/education/cara-memulai`,
            tone: "accent",
          },
          { label: page.current, tone: "current" },
        ]}
      >
        <div className="flex flex-wrap justify-center gap-3">
          {page.badges.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-100 backdrop-blur-md"
            >
              {badge}
            </span>
          ))}
        </div>
      </PageHeroBanner>
      <div className="relative">
        <div className="absolute top-0 w-full h-50 bg-linear-to-b from-black to-transparent" />
        <SectionContainer className="relative py-14 sm:py-20">
          <div className="mx-auto max-w-5xl space-y-12">
            <section className="rounded-3xl border border-yellow-500/25 bg-yellow-500/5 p-6 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-yellow-400">
                {page.contractsLabel}
              </p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {page.contracts.map((contract) => (
                  <article
                    key={contract.code}
                    className="rounded-2xl border border-white/10 bg-black/20 p-5"
                  >
                    <p className="text-lg font-bold text-white">
                      {contract.name}
                    </p>
                    <p className="mt-2 font-mono text-yellow-400">
                      {contract.code}
                    </p>
                    <p className="mt-2 text-sm text-zinc-300">{contract.type}</p>
                  </article>
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-white">{page.hoursTitle}</h2>
              <p className="mt-2 text-zinc-400">{page.hoursDescription}</p>
              <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-white/5 text-zinc-200">
                    <tr>
                      <th className="px-4 py-3">{page.table.product}</th>
                      <th className="px-4 py-3">{page.table.contract}</th>
                      <th className="px-4 py-3">{page.table.summer}</th>
                      <th className="px-4 py-3">{page.table.winter}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {page.tradingHours.map((hour) => (
                      <tr
                        key={hour.code}
                        className="border-t border-white/10 text-zinc-300"
                      >
                        <td className="px-4 py-3">{hour.product}</td>
                        <td className="px-4 py-3 font-mono text-yellow-400">
                          {hour.code}
                        </td>
                        <td className="px-4 py-3">{hour.summer}</td>
                        <td className="px-4 py-3">{hour.winter}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <section className="rounded-3xl border border-white/10 bg-neutral-900/70 p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-white">
                {page.formulaTitle}
              </h2>
              <p className="mt-4 rounded-xl border border-yellow-500/25 bg-black/30 p-4 font-mono text-sm text-yellow-300">
                {page.formula}
              </p>
              <p className="mt-4 text-sm leading-7 text-zinc-300">
                {page.formulaDescription}
              </p>
            </section>
            {page.sections.map((section) => (
              <section
                key={section.title}
                className="border-b border-white/10 pb-10 last:border-none"
              >
                <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                <ul className="mt-5 space-y-3 text-sm leading-7 text-zinc-300 sm:text-base">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-3 size-1.5 shrink-0 rounded-full bg-yellow-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
            <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm leading-6 text-zinc-400">
              {page.source}
            </p>
          </div>
        </SectionContainer>
      </div>
    </main>
  );
}
