"use client";

import { useEffect, useMemo, useState } from "react";

import type { AppLocale } from "@/locales";

type ClientAreaDateTimeProps = {
  locale: AppLocale;
};

const CLIENT_AREA_TIME_ZONE = "Asia/Jakarta";

export function ClientAreaDateTime({ locale }: ClientAreaDateTimeProps) {
  const [now, setNow] = useState<Date | null>(null);
  const dateLocale = locale === "id" ? "id-ID" : "en-GB";
  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(dateLocale, {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: CLIENT_AREA_TIME_ZONE,
      }),
    [dateLocale],
  );
  const timeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(dateLocale, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
        timeZone: CLIENT_AREA_TIME_ZONE,
      }),
    [dateLocale],
  );
  const dateText = now ? dateFormatter.format(now) : "-- --- ----";
  const timeText = now ? timeFormatter.format(now) : "--:--:--";
  const ariaLabel = `${dateText}, ${timeText} WIB`;

  useEffect(() => {
    const updateTime = () => setNow(new Date());

    updateTime();
    const intervalId = window.setInterval(updateTime, 1_000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div
      aria-label={ariaLabel}
      className="hidden shrink-0 items-center gap-3 rounded-xl px-3 py-2 shadow-sm shadow-black/20 xl:flex"
    >
      {/* <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-400">
        <CalendarDays className="h-4 w-4" aria-hidden="true" />
      </div> */}

      <div className="flex flex-col items-end">
        <p className="whitespace-nowrap text-[12px] font-medium text-zinc-400">
          {dateText}
        </p>

        <time
          dateTime={now?.toISOString()}
          className="flex items-center w-fit gap-1.5 whitespace-nowrap font-mono text-[12px] font-semibold tabular-nums text-amber-400"
        >
          {timeText}
        </time>
      </div>
    </div>
  );
}
