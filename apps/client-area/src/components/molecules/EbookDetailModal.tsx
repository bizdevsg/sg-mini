"use client";

import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

import { ResilientImage } from "@/components/atoms/ResilientImage";
import { htmlToPlainText, type EbookResource } from "@/lib/ebook.shared";

type EbookDetailModalProps = {
  closeLabel: string;
  ctaLabel: string;
  isOpen: boolean;
  item: EbookResource | null;
  onClose: () => void;
};

function CoverFallback() {
  return (
    <div className="relative z-10 flex flex-col items-center gap-3 text-yellow-400">
      <FontAwesomeIcon
        icon={["fas", "book-open"]}
        className="text-6xl drop-shadow-[0_4px_12px_rgba(250,204,21,0.3)]"
      />
      <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
        No Cover
      </span>
    </div>
  );
}

export function EbookDetailModal({
  closeLabel,
  ctaLabel,
  isOpen,
  item,
  onClose,
}: EbookDetailModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const paragraphs = htmlToPlainText(
    item.description || item.excerpt || item.title,
  )
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/80 p-0 backdrop-blur-md sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ebook-detail-title"
        className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-[#101010] shadow-[0_30px_80px_rgba(0,0,0,0.6)] sm:rounded-3xl md:flex-row"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="absolute right-4 top-4 z-30 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-black/50 text-zinc-300 backdrop-blur-sm transition hover:border-yellow-500/60 hover:text-yellow-400"
        >
          <FontAwesomeIcon icon={["fas", "xmark"]} className="text-base" />
        </button>

        {/* Cover: blurred copy of the image as backdrop, sharp cover on top */}
        <div className="relative flex shrink-0 items-center justify-center overflow-hidden bg-zinc-900 px-6 py-8 md:w-[38%] md:py-10">
          {item.imageSrc ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.imageSrc}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full scale-125 object-cover opacity-40 blur-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#101010]/80 md:bg-gradient-to-r md:to-[#101010]/60" />
              <div className="relative z-10 aspect-[3/4] w-40 overflow-hidden rounded-xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.55)] sm:w-48 md:w-full md:max-w-[240px]">
                <ResilientImage
                  src={item.imageSrc}
                  alt={item.title}
                  loading="eager"
                  className="h-full w-full object-cover"
                  fallback={
                    <div className="flex h-full w-full items-center justify-center bg-zinc-900">
                      <CoverFallback />
                    </div>
                  }
                />
              </div>
            </>
          ) : (
            <CoverFallback />
          )}
        </div>

        {/* Content */}
        <div className="flex min-h-0 flex-1 flex-col p-6 sm:p-8">
          <div className="flex flex-wrap gap-2 pr-10">
            <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-yellow-400">
              {item.categoryName}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-300">
              PDF
            </span>
          </div>

          <h3
            id="ebook-detail-title"
            className="mt-4 text-xl font-bold leading-snug tracking-tight text-white sm:text-2xl"
          >
            {item.title}
          </h3>

          <div className="mt-2 h-px w-12 bg-yellow-500/70" />

          <div className="mt-5 min-h-0 flex-1 space-y-3 overflow-y-auto pr-2 text-sm leading-7 text-zinc-300/90 md:max-h-[320px]">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-xl border border-white/15 px-5 text-sm font-semibold text-zinc-200 transition hover:border-white/30 hover:bg-white/5 sm:w-auto"
            >
              {closeLabel}
            </button>
            {item.fileUrl ? (
              <Link
                href={item.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-b from-[#FF9600] to-[#FFDE00] px-5 text-sm font-bold text-zinc-950 shadow-[0_4px_20px_rgba(245,158,11,0.2)] transition hover:brightness-105"
              >
                <FontAwesomeIcon
                  icon={["fas", "arrow-up-right-from-square"]}
                  className="text-xs"
                />
                <span>{ctaLabel}</span>
              </Link>
            ) : (
              <div className="inline-flex min-h-[44px] flex-1 cursor-not-allowed items-center justify-center rounded-xl bg-zinc-800 px-5 text-sm font-semibold text-zinc-500">
                {ctaLabel}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
