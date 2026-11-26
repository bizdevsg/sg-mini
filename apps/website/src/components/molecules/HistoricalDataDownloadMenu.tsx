"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useId, useRef, useState } from "react";

type HistoricalDataDownloadOption = {
  format: "csv" | "pdf";
  label: string;
  description: string;
  href: string;
};

type HistoricalDataDownloadMenuProps = {
  label: string;
  options: HistoricalDataDownloadOption[];
};

const OPTION_ICONS = {
  csv: "file-excel",
  pdf: "file-pdf",
} as const;

export function HistoricalDataDownloadMenu({
  label,
  options,
}: HistoricalDataDownloadMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div className="relative ml-auto" ref={containerRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        className="inline-flex items-center gap-2 rounded-full border border-yellow-500/60 bg-yellow-500/10 px-4 py-1.5 text-sm font-medium text-yellow-500 transition hover:bg-yellow-500/20"
        aria-expanded={isOpen}
        aria-controls={menuId}
      >
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={["fas", "download"]} className="text-xs" />

            {label}
          </div>

          <FontAwesomeIcon
            icon={["fas", "chevron-down"]}
            className={`text-[10px] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {isOpen ? (
        <ul
          id={menuId}
          className="absolute right-0 top-[calc(100%+0.5rem)] z-30 w-64 divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10 bg-zinc-800 shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
        >
          {options.map((option) => (
            <li key={option.format}>
              <a
                href={option.href}
                onClick={() => setIsOpen(false)}
                className="group flex items-start gap-3 px-4 py-3 transition hover:bg-white/5"
              >
                <FontAwesomeIcon
                  icon={["far", OPTION_ICONS[option.format]]}
                  className="mt-0.5 h-4 w-4 shrink-0 text-zinc-300 transition group-hover:text-yellow-400"
                />
                <span className="flex min-w-0 flex-col">
                  <span className="text-sm text-zinc-100 transition group-hover:text-yellow-400">
                    {option.label}
                  </span>
                  <span className="text-xs text-zinc-400">
                    {option.description}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
