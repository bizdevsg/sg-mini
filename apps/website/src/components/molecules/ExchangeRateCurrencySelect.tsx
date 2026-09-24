"use client";

import { useEffect, useRef, useState } from "react";

import type {
  ExchangeRateCurrency,
  ExchangeRateCurrencyOption,
} from "@/lib/exchange-rates";

type ExchangeRateCurrencySelectProps = {
  label: string;
  value: ExchangeRateCurrency;
  options: ExchangeRateCurrencyOption[];
  searchPlaceholder: string;
  emptyLabel: string;
  onChange: (value: ExchangeRateCurrency) => void;
};

export function ExchangeRateCurrencySelect({
  label,
  value,
  options,
  searchPlaceholder,
  emptyLabel,
  onChange,
}: ExchangeRateCurrencySelectProps) {
  const scrollAreaClassName = [
    "max-h-64 overflow-y-auto py-2",
    "[scrollbar-color:rgba(234,179,8,0.55)_rgba(255,255,255,0.08)] [scrollbar-width:thin]",
    "[&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2",
    "[&::-webkit-scrollbar-track]:bg-white/[0.08]",
    "[&::-webkit-scrollbar-track]:rounded-full",
    "[&::-webkit-scrollbar-thumb]:rounded-full",
    "[&::-webkit-scrollbar-thumb]:bg-yellow-500/55",
  ].join(" ");

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const selectedOption =
    options.find((option) => option.code === value) ?? options[0] ?? null;
  const normalizedQuery = query.trim().toLowerCase();
  const filteredOptions = options.filter((option) => {
    if (!normalizedQuery) {
      return true;
    }

    const searchTarget = `${option.code} ${option.label}`.toLowerCase();

    return searchTarget.includes(normalizedQuery);
  });

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      return;
    }

    searchInputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        className="flex h-11 w-full items-center justify-between gap-3 rounded-lg border border-line bg-black/20 px-4 text-left text-sm text-foreground outline-none transition focus:border-yellow-500/70"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={label}
      >
        <span className="min-w-0 truncate">
          {selectedOption
            ? `${selectedOption.code} - ${selectedOption.label}`
            : value}
        </span>
        <svg
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          className={
            isOpen
              ? "rotate-180 transition-transform duration-200"
              : "transition-transform duration-200"
          }
        >
          <path
            d="M1.5 1.5L6 6L10.5 1.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen ? (
        <div className="absolute left-0 top-[calc(100%+0.5rem)] z-30 w-full rounded-xl border border-line bg-neutral-950 shadow-[0_18px_40px_rgba(0,0,0,0.38)]">
          <div className="border-b border-white/8 p-3">
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={searchPlaceholder}
              className="h-10 w-full rounded-lg border border-line bg-black/30 px-3 text-sm text-foreground outline-none transition placeholder:text-foreground/35 focus:border-yellow-500/70"
            />
          </div>

          <div
            className={scrollAreaClassName}
            role="listbox"
            aria-label={label}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = option.code === value;

                return (
                  <button
                    key={option.code}
                    type="button"
                    onClick={() => {
                      onChange(option.code);
                      setIsOpen(false);
                    }}
                    className={
                      isSelected
                        ? "flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm text-yellow-400"
                        : "flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm text-foreground/82 transition hover:bg-white/5"
                    }
                    role="option"
                    aria-selected={isSelected}
                  >
                    <span className="min-w-0 truncate">
                      {option.code} - {option.label}
                    </span>
                    {isSelected ? (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-500/80" />
                    ) : null}
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-4 text-sm text-foreground/45">
                {emptyLabel}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
