"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import type { PengumumanRecord } from "@/lib/pengumuman";
import type { AppLocale } from "@/locales";

type AboutInformationAnnouncementsProps = {
  items: PengumumanRecord[];
  locale: AppLocale;
  labels: {
    management: string;
    latest: string;
    emptyTitle: string;
    emptyBody: string;
    close: string;
    defaultTitle: string;
  };
};

const MODAL_ANIMATION_DURATION_MS = 240;

function formatDate(dateStr: string, locale: AppLocale) {
  try {
    return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

function EmptyPengumuman({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[2rem] border border-yellow-500/10 bg-yellow-500/[0.03] py-20 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-yellow-500/20 bg-yellow-500/10">
        <FontAwesomeIcon
          icon={["fas", "bell-slash"]}
          className="text-2xl text-yellow-500/60"
        />
      </div>
      <p className="text-base font-semibold text-white/60">{title}</p>
      <p className="mt-2 text-sm text-foreground/40">{body}</p>
    </div>
  );
}

export function AboutInformationAnnouncements({
  items,
  locale,
  labels,
}: AboutInformationAnnouncementsProps) {
  const [selectedItem, setSelectedItem] = useState<PengumumanRecord | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  function handleOpenItem(item: PengumumanRecord) {
    setSelectedItem(item);
  }

  function handleCloseModal() {
    if (!selectedItem || !isModalVisible) {
      return;
    }

    setIsModalVisible(false);
  }

  useEffect(() => {
    if (!selectedItem) {
      return;
    }

    const animationFrameId = window.requestAnimationFrame(() => {
      setIsModalVisible(true);
    });

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsModalVisible(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedItem]);

  useEffect(() => {
    if (!selectedItem || isModalVisible) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSelectedItem(null);
      setIsModalVisible(false);
    }, MODAL_ANIMATION_DURATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isModalVisible, selectedItem]);

  if (!items.length) {
    return <EmptyPengumuman title={labels.emptyTitle} body={labels.emptyBody} />;
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item, index) => {
          const isNew = index === 0;
          const title = item.judul?.trim() || labels.defaultTitle;
          const imageAlt = item.judul?.trim() || title;
          const dateLabel = formatDate(
            item.updated_at || item.created_at,
            locale,
          );

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleOpenItem(item)}
              className="group overflow-hidden rounded-xl cursor-pointer border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.04),rgba(0,0,0,0.25))] text-left transition-all duration-300 hover:border-yellow-500/30 hover:shadow-[0_0_40px_rgba(205,161,58,0.08)]"
            >
              {item.image_url ? (
                <div className="relative h-52 w-full overflow-hidden">
                  <Image
                    src={item.image_url}
                    alt={imageAlt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {isNew ? (
                    <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-yellow-500 px-3 py-1">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-black" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-black">
                        {labels.latest}
                      </span>
                    </div>
                  ) : null}

                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="font-mono text-lg font-bold leading-snug text-white drop-shadow-lg line-clamp-2">
                      {title}
                    </h2>
                  </div>
                </div>
              ) : (
                <div className="relative flex h-32 items-end bg-gradient-to-br from-yellow-500/20 via-yellow-500/5 to-transparent p-5">
                  <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/15 text-yellow-400">
                    <FontAwesomeIcon
                      icon={["fas", "bullhorn"]}
                      className="text-sm"
                    />
                  </div>

                  {isNew ? (
                    <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-yellow-500 px-3 py-1">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-black" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-black">
                        {labels.latest}
                      </span>
                    </div>
                  ) : null}

                  <h2 className="font-mono text-lg font-bold leading-snug text-white line-clamp-2">
                    {title}
                  </h2>
                </div>
              )}

              <div className="p-5">
                <div className="flex items-center gap-3 text-xs text-yellow-500/60">
                  <span className="flex items-center gap-1.5">
                    <FontAwesomeIcon
                      icon={["fas", "calendar-days"]}
                      className="text-[10px]"
                    />
                    {dateLabel}
                  </span>
                  <span className="h-px flex-1 bg-yellow-500/10" />
                  <span className="flex items-center gap-1.5">
                    <FontAwesomeIcon
                      icon={["fas", "building"]}
                      className="text-[10px]"
                    />
                    {labels.management}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selectedItem ? (
        <div
          className={`fixed inset-0 z-[140] flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm transition-all duration-[240ms] ease-out ${isModalVisible
            ? "opacity-100 backdrop-blur-sm"
            : "opacity-0 backdrop-blur-none"
            }`}
          onClick={handleCloseModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`pengumuman-title-${selectedItem.id}`}
            className={`relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-[2rem] border border-yellow-500/15 bg-[linear-gradient(180deg,rgba(18,18,18,0.98)_0%,rgba(8,8,8,1)_100%)] shadow-[0_25px_100px_rgba(0,0,0,0.55)] transition-all duration-[240ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ${isModalVisible
              ? "translate-y-0 scale-100 opacity-100"
              : "translate-y-6 scale-[0.96] opacity-0"
              }`}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleCloseModal}
              aria-label={labels.close}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white/70 transition hover:border-yellow-500/30 hover:text-yellow-400"
            >
              <FontAwesomeIcon icon={["fas", "xmark"]} />
            </button>

            <div className="max-h-[90vh] overflow-y-auto">
              {selectedItem.image_url ? (
                <div className="relative h-64 w-full sm:h-80">
                  <Image
                    src={selectedItem.image_url}
                    alt={selectedItem.judul?.trim() || labels.defaultTitle}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                </div>
              ) : null}

              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-3 text-xs text-yellow-500/70">
                  <span className="flex items-center gap-1.5">
                    <FontAwesomeIcon
                      icon={["fas", "calendar-days"]}
                      className="text-[10px]"
                    />
                    {formatDate(
                      selectedItem.updated_at || selectedItem.created_at,
                      locale,
                    )}
                  </span>
                  <span className="h-px w-8 bg-yellow-500/20" />
                  <span className="flex items-center gap-1.5">
                    <FontAwesomeIcon
                      icon={["fas", "building"]}
                      className="text-[10px]"
                    />
                    {labels.management}
                  </span>
                </div>

                <h2
                  id={`pengumuman-title-${selectedItem.id}`}
                  className="mt-4 max-w-3xl font-mono text-2xl font-bold tracking-[-0.03em] text-white sm:text-[2rem]"
                >
                  {selectedItem.judul?.trim() || labels.defaultTitle}
                </h2>

                <div
                  className="pengumuman-content prose-sm mt-6 max-w-none text-sm leading-7 text-foreground/75"
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: selectedItem.konten ?? "" }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
