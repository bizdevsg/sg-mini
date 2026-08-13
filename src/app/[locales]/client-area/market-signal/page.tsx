import type { Metadata } from "next";
import { History } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";

import { ClientAreaBackLink } from "@/components/molecules/ClientAreaBackLink";
import { ClientAreaMarketSignalHistoryList } from "@/components/molecules/ClientAreaMarketSignalHistoryList";
import { ClientAreaShell } from "@/components/organisms/ClientAreaShell";
import { requireClientAreaSession } from "@/lib/client-area-auth";
import { getClientAreaBreakingNews } from "@/lib/client-area-news";
import {
  assertValidLocale,
  buildClientAreaSubpageMetadata,
  generateClientAreaStaticParams,
  type ClientAreaSubpageProps,
} from "@/app/[locales]/client-area/client-area-page.shared";
import { getMarketSignalFeed } from "@/lib/market-signal";
import { getMessages } from "@/locales";

const HISTORY_SIGNAL_PAGE_SIZE = 8;

type ClientAreaMarketSignalPageProps = ClientAreaSubpageProps & {
  searchParams?: Promise<{ page?: string | string[] }>;
};

function parseCurrentPage(pageValue: string | string[] | undefined) {
  const rawValue = Array.isArray(pageValue) ? pageValue[0] : pageValue;
  const parsedPage = Number.parseInt(rawValue ?? "1", 10);

  if (!Number.isFinite(parsedPage) || parsedPage < 1) {
    return 1;
  }

  return parsedPage;
}

function buildPaginationHref(locale: string, page: number) {
  const basePath = `/${locale}/client-area/market-signal`;

  if (page <= 1) {
    return basePath;
  }

  return `${basePath}?page=${page}`;
}

export function generateStaticParams() {
  return generateClientAreaStaticParams();
}

export async function generateMetadata({
  params,
}: ClientAreaSubpageProps): Promise<Metadata> {
  const { locales } = await params;
  assertValidLocale(locales);

  return buildClientAreaSubpageMetadata(locales, "market-signal");
}

export default async function ClientAreaMarketSignalPage({
  params,
  searchParams,
}: ClientAreaMarketSignalPageProps) {
  const { locales } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  assertValidLocale(locales);
  await requireClientAreaSession(locales);

  const [marketSignalFeed, breakingNews] = await Promise.all([
    getMarketSignalFeed(),
    getClientAreaBreakingNews(locales),
  ]);

  if (marketSignalFeed.items.length === 0) {
    notFound();
  }

  const messages = getMessages(locales);
  const detailCopy = messages.clientArea.marketSignalDetail;
  const currentPage = parseCurrentPage(resolvedSearchParams?.page);
  const totalPages = Math.max(
    1,
    Math.ceil(marketSignalFeed.items.length / HISTORY_SIGNAL_PAGE_SIZE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageStartIndex = (safeCurrentPage - 1) * HISTORY_SIGNAL_PAGE_SIZE;
  const visibleItems = marketSignalFeed.items.slice(
    pageStartIndex,
    pageStartIndex + HISTORY_SIGNAL_PAGE_SIZE,
  );
  const paginationSummary =
    locales === "id"
      ? `Halaman ${safeCurrentPage} dari ${totalPages}`
      : `Page ${safeCurrentPage} of ${totalPages}`;
  const previousLabel = locales === "id" ? "Sebelumnya" : "Previous";
  const nextLabel = locales === "id" ? "Berikutnya" : "Next";

  return (
    <ClientAreaShell activeTab="home" breakingNews={breakingNews} locale={locales}>
      <ClientAreaBackLink
        href={`/${locales}/client-area`}
        label={messages.app.homeLabel}
        className="mb-5"
      />

      <div className="space-y-6">
        <div className="space-y-4 rounded-3xl border border-white/10 bg-zinc-900/50 p-5 backdrop-blur-md sm:p-8">
          <div className="flex items-start gap-2 sm:items-center">
            <History className="h-5 w-5 text-yellow-500" />
            <p className="text-lg font-semibold text-white sm:text-xl">
              {detailCopy.historyTitle}
            </p>
          </div>

          <ClientAreaMarketSignalHistoryList
            items={visibleItems}
            locale={locales}
          />

          {totalPages > 1 ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-white/10 bg-white/[0.03] px-4 py-4">
              <p className="text-sm text-zinc-300">{paginationSummary}</p>

              <div className="flex items-center gap-2">
                <Link
                  href={buildPaginationHref(locales, safeCurrentPage - 1)}
                  aria-disabled={safeCurrentPage === 1}
                  className={`rounded-lg border px-3 py-2 text-sm transition ${
                    safeCurrentPage === 1
                      ? "pointer-events-none border-white/8 text-zinc-600"
                      : "border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                  }`}
                >
                  {previousLabel}
                </Link>

                <Link
                  href={buildPaginationHref(locales, safeCurrentPage + 1)}
                  aria-disabled={safeCurrentPage === totalPages}
                  className={`rounded-lg border px-3 py-2 text-sm transition ${
                    safeCurrentPage === totalPages
                      ? "pointer-events-none border-white/8 text-zinc-600"
                      : "border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                  }`}
                >
                  {nextLabel}
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </ClientAreaShell>
  );
}
