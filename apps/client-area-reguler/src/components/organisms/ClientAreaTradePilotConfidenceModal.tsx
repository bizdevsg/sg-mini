"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

import { formatTradePilotDateTime } from "@/lib/trade-pilot/trade-pilot-format";
import type { ClientAreaTradePilotAnalysisResultCopy } from "@/lib/client-area-trade-pilot.shared";
import type { TradePilotConfidence } from "@/lib/trade-pilot/trade-pilot.types";

type Props = {
  analyzedAt: string;
  brand: string;
  confidence: TradePilotConfidence | null | undefined;
  copy: ClientAreaTradePilotAnalysisResultCopy;
  instrumentLabel: string;
  locale: "id" | "en";
  onClose: () => void;
  open: boolean;
  timeframeLabel: string;
};

/** "• Dasar: …\n• Batasan: …" -> baris terpisah tanpa simbol bullet ganda. */
function reasonLines(reason: string) {
  return reason
    .split(/\n+|(?=\s•\s)/)
    .map((line) => line.replace(/^\s*•\s*/, "").trim())
    .filter(Boolean);
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h3 className="text-sm font-bold text-amber-400">{title}</h3>
      <div className="mt-2 text-sm leading-6 text-zinc-300 sm:text-base sm:leading-7">{children}</div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span aria-hidden className="text-zinc-500">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Modal "Kenapa keyakinan tidak lebih tinggi?" — alasan lengkap dari output AI:
 * dasar & batasan, bukti teknikal, konteks berita/kalender, risiko utama,
 * syarat invalidasi, dan sumber yang dirujuk.
 */
export function ClientAreaTradePilotConfidenceModal({
  analyzedAt,
  brand,
  confidence,
  copy,
  instrumentLabel,
  locale,
  onClose,
  open,
  timeframeLabel,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const modalCopy = copy.confidenceModal;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const sources = [
    ...(confidence?.sources.news ?? []),
    ...(confidence?.sources.calendar ?? []).map((event) =>
      event.date ? `${event.name} · ${event.date}` : event.name,
    ),
  ];
  const hasDetail = Boolean(
    confidence &&
      (confidence.reason ||
        confidence.technical ||
        confidence.fundamental ||
        confidence.risk ||
        confidence.invalidation.length ||
        sources.length),
  );

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="trade-pilot-confidence-title"
      onClose={onClose}
      onClick={(event) => {
        // Klik di backdrop menutup modal.
        if (event.target === event.currentTarget) onClose();
      }}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-3xl overflow-hidden rounded-2xl border border-zinc-800 bg-[#111214] p-0 text-left text-zinc-100 shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      <div className="h-1.5 w-full bg-amber-500" />
      <div className="max-h-[calc(100dvh-2.5rem)] overflow-y-auto px-5 pb-6 pt-6 sm:px-10 sm:pb-8 sm:pt-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-bold uppercase tracking-wide text-amber-400">{brand}</p>
            <h2 id="trade-pilot-confidence-title" className="mt-3 text-xl font-bold text-white sm:text-2xl">
              {copy.confidenceReasonTitle}
            </h2>
            <p className="mt-2 text-sm text-zinc-400 sm:text-base">
              {instrumentLabel} · {timeframeLabel} · {formatTradePilotDateTime(analyzedAt, locale)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={modalCopy.closeLabel}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-700 text-zinc-400 transition hover:border-amber-500/60 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {hasDetail && confidence ? (
          <>
            {confidence.reason ? (
              <div className="mt-5 rounded-md bg-zinc-800/70 px-5 py-4 text-sm leading-6 text-zinc-200 sm:text-base sm:leading-7">
                {reasonLines(confidence.reason).map((line) => (
                  <p key={line}>• {line}</p>
                ))}
              </div>
            ) : null}
            {confidence.technical ? (
              <Section title={modalCopy.technicalTitle}>
                <p>{confidence.technical}</p>
              </Section>
            ) : null}
            {confidence.fundamental ? (
              <Section title={modalCopy.contextTitle}>
                <p>{confidence.fundamental}</p>
              </Section>
            ) : null}
            {confidence.risk ? (
              <Section title={modalCopy.riskTitle}>
                <p>{confidence.risk}</p>
              </Section>
            ) : null}
            {confidence.invalidation.length ? (
              <Section title={modalCopy.invalidationTitle}>
                <Bullets items={confidence.invalidation} />
              </Section>
            ) : null}
            {sources.length ? (
              <Section title={modalCopy.sourcesTitle}>
                <Bullets items={sources} />
              </Section>
            ) : null}
          </>
        ) : (
          <p className="mt-6 rounded-md bg-zinc-800/70 px-5 py-4 text-sm leading-6 text-zinc-300">
            {copy.confidenceReasonDescription}
            <span className="mt-2 block text-xs text-zinc-500">{modalCopy.empty}</span>
          </p>
        )}

        <p className="mt-8 border-t border-zinc-800 pt-4 text-xs text-zinc-500 sm:text-sm">{modalCopy.footer}</p>
      </div>
    </dialog>
  );
}
