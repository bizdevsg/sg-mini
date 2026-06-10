"use client";

import { useEffect, useRef, useState } from "react";

import { PUBLIC_LIVE_QUOTE_SOCKET_URL } from "@/lib/env";
import { LiveQuoteConnectionBadge } from "@/components/atoms/LiveQuoteConnectionBadge";
import { LiveQuoteTrendIndicator } from "@/components/atoms/LiveQuoteTrendIndicator";
import { getLiveQuoteDisplay, getSortedSymbols } from "@/lib/live-quotes";
import {
  formatLocaleNumber,
  formatLocaleTime,
  getMessages,
  type AppLocale,
} from "@/locales";

type QuoteDirection = "up" | "down" | "-";

type LiveQuoteTick = {
  price_change: QuoteDirection | string;
  price: string;
  sell: string;
  buy: string;
  oprice: string;
  hprice: string;
  lprice: string;
  time: string;
  date_time: string;
};

type LiveQuotePayload = Record<string, LiveQuoteTick>;
type ConnectionStatus = "connecting" | "live" | "reconnecting" | "error";

const RECONNECT_DELAY_MS = 3000;

function getDirectionClassName(direction: string) {
  if (direction === "up") {
    return "text-emerald-400";
  }

  if (direction === "down") {
    return "text-rose-400";
  }

  return "text-foreground/58";
}

function getRowClassName(direction: string) {
  if (direction === "up") {
    return "bg-emerald-400/10";
  }

  if (direction === "down") {
    return "bg-rose-400/10";
  }

  return "bg-white/5";
}

function LiveQuoteSymbol({
  symbol,
  className,
}: {
  symbol: string;
  className: string;
}) {
  const display = getLiveQuoteDisplay(symbol);

  return (
    <span className={className}>
      <span className="font-semibold text-sm md:text-base">
        {display.label}
      </span>
      {display.symbol ? (
        <span className="ml-1 font-medium text-foreground/62 text-xs">
          ({display.symbol})
        </span>
      ) : null}
    </span>
  );
}

type LiveQuoteTableProps = {
  locale: AppLocale;
  mode?: "compact" | "full";
};

