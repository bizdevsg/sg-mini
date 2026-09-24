"use client";

import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useClientAreaAccountMode } from "@/components/providers/ClientAreaAccountModeProvider";
import {
  getClientAreaAccountModeData,
  getDashboardCopy,
  resolveLocalizedHref,
} from "@/components/organisms/client-area.shared";
import { getMessages, type AppLocale } from "@/locales";

type ClientAreaApprovalDocumentsPanelProps = {
  locale: AppLocale;
};

export function ClientAreaApprovalDocumentsPanel({
  locale,
}: ClientAreaApprovalDocumentsPanelProps) {
  const { clientArea } = getMessages(locale);
  const { accountMode } = useClientAreaAccountMode();
  const { currentAccount } = getClientAreaAccountModeData(
    getDashboardCopy(locale),
    accountMode,
  );
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  async function downloadDocument(
    document: (typeof clientArea.approvalDocumentPage.documents)[number],
  ) {
    setDownloadingId(document.id);

    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ format: "a4", unit: "mm" });
      const copy = clientArea.approvalDocumentPage;
      const generatedAt = new Intl.DateTimeFormat(
        locale === "id" ? "id-ID" : "en-US",
        { dateStyle: "long", timeStyle: "short" },
      ).format(new Date());

      pdf.setFillColor(18, 18, 18);
      pdf.rect(0, 0, 210, 34, "F");
      pdf.setTextColor(250, 204, 21);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.text("PT SOLID GOLD BERJANGKA", 18, 15);
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(18);
      pdf.text(document.code, 18, 25);

      pdf.setTextColor(24, 24, 27);
      pdf.setFontSize(15);
      const titleLines = pdf.splitTextToSize(document.title, 174);
      pdf.text(titleLines, 18, 50);

      const detailsY = 50 + titleLines.length * 7 + 9;
      pdf.setDrawColor(220, 220, 220);
      pdf.line(18, detailsY, 192, detailsY);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(82, 82, 91);
      pdf.text(`${copy.accountHolderLabel}:`, 18, detailsY + 12);
      pdf.text(`${copy.accountNumberLabel}:`, 18, detailsY + 20);
      pdf.text(`${copy.generatedAtLabel}:`, 18, detailsY + 28);
      pdf.setTextColor(24, 24, 27);
      pdf.text(currentAccount.accountOwner, 66, detailsY + 12);
      pdf.text(currentAccount.accountId, 66, detailsY + 20);
      pdf.text(generatedAt, 66, detailsY + 28);

      pdf.setFillColor(250, 250, 250);
      pdf.roundedRect(18, detailsY + 42, 174, 28, 3, 3, "F");
      pdf.setTextColor(82, 82, 91);
      const noticeLines = pdf.splitTextToSize(copy.pdfNotice, 158);
      pdf.text(noticeLines, 26, detailsY + 54);

      pdf.save(`${document.code.replaceAll(" ", "-")}.pdf`);
    } finally {
      setDownloadingId(null);
    }
  }

  const copy = clientArea.approvalDocumentPage;

  return (
    <section aria-labelledby="approval-documents-title">
      <Link
        href={resolveLocalizedHref(locale, "/client-area/account")}
        className="mb-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm font-semibold text-zinc-300 transition hover:border-yellow-500/30 hover:text-yellow-400"
      >
        <FontAwesomeIcon icon={["fas", "chevron-left"]} className="text-xs" />
        {clientArea.accountPage.backLabel}
      </Link>

      <div className="mb-5">
        <h2 id="approval-documents-title" className="text-xl font-bold text-white sm:text-2xl">
          {copy.title}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-500">
          {copy.description}
        </p>
      </div>

      <div className="space-y-4">
        {copy.documents.map((document) => {
          const isDownloading = downloadingId === document.id;

          return (
            <article
              key={document.id}
              className="flex flex-col gap-4 rounded-2xl border border-white/15 bg-[#202125] px-5 py-4 shadow-sm shadow-black/20 transition-colors hover:border-white/25 sm:flex-row sm:items-center sm:justify-between sm:px-6"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-zinc-400">
                  {document.code}
                </p>
                <h3 className="mt-1 text-base font-medium leading-relaxed text-zinc-100 sm:text-lg">
                  {document.title}
                </h3>
              </div>

              <button
                type="button"
                disabled={isDownloading}
                onClick={() => downloadDocument(document)}
                className="inline-flex shrink-0 items-center gap-2.5 self-start rounded-xl px-2 py-2 text-sm font-semibold text-yellow-400 transition hover:bg-yellow-500/10 hover:text-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 disabled:cursor-wait disabled:opacity-60 sm:self-auto sm:text-base"
                aria-label={`${copy.downloadLabel} ${document.title}`}
              >
                <FontAwesomeIcon
                  icon={["fas", isDownloading ? "spinner" : "file-arrow-down"]}
                  className={isDownloading ? "animate-spin" : ""}
                />
                {isDownloading ? copy.preparingLabel : copy.downloadLabel}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
