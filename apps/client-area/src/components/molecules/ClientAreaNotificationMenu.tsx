"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Bell, CheckCheck, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";

import type { AppMessages } from "@/locales";
import type { AppLocale } from "@/locales";

type ClientAreaNotificationCopy =
  AppMessages["clientArea"]["topbar"]["notifications"];

type ClientAreaNotificationMenuProps = {
  copy: ClientAreaNotificationCopy;
  locale: AppLocale;
};

export function ClientAreaNotificationMenu({
  copy,
  locale,
}: ClientAreaNotificationMenuProps) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [readIds, setReadIds] = useState<string[]>([]);
  const unreadCount = useMemo(
    () => copy.items.filter((item) => !readIds.includes(item.id)).length,
    [copy.items, readIds],
  );

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function markAsRead(id: string) {
    setReadIds((current) =>
      current.includes(id) ? current : [...current, id],
    );
  }

  function markAllAsRead() {
    setReadIds(copy.items.map((item) => item.id));
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={copy.buttonLabel}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/8 bg-white/[0.03] text-zinc-400 transition hover:border-amber-500/30 hover:text-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 ? (
          <span className="absolute right-1.5 top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[9px] font-black leading-none text-black ring-2 ring-zinc-950">
            {unreadCount}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <div
          aria-label={copy.title}
          className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/10 bg-[#111217] shadow-2xl shadow-black/60"
          role="menu"
        >
          <div className="flex items-center justify-between gap-4 border-b border-white/8 px-4 py-3.5">
            <div>
              <h2 className="text-sm font-bold text-white">{copy.title}</h2>
              <p className="mt-0.5 text-[11px] text-zinc-500">
                {unreadCount > 0
                  ? copy.unreadLabel.replace("{count}", String(unreadCount))
                  : copy.allReadLabel}
              </p>
            </div>
            <button
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-400 transition hover:text-amber-300 disabled:cursor-default disabled:text-zinc-600"
              disabled={unreadCount === 0}
              onClick={markAllAsRead}
              type="button"
            >
              <CheckCheck className="h-4 w-4" />
              {copy.markAllReadLabel}
            </button>
          </div>

          <div className="max-h-[min(26rem,65vh)] space-y-2 overflow-y-auto p-2">
            {copy.items.map((item) => {
              const isRead = readIds.includes(item.id);

              return (
                <Link
                  className={`relative flex items-center gap-3 rounded-xl p-3 transition hover:bg-white/[0.06] ${isRead ? "opacity-65" : "bg-amber-500/[0.06]"
                    }`}
                  href={`/${locale}${item.href}`}
                  key={item.id}
                  onClick={() => markAsRead(item.id)}
                  role="menuitem"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-bold text-zinc-100">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-[11px] leading-4 text-zinc-400">
                      {item.description}
                    </span>

                  </span>
                  <span className="mt-1.5 block text-[10px] font-medium text-zinc-600">
                    {item.timeLabel}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
