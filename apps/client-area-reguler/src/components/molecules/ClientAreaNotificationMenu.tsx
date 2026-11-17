"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, BellOff, CheckCheck, Radio } from "lucide-react";
import { usePathname } from "next/navigation";

import type { AppLocale, AppMessages } from "@/locales";
import type { ClientAreaActiveLiveSession } from "@/lib/client-area-live-schedule.shared";

const READ_NOTIFICATION_IDS_STORAGE_KEY =
  "client-area-read-notification-ids";
const NOTIFICATION_HISTORY_STORAGE_KEY =
  "client-area-notification-history";
const MAX_STORED_READ_NOTIFICATION_IDS = 200;
const MAX_STORED_NOTIFICATIONS = 100;

type ClientAreaNotificationCopy =
  AppMessages["clientArea"]["topbar"]["notifications"];

type ClientAreaNotificationMenuProps = {
  activeLiveSessions: ClientAreaActiveLiveSession[];
  copy: ClientAreaNotificationCopy;
  locale: AppLocale;
};

type ClientAreaNotificationItem = {
  description: string;
  href: string;
  id: string;
  isActive: boolean;
  timeLabel: string;
  title: string;
};

type StoredLiveNotification = Pick<
  ClientAreaActiveLiveSession,
  "channelName" | "hour" | "href" | "minute" | "occurrenceId"
> & {
  dateKey: string;
};

function isStoredLiveNotification(
  value: unknown,
): value is StoredLiveNotification {
  if (!value || typeof value !== "object") return false;

  const notification = value as Record<string, unknown>;
  return (
    typeof notification.channelName === "string" &&
    typeof notification.dateKey === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(notification.dateKey) &&
    typeof notification.hour === "number" &&
    typeof notification.href === "string" &&
    typeof notification.minute === "number" &&
    typeof notification.occurrenceId === "string"
  );
}

function readStoredNotifications() {
  try {
    const storedValue = window.localStorage.getItem(
      NOTIFICATION_HISTORY_STORAGE_KEY,
    );
    const parsedValue = storedValue ? (JSON.parse(storedValue) as unknown) : [];

    return Array.isArray(parsedValue)
      ? parsedValue.filter(isStoredLiveNotification)
      : [];
  } catch {
    return [];
  }
}

function getNotificationDateKey(occurrenceId: string) {
  return occurrenceId.slice(-10);
}

function getNotificationSortKey(notification: StoredLiveNotification) {
  return `${notification.dateKey}-${String(notification.hour).padStart(2, "0")}:${String(notification.minute).padStart(2, "0")}`;
}

function mergeNotificationHistory(
  storedNotifications: StoredLiveNotification[],
  activeLiveSessions: ClientAreaActiveLiveSession[],
) {
  const notificationsById = new Map(
    storedNotifications.map((notification) => [
      notification.occurrenceId,
      notification,
    ]),
  );

  activeLiveSessions.forEach((session) => {
    notificationsById.set(session.occurrenceId, {
      channelName: session.channelName,
      dateKey: getNotificationDateKey(session.occurrenceId),
      hour: session.hour,
      href: session.href,
      minute: session.minute,
      occurrenceId: session.occurrenceId,
    });
  });

  return [...notificationsById.values()]
    .sort((left, right) =>
      getNotificationSortKey(right).localeCompare(getNotificationSortKey(left)),
    )
    .slice(0, MAX_STORED_NOTIFICATIONS);
}

function storeNotificationHistory(notifications: StoredLiveNotification[]) {
  try {
    window.localStorage.setItem(
      NOTIFICATION_HISTORY_STORAGE_KEY,
      JSON.stringify(notifications),
    );
  } catch {
    // History still works for the current page when browser storage is blocked.
  }

  return notifications;
}

function formatHistoryTimeLabel(
  notification: StoredLiveNotification,
  locale: AppLocale,
) {
  const hour = String(notification.hour).padStart(2, "0");
  const minute = String(notification.minute).padStart(2, "0");
  const date = new Date(`${notification.dateKey}T${hour}:${minute}:00+07:00`);

  if (Number.isNaN(date.getTime())) return notification.dateKey;

  return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
    day: "numeric",
    hour: "2-digit",
    hourCycle: "h23",
    minute: "2-digit",
    month: "short",
    timeZone: "Asia/Jakarta",
    timeZoneName: "short",
    year: "numeric",
  }).format(date);
}

function readStoredNotificationIds() {
  try {
    const storedValue = window.localStorage.getItem(
      READ_NOTIFICATION_IDS_STORAGE_KEY,
    );
    const parsedValue = storedValue ? (JSON.parse(storedValue) as unknown) : [];

    return Array.isArray(parsedValue)
      ? parsedValue.filter((value): value is string => typeof value === "string")
      : [];
  } catch {
    return [];
  }
}

function storeReadNotificationIds(ids: string[]) {
  const normalizedIds = [...new Set(ids)].slice(
    -MAX_STORED_READ_NOTIFICATION_IDS,
  );

  try {
    window.localStorage.setItem(
      READ_NOTIFICATION_IDS_STORAGE_KEY,
      JSON.stringify(normalizedIds),
    );
  } catch {
    // Reading still works for the current page when browser storage is blocked.
  }

  return normalizedIds;
}