export function LiveQuoteTable({
  locale,
  mode = "compact",
}: LiveQuoteTableProps) {
  const messages = getMessages(locale);
  const fieldLabels = messages.liveQuoteTable.fields;
  const [quotes, setQuotes] = useState<LiveQuotePayload>({});
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let isActive = true;

    const clearReconnectTimer = () => {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
    };

    const connect = () => {
      clearReconnectTimer();
      socketRef.current?.close();

      const socket = new WebSocket(PUBLIC_LIVE_QUOTE_SOCKET_URL);
      socketRef.current = socket;

      setStatus((currentStatus) =>
        currentStatus === "live" ? "reconnecting" : "connecting",
      );

      socket.onopen = () => {
        if (!isActive || socketRef.current !== socket) {
          socket.close();
          return;
        }

        setStatus("live");
      };

      socket.onmessage = (event) => {
        if (!isActive || socketRef.current !== socket) {
          return;
        }

        try {
          const payload = JSON.parse(event.data) as LiveQuotePayload;

          if (
            !payload ||
            typeof payload !== "object" ||
            Array.isArray(payload)
          ) {
            return;
          }

          setQuotes((currentQuotes) => ({
            ...currentQuotes,
            ...payload,
          }));

          const latestTick = Object.values(payload)
            .map((tick) => tick.date_time)
            .filter(Boolean)
            .sort()
            .at(-1);

          if (latestTick) {
            setLastUpdated(latestTick);
          }

          setStatus("live");
        } catch {
          setStatus("error");
        }
      };

      socket.onerror = () => {
        if (!isActive || socketRef.current !== socket) {
          return;
        }

        setStatus("error");
      };

      socket.onclose = () => {
        if (!isActive || socketRef.current !== socket) {
          return;
        }

        clearReconnectTimer();
        setStatus("reconnecting");
        reconnectTimerRef.current = setTimeout(() => {
          if (isActive) {
            connect();
          }
        }, RECONNECT_DELAY_MS);
      };
    };

    connect();

    return () => {
      isActive = false;

      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }

      socketRef.current?.close();
    };
  }, []);

  const symbols = getSortedSymbols(quotes);
  const compactPrimarySymbols = symbols.slice(0, 2);
  const compactSecondarySymbols = symbols.slice(2, 5);

  return (
    <>
      <div className="">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/75">
            {messages.liveQuoteTable.feedLabel}
          </div>
          <div className="flex flex-col items-start gap-3 sm:items-end">
            <LiveQuoteConnectionBadge locale={locale} status={status} />
          </div>
        </div>

        {symbols.length === 0 ? (
          <div className="py-8 text-sm text-foreground/58">
            {messages.liveQuoteTable.empty}
          </div>
        ) : mode === "full" ? (
          <div className="space-y-4">
            <div className="grid gap-4 md:hidden">
              {symbols.map((symbol) => {
                const tick = quotes[symbol];
                const directionClassName = getDirectionClassName(
                  tick.price_change,
                );
                const rowClassName = getRowClassName(tick.price_change);

                return (
                  <article
                    key={symbol}
                    className={`rounded-xl border border-line p-4 shadow-[0_16px_36px_rgba(0,0,0,0.24)] ${rowClassName}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <LiveQuoteTrendIndicator
                          direction={tick.price_change}
                          locale={locale}
                        />
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.18em] text-foreground/55">
                            {fieldLabels.symbol}
                          </p>
                          <p
                            className={`font-mono text-base font-bold ${directionClassName}`}
                          >
                            <LiveQuoteSymbol
                              symbol={symbol}
                              className="font-mono text-base font-bold"
                            />
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-foreground/55">
                          {fieldLabels.price}
                        </p>
                        <p
                          className={`font-mono text-base font-bold ${directionClassName}`}
                        >
                          {formatLocaleNumber(tick.price, locale)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-lg border border-line bg-black/20 px-3 py-3">
                        <p className="text-[11px] uppercase tracking-[0.14em] text-foreground/55">
                          {fieldLabels.sell}
                        </p>
                        <p className="mt-1 font-mono text-foreground/78">
                          {formatLocaleNumber(tick.sell, locale)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-line bg-black/20 px-3 py-3">
                        <p className="text-[11px] uppercase tracking-[0.14em] text-foreground/55">
                          {fieldLabels.buy}
                        </p>
                        <p className="mt-1 font-mono text-foreground/78">
                          {formatLocaleNumber(tick.buy, locale)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-line bg-black/20 px-3 py-3">
                        <p className="text-[11px] uppercase tracking-[0.14em] text-foreground/55">
                          {fieldLabels.open}
                        </p>
                        <p className="mt-1 font-mono text-foreground/78">
                          {formatLocaleNumber(tick.oprice, locale)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-line bg-black/20 px-3 py-3">
                        <p className="text-[11px] uppercase tracking-[0.14em] text-foreground/55">
                          {fieldLabels.high}
                        </p>
                        <p className="mt-1 font-mono text-foreground/78">
                          {formatLocaleNumber(tick.hprice, locale)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-line bg-black/20 px-3 py-3">
                        <p className="text-[11px] uppercase tracking-[0.14em] text-foreground/55">
                          {fieldLabels.low}
                        </p>
                        <p className="mt-1 font-mono text-foreground/78">
                          {formatLocaleNumber(tick.lprice, locale)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-line bg-black/20 px-3 py-3">
                        <p className="text-[11px] uppercase tracking-[0.14em] text-foreground/55">
                          {fieldLabels.time}
                        </p>
                        <p className="mt-1 text-foreground/72">
                          {formatLocaleTime(tick.time, tick.date_time, locale)}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="hidden overflow-hidden rounded-xl border border-line md:block">
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-white/5">
                      <th className="px-4 py-3 text-xs uppercase tracking-[0.14em] text-foreground/55">
                        {fieldLabels.symbol}
                      </th>
                      <th className="px-4 py-3 text-center text-xs uppercase tracking-[0.14em] text-foreground/55">
                        {fieldLabels.price}
                      </th>
                      <th className="px-4 py-3 text-center text-xs uppercase tracking-[0.14em] text-foreground/55">
                        {fieldLabels.sell}
                      </th>
                      <th className="px-4 py-3 text-center text-xs uppercase tracking-[0.14em] text-foreground/55">
                        {fieldLabels.buy}
                      </th>
                      <th className="px-4 py-3 text-center text-xs uppercase tracking-[0.14em] text-foreground/55">
                        {fieldLabels.open}
                      </th>
                      <th className="px-4 py-3 text-center text-xs uppercase tracking-[0.14em] text-foreground/55">
                        {fieldLabels.high}
                      </th>
                      <th className="px-4 py-3 text-center text-xs uppercase tracking-[0.14em] text-foreground/55">
                        {fieldLabels.low}
                      </th>
                      <th className="px-4 py-3 text-center text-xs uppercase tracking-[0.14em] text-foreground/55">
                        {fieldLabels.time}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {symbols.map((symbol) => {
                      const tick = quotes[symbol];
                      const directionClassName = getDirectionClassName(
                        tick.price_change,
                      );
                      const rowClassName = getRowClassName(tick.price_change);

                      return (
                        <tr
                          key={symbol}
                          className={`border-t border-line align-middle ${rowClassName}`}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <LiveQuoteTrendIndicator
                                direction={tick.price_change}
                                locale={locale}
                              />
                              <LiveQuoteSymbol
                                symbol={symbol}
                                className={`font-mono ${directionClassName}`}
                              />
                            </div>
                          </td>
                          <td
                            className={`px-4 py-3 text-center font-mono text-sm font-semibold sm:text-base ${directionClassName}`}
                          >
                            {formatLocaleNumber(tick.price, locale)}
                          </td>
                          <td className="px-4 py-3 text-center font-mono text-sm text-foreground/78">
                            {formatLocaleNumber(tick.sell, locale)}
                          </td>
                          <td className="px-4 py-3 text-center font-mono text-sm text-foreground/78">
                            {formatLocaleNumber(tick.buy, locale)}
                          </td>
                          <td className="px-4 py-3 text-center font-mono text-sm text-foreground/78">
                            {formatLocaleNumber(tick.oprice, locale)}
                          </td>
                          <td className="px-4 py-3 text-center font-mono text-sm text-foreground/78">
                            {formatLocaleNumber(tick.hprice, locale)}
                          </td>
                          <td className="px-4 py-3 text-center font-mono text-sm text-foreground/78">
                            {formatLocaleNumber(tick.lprice, locale)}
                          </td>
                          <td className="px-4 py-3 text-center text-sm text-foreground/72">
                            {formatLocaleTime(
                              tick.time,
                              tick.date_time,
                              locale,
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              {compactPrimarySymbols.map((symbol) => {
                const tick = quotes[symbol];
                const directionClassName = getDirectionClassName(
                  tick.price_change,
                );
                const rowClassName = getRowClassName(tick.price_change);

                return (
                  <article
                    key={symbol}
                    className={`rounded-xl border border-line px-5 py-5 shadow-[0_16px_36px_rgba(0,0,0,0.24)] sm:px-6 ${rowClassName}`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <LiveQuoteTrendIndicator
                          direction={tick.price_change}
                          locale={locale}
                        />
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-foreground/55">
                            {fieldLabels.symbol}
                          </p>
                          <p
                            className={`font-mono text-lg font-bold sm:text-xl ${directionClassName}`}
                          >
                            <LiveQuoteSymbol
                              symbol={symbol}
                              className="font-mono text-lg font-bold sm:text-xl"
                            />
                          </p>
                        </div>
                      </div>

                      <p
                        className={`text-lg font-bold sm:text-xl ${directionClassName}`}
                      >
                        {formatLocaleNumber(tick.price, locale)}
                      </p>
                    </div>

                    <p className="mt-6 text-xs uppercase tracking-[0.14em] text-foreground/55">
                      {fieldLabels.price}
                    </p>

                    <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-lg border border-line bg-black/20 px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.14em] text-foreground/55">
                          {fieldLabels.buy}
                        </p>
                        <p className="mt-2 font-mono text-foreground/78">
                          {formatLocaleNumber(tick.buy, locale)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-line bg-black/20 px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.14em] text-foreground/55">
                          {fieldLabels.sell}
                        </p>
                        <p className="mt-2 font-mono text-foreground/78">
                          {formatLocaleNumber(tick.sell, locale)}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {compactSecondarySymbols.map((symbol) => {
                const tick = quotes[symbol];
                const directionClassName = getDirectionClassName(
                  tick.price_change,
                );
                const rowClassName = getRowClassName(tick.price_change);

                return (
                  <article
                    key={symbol}
                    className={`rounded-xl border border-line px-5 py-5 shadow-[0_16px_36px_rgba(0,0,0,0.24)] sm:px-6 ${rowClassName}`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <LiveQuoteTrendIndicator
                          direction={tick.price_change}
                          locale={locale}
                        />
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-foreground/55">
                            {fieldLabels.symbol}
                          </p>
                          <p
                            className={`font-mono text-lg font-bold sm:text-xl ${directionClassName}`}
                          >
                            <LiveQuoteSymbol
                              symbol={symbol}
                              className="font-mono text-lg font-bold sm:text-xl"
                            />
                          </p>
                        </div>
                      </div>

                      <p
                        className={`text-lg font-bold sm:text-xl ${directionClassName}`}
                      >
                        {formatLocaleNumber(tick.price, locale)}
                      </p>
                    </div>

                    <p className="mt-6 text-xs uppercase tracking-[0.14em] text-foreground/55">
                      {fieldLabels.price}
                    </p>

                    <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-lg border border-line bg-black/20 px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.14em] text-foreground/55">
                          {fieldLabels.buy}
                        </p>
                        <p className="mt-2 font-mono text-foreground/78">
                          {formatLocaleNumber(tick.buy, locale)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-line bg-black/20 px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.14em] text-foreground/55">
                          {fieldLabels.sell}
                        </p>
                        <p className="mt-2 font-mono text-foreground/78">
                          {formatLocaleNumber(tick.sell, locale)}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="mt-2">
        <div className="px-2 text-right text-xs text-foreground/58 md:pr-3">
          {lastUpdated
            ? `${messages.liveQuoteTable.lastUpdated}: ${formatLocaleTime(lastUpdated, lastUpdated, locale)}`
            : messages.liveQuoteTable.firstTick}
        </div>
      </div>
    </>
  );
}
