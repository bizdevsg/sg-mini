"use client";

import { useMemo, useRef, useState } from "react";
import { Plus, Search, Star } from "lucide-react";

import { LiveQuoteInstrumentIcon } from "@/components/atoms/LiveQuoteInstrumentIcon";
import type { LiveQuotePayload } from "@/lib/live-quotes";
import {
  findClientAreaTradePilotTick,
  type ClientAreaTradePilotCopy,
  type ClientAreaTradePilotInstrument,
} from "@/lib/client-area-trade-pilot.shared";

type ClientAreaTradePilotInstrumentPickerProps = {
  copy: ClientAreaTradePilotCopy;
  instruments: ClientAreaTradePilotInstrument[];
  onSelect: (instrumentId: ClientAreaTradePilotInstrument["id"]) => void;
  quotes: LiveQuotePayload;
  selectedInstrumentId: ClientAreaTradePilotInstrument["id"];
};

export function ClientAreaTradePilotInstrumentPicker({
  copy,
  instruments,
  onSelect,
  quotes,
  selectedInstrumentId,
}: ClientAreaTradePilotInstrumentPickerProps) {
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const visibleInstruments = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return instruments;

    return instruments.filter((instrument) =>
      `${instrument.label} ${copy.instrumentNames[instrument.nameKey]}`
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [copy.instrumentNames, instruments, query]);

  return (
    <section className="min-w-0 rounded-2xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-sm p-4 sm:rounded-3xl sm:p-5">
      <h2 className="text-base font-bold text-white">
        {copy.instrumentPickerTitle}
      </h2>

      <label className="mt-5 flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-sm px-4 py-3 text-zinc-500 focus-within:border-yellow-500/60">
        <Search className="h-5 w-5 shrink-0" aria-hidden="true" />
        <span className="sr-only">{copy.searchPlaceholder}</span>
        <input
          ref={searchInputRef}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={copy.searchPlaceholder}
          className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
        />
      </label>

      <div className="mt-5 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wide text-zinc-500">
          {copy.favoritesLabel}
        </span>
        <button
          type="button"
          aria-label={copy.addFavoriteLabel}
          onClick={() => searchInputRef.current?.focus()}
          className="rounded-lg p-1 text-zinc-500 transition hover:bg-zinc-800 hover:text-yellow-400"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-3 space-y-2">
        {visibleInstruments.map((instrument) => {
          const active = instrument.id === selectedInstrumentId;
          const { symbol } = findClientAreaTradePilotTick(quotes, instrument);

          return (
            <button
              key={instrument.id}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(instrument.id)}
              className={`flex w-full items-center gap-3 rounded-xl border px-2 py-2 text-left transition ${active
                ? "trade-pilot-instrument-active border-yellow-500/50 bg-yellow-500/10"
                : "border-transparent hover:border-zinc-700 hover:bg-zinc-800/60"
                }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <LiveQuoteInstrumentIcon symbol={symbol} className="h-3 w-3" />

                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-white">
                      {instrument.label}
                    </span>
                    <span className="block truncate text-xs text-zinc-500">
                      {copy.instrumentNames[instrument.nameKey]}
                    </span>
                  </span>
                </div>

                <Star
                  className={`h-4 w-4 ${active ? "trade-pilot-instrument-star fill-yellow-400 text-yellow-400" : "text-zinc-600"}`}
                />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
