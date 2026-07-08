"use client";

import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ButtonLink } from "@/components/atoms/ButtonLink";
import type { EbookResource } from "@/lib/ebook.shared";
import Image from "next/image";
import Link from "next/link";

type EbookDetailModalProps = {
  closeLabel: string;
  ctaLabel: string;
  isOpen: boolean;
  item: EbookResource | null;
  onClose: () => void;
};

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

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-zinc-950/80 p-4 backdrop-blur-xl transition-all duration-300"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ebook-detail-title"
        className="relative flex h-[max-content] max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl transition-all lg:h-[540px]"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Tombol Close Pojok Atas */}
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="absolute right-4 top-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border cursor-pointer border-zinc-800 bg-zinc-900/60 text-zinc-400 backdrop-blur-sm transition hover:border-zinc-700 hover:text-white"
        >
          <FontAwesomeIcon icon={["fas", "xmark"]} className="text-base" />
        </button>

        <div className="grid w-full grid-cols-1 overflow-y-auto lg:grid-cols-[40%_60%] lg:overflow-hidden">
          {/* Area Cover Ebook */}
          <div className="relative flex min-h-[280px] items-center justify-center bg-gradient-to-b from-zinc-800 to-zinc-900 p-6 lg:h-full lg:min-h-full">
            {item.imageSrc ? (
              <Image
                src={item.imageSrc}
                alt={item.title}
                fill
                sizes="1080"
                className="object-cover"
              />
            ) : (
              <div className="z-10 flex flex-col items-center gap-3 text-amber-400">
                <FontAwesomeIcon icon={["fas", "book-open"]} className="text-6xl drop-shadow-[0_4px_12px_rgba(251,191,36,0.3)]" />
                <span className="text-xs font-medium tracking-wider text-zinc-500 uppercase">No Cover</span>
              </div>
            )}
          </div>

          {/* Area Konten Teks */}
          <div className="flex flex-col p-6 sm:p-8 lg:h-full">
            {/* Tag / Badge */}
            <div className="flex flex-wrap gap-2">
              <span className="rounded-md bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-400 border border-amber-500/20">
                {item.categoryName}
              </span>
              <span className="rounded-md bg-zinc-800 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-300 border border-zinc-700">
                PDF Resource
              </span>
            </div>

            {/* Judul */}
            <h3
              id="ebook-detail-title"
              className="mt-4 text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl line-clamp-2"
            >
              {item.title}
            </h3>

            {/* Deskripsi (Scrollable secara internal di desktop) */}
            <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-400">
                {item.description || item.excerpt || item.title}
              </p>
            </div>

            {/* Area CTA / Action Buttons */}
            <div className="mt-6 flex flex-col-reverse w-full gap-3 border-t border-zinc-800 pt-5">
              {item.fileUrl ? (
                <Link
                  href={item.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full min-h-[44px] items-center justify-between gap-2 rounded-xl bg-linear-to-b from-[#FF9600] to-[#FFDE00] px-4 text-sm font-bold text-zinc-950 transition hover:from-yellow-600 hover:to-yellow-500 shadow-[0_4px_20px_rgba(245,158,11,0.15)]"
                >
                  <FontAwesomeIcon icon={["fas", "arrow-up-right-from-square"]} className="text-xs" />
                  <span>{ctaLabel}</span>
                </Link>
              ) : (
                <div className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-zinc-800 px-4 text-sm font-semibold text-zinc-500 cursor-not-allowed">
                  {ctaLabel}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}