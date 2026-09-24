"use client";

import { useMemo, type ReactNode } from "react";

import { SectionContainer } from "@/components/atoms/SectionContainer";
import { ClientAreaHeaderTicker } from "@/components/molecules/ClientAreaHeaderTicker";
import { getDashboardCopy } from "@/components/organisms/client-area.shared";
import type {
  BreakingNewsItem,
  TabId,
} from "@/components/organisms/client-area.types";
import { getMessages } from "@/locales";
import type { AppLocale } from "@/locales";

type ClientAreaShellProps = {
  activeTab: TabId;
  breakingNews?: BreakingNewsItem[];
  children: ReactNode;
  locale: AppLocale;
  modal?: ReactNode;
};

export function ClientAreaShell({
  activeTab,
  breakingNews,
  children,
  locale,
  modal,
}: ClientAreaShellProps) {
  const messages = useMemo(() => getMessages(locale), [locale]);
  const copy = useMemo(() => getDashboardCopy(locale), [locale]);
  const resolvedBreakingNews = useMemo(
    () =>
      breakingNews && breakingNews.length > 0
        ? breakingNews
        : copy.breakingNews,
    [breakingNews, copy.breakingNews],
  );

  return (
    <section
      data-active-tab={activeTab}
      className="relative min-h-[calc(100vh-5rem)] overflow-x-clip bg-cover bg-top bg-no-repeat bg-fixed py-5 sm:py-7 lg:py-8"
      style={{
        backgroundImage: "url('/assets/BCG.png')",
      }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" />

      <SectionContainer className="relative">
        <section className="space-y-4 sm:space-y-5">
          <ClientAreaHeaderTicker
            breakingLabel={copy.breakingLabel}
            breakingNews={resolvedBreakingNews}
          />

          <div className="w-full min-w-0">{children}</div>

          {modal}
        </section>
      </SectionContainer>
    </section>
  );
}
