"use client";

import { useEffect, useState } from "react";

import { ResilientImage } from "@/components/atoms/ResilientImage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AboutInformationAnnouncementsEmptyState } from "@/components/molecules/AboutInformationAnnouncementsEmptyState";
import type { PengumumanRecord } from "@/lib/pengumuman";
import type { AppLocale } from "@/locales";
import { ScrollReveal } from "../molecules/ScrollReveal";

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

function getAnnouncementTimestamp(item: PengumumanRecord) {
  const timestamp = Date.parse(item.created_at);

  return Number.isNaN(timestamp) ? 0 : timestamp;
}

export function AboutInformationAnnouncements({
  items,
  locale,
  labels,
}: AboutInformationAnnouncementsProps) {
  const sortedItems = items
    .slice()
    .sort(
      (left, right) =>
        getAnnouncementTimestamp(right) - getAnnouncementTimestamp(left),
    );
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
    return (
      <AboutInformationAnnouncementsEmptyState
        title={labels.emptyTitle}
        body={labels.emptyBody}
      />
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {sortedItems.map((item, index) => {
          const isNew = index === 0;
          const desktopRevealDelay = (index % 3) * 250;
          const title = item.judul?.trim() || labels.defaultTitle;
          const imageAlt = item.judul?.trim() || title;
          const dateLabel = formatDate(item.created_at, locale);

          return (
            <ScrollReveal
              key={item.id}
              delay={0}
              desktopDelay={desktopRevealDelay}
              className="w-full h-full"
            >
              <button
                type="button"
                onClick={() => handleOpenItem(item)}
                className="group flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-xl border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.04),rgba(0,0,0,0.25))] text-left transition-all duration-300 hover:border-yellow-500/30 hover:shadow-[0_0_40px_rgba(205,161,58,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                {item.image_url ? (
                  <div className="relative h-52 w-full overflow-hidden">
                    <ResilientImage
                      src={item.image_url}
                      alt={imageAlt}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      fallback={
                        <div className="relative flex h-full w-full items-end bg-gradient-to-br from-yellow-500/20 via-yellow-500/5 to-transparent p-5">
                          <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/15 text-yellow-400">
                            <FontAwesomeIcon
                              icon={["fas", "bullhorn"]}
                              className="text-sm"
                            />
                          </div>
                        </div>
                      }
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

                <div className="mt-auto p-5">
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
            </ScrollReveal>
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
            className={`relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[2rem] border border-yellow-500/15 bg-[linear-gradient(180deg,rgba(18,18,18,0.98)_0%,rgba(8,8,8,1)_100%)] shadow-[0_25px_100px_rgba(0,0,0,0.55)] transition-all duration-[240ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ${isModalVisible
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

            {selectedItem.image_url ? (
              <div className="relative h-64 w-full shrink-0 overflow-hidden sm:h-80">
                <ResilientImage
                  src={selectedItem.image_url}
                  alt={selectedItem.judul?.trim() || labels.defaultTitle}
                  loading="eager"
                  className="h-full w-full object-center object-cover"
                  fallback={
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-yellow-500/10 via-black to-black overflow-hidden">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/15 text-yellow-400">
                        <FontAwesomeIcon
                          icon={["fas", "bullhorn"]}
                          className="text-xl"
                        />
                      </div>
                    </div>
                  }
                />
                <div className="absolute bottom-0 left-0 z-10 px-4 py-6 w-full">
                  <h2
                    id={`pengumuman-title-${selectedItem.id}`}
                    className="absolute bottom-3 z-10 font-mono text-2xl font-bold tracking-[-0.03em] text-white sm:text-[2rem]"
                  >
                    {selectedItem.judul?.trim() || labels.defaultTitle}
                  </h2>
                </div>


                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              </div>
            ) : null}

            <div className="pengumuman-modal-scroll min-h-0 flex-1 overflow-y-auto">
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3 text-xs text-yellow-500/70 w-full">
                  <p className="flex items-center w-fit text-nowrap gap-1.5">
                    <FontAwesomeIcon
                      icon={["fas", "calendar-days"]}
                      className="text-[10px]"
                    />
                    {formatDate(selectedItem.created_at, locale)}
                  </p>
                  <span className="h-px w-full bg-yellow-500/20" />
                  <span className="flex w-fit text-nowrap items-center gap-1.5">
                    <FontAwesomeIcon
                      icon={["fas", "building"]}
                      className="text-[10px]"
                    />
                    {labels.management}
                  </span>
                </div>

                <div>


                  <div
                    className="pengumuman-content prose-sm mt-6 max-w-none text-sm leading-7 text-white"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: selectedItem.konten ?? "" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