export function ClientAreaNotificationMenu({
  activeLiveSessions,
  copy,
  locale,
}: ClientAreaNotificationMenuProps) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [notificationHistory, setNotificationHistory] = useState<
    StoredLiveNotification[]
  >([]);
  const activeNotificationIds = useMemo(
    () => new Set(activeLiveSessions.map((session) => session.occurrenceId)),
    [activeLiveSessions],
  );
  const items = useMemo<ClientAreaNotificationItem[]>(
    () =>
      notificationHistory.map((notification) => {
        const isActive = activeNotificationIds.has(notification.occurrenceId);

        return {
          description: isActive
            ? copy.scheduledLive.description
            : copy.scheduledLive.historyDescription,
          href: notification.href,
          id: notification.occurrenceId,
          isActive,
          timeLabel: isActive
            ? copy.scheduledLive.timeLabel
            : formatHistoryTimeLabel(notification, locale),
          title: (isActive
            ? copy.scheduledLive.title
            : copy.scheduledLive.historyTitle
          ).replace(
            "{channel}",
            notification.channelName,
          ),
        };
      }),
    [activeNotificationIds, copy, locale, notificationHistory],
  );
  const unreadCount = useMemo(
    () => items.filter((item) => !readIds.includes(item.id)).length,
    [items, readIds],
  );

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    setReadIds(readStoredNotificationIds());
    setNotificationHistory(readStoredNotifications());

    function handleStorage(event: StorageEvent) {
      if (event.key === READ_NOTIFICATION_IDS_STORAGE_KEY) {
        setReadIds(readStoredNotificationIds());
      }

      if (event.key === NOTIFICATION_HISTORY_STORAGE_KEY) {
        setNotificationHistory(readStoredNotifications());
      }
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    if (activeLiveSessions.length === 0) return;

    setNotificationHistory((currentHistory) => {
      const mergedHistory = mergeNotificationHistory(
        [...readStoredNotifications(), ...currentHistory],
        activeLiveSessions,
      );

      return storeNotificationHistory(mergedHistory);
    });
  }, [activeLiveSessions]);

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
    setReadIds((currentReadIds) => {
      if (currentReadIds.includes(id)) return currentReadIds;
      return storeReadNotificationIds([...currentReadIds, id]);
    });
  }

  function markAllAsRead() {
    setReadIds((currentReadIds) =>
      storeReadNotificationIds([
        ...currentReadIds,
        ...items.map((item) => item.id),
      ]),
    );
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

      <div
        aria-hidden={!isOpen}
        aria-label={copy.title}
        inert={!isOpen}
        className={`fixed inset-x-4 top-[5.75rem] z-50 w-auto origin-top-right overflow-hidden rounded-2xl border border-white/10 bg-[#111217] shadow-2xl shadow-black/60 transition-[opacity,transform,visibility] duration-300 ease-out motion-reduce:transition-none sm:absolute sm:inset-x-auto sm:right-0 sm:top-[calc(100%+0.75rem)] sm:w-[min(22rem,calc(100vw-2rem))] ${isOpen
          ? "visible pointer-events-auto translate-y-0 scale-100 opacity-100"
          : "invisible pointer-events-none -translate-y-2 scale-95 opacity-0"
          }`}
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

          <div className="client-area-notification-scroll max-h-[min(26rem,65vh)] space-y-2 overflow-y-auto p-2">
            {items.length === 0 ? (
              <div className="flex flex-col items-center px-5 py-8 text-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] text-zinc-600">
                  <BellOff className="h-4 w-4" />
                </span>
                <p className="mt-3 text-xs leading-5 text-zinc-500">
                  {copy.emptyLabel}
                </p>
              </div>
            ) : items.map((item) => {
              const isRead = readIds.includes(item.id);
              const itemClassName = `relative grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 gap-y-1 rounded-xl p-3 transition hover:bg-white/[0.06] min-[421px]:flex min-[421px]:gap-3 ${isRead ? "opacity-65" : "bg-amber-500/[0.06]"}`;
              const itemContent = (
                <>
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.isActive ? "bg-red-500/15 text-red-400" : "bg-white/[0.05] text-zinc-500"}`}
                  >
                    <Radio className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-bold text-zinc-100">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-[11px] leading-4 text-zinc-400">
                      {item.description}
                    </span>
                  </span>
                  <span className="col-start-2 block min-w-0 text-left text-[10px] font-medium leading-4 text-zinc-600 min-[421px]:mt-1.5 min-[421px]:max-w-24 min-[421px]:shrink-0 min-[421px]:text-right">
                    {item.timeLabel}
                  </span>
                </>
              );

              return (
                <a
                  className={itemClassName}
                  href={item.href}
                  key={item.id}
                  onClick={() => markAsRead(item.id)}
                  rel="noreferrer"
                  role="menuitem"
                  target="_blank"
                >
                  {itemContent}
                </a>
              );
            })}
          </div>
      </div>
    </div>
  );
}
