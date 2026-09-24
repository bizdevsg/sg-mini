import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { EbookResourceLibrary } from "@/components/organisms/EbookResourceLibrary";
import {
  getEbookEmptyState,
  type EbookCategoryDetail,
} from "@/lib/ebook.shared";
import type { AppLocale } from "@/locales";
import { getMessages } from "@/locales";

type ClientAreaEbookCategoryDetailPanelProps = {
  categoryDetail: EbookCategoryDetail;
  locale: AppLocale;
};

export function ClientAreaEbookCategoryDetailPanel({
  categoryDetail,
  locale,
}: ClientAreaEbookCategoryDetailPanelProps) {
  const messages = getMessages(locale).ebookPage;
  const emptyState = getEbookEmptyState(locale);

  return (
    <div className="space-y-6">
      <section className="space-y-5">
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/client-area/ebook`}
            className="rounded-lg border border-yellow-500 p-1 hover:bg-zinc-500/10"
          >
            <FontAwesomeIcon icon={["fas", "xmark"]} />
          </Link>
          <h3 className="text-xl font-black text-white sm:text-2xl">
            {categoryDetail.category.name}
          </h3>
        </div>

        {categoryDetail.items.length ? (
          <EbookResourceLibrary
            closeLabel={messages.closeCta}
            downloadCtaLabel={messages.downloadCta}
            items={categoryDetail.items}
            previewCtaLabel={messages.previewCta}
          />
        ) : (
          <div className="rounded-[24px] border border-white/8 bg-black/25 px-5 py-10 text-center">
            <h4 className="text-lg font-bold text-white">{emptyState.title}</h4>
            <p className="mt-3 text-sm leading-7 text-zinc-400">
              {emptyState.body}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
