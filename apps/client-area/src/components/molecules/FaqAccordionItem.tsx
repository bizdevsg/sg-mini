"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useId, useRef, useState } from "react";

type FaqAccordionItemProps = {
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  question: string;
  sectionTitle: string;
};

export function FaqAccordionItem({
  answer,
  isOpen,
  onToggle,
  question,
  sectionTitle,
}: FaqAccordionItemProps) {
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    const element = contentRef.current;

    if (!element) {
      return;
    }

    setContentHeight(element.scrollHeight);
  }, [answer, isOpen]);

  return (
    <div
      className={`rounded-3xl border bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(0,0,0,0.24))] px-5 py-4 transition-all duration-300 sm:px-6 sm:py-5 ${isOpen
        ? "border-yellow-500/25 shadow-[0_16px_40px_rgba(205,161,58,0.08)]"
        : "border-white/10"
        }`}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex w-full cursor-pointer items-start justify-between gap-4 text-left"
      >
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-yellow-500/80">
            {sectionTitle}
          </p>
          <h2 className="mt-2 text-base font-semibold leading-7 text-white sm:text-lg">
            {question}
          </h2>
        </div>

        <span
          className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-all duration-300 ${isOpen
            ? "border-yellow-500 bg-yellow-500 text-black"
            : "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
            }`}
        >
          <FontAwesomeIcon
            icon={["fas", "chevron-down"]}
            className={`text-[11px] transition-transform duration-300 ${isOpen ? "rotate-180" : ""
              }`}
          />
        </span>
      </button>

      <div
        id={panelId}
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{
          maxHeight: isOpen ? `${contentHeight}px` : "0px",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div
          ref={contentRef}
          className="pt-4"
        >
          <div className="border-t border-white/8 pt-4 leading-7 text-zinc-300">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
}
