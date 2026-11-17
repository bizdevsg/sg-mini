import { EbookCategoryCard } from "@/components/molecules/EbookCategoryCard";
import {
  buildEbookCategoryCardDescription,
  formatEbookCount,
  getEbookEmptyState,
  type EbookCategory,
} from "@/lib/ebook.shared";
import type { AppLocale } from "@/locales";
import { getMessages } from "@/locales";
import { ClientAreaSectionHeader } from "../molecules/ClientAreaSectionHeader";

type ClientAreaEbookPanelProps = {
  categories: EbookCategory[];
  locale: AppLocale;
};

export function ClientAreaEbookPanel({
  categories,
  locale,
}: ClientAreaEbookPanelProps) {
  const messages = getMessages(locale).ebookPage;
  const emptyState = getEbookEmptyState(locale);

  return (
    <div className="space-y-6">
      <ClientAreaSectionHeader title={messages.libraryTitle} titleClassname="text-lg sm:text-xl" />


      {categories.length ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <EbookCategoryCard
              key={category.slug}
              countLabel={formatEbookCount(category.ebooksCount, locale)}
              ctaLabel={messages.detailCta}
              description={buildEbookCategoryCardDescription(
                category.name,
                category.ebooksCount,
                locale,
              )}
              href={`/${locale}/client-area/ebook/${category.slug}`}
              title={category.name}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[24px] border border-white/8 bg-black/25 px-5 py-10 text-center">
          <h4 className="text-lg font-bold text-white">{emptyState.title}</h4>
          <p className="mt-3 text-sm leading-7 text-zinc-400">
            {emptyState.body}
          </p>
        </div>
      )}
    </div>
  );
}
