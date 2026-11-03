"use client";

import { useEffect, useRef, useState } from "react";

import { ClientAreaScrollArrowButton } from "@/components/atoms/ClientAreaScrollArrowButton";
import { ClientAreaMarketInsightCard } from "@/components/molecules/ClientAreaMarketInsightCard";
import { ClientAreaSectionHeader } from "@/components/molecules/ClientAreaSectionHeader";
import type { DashboardCopy } from "@/components/organisms/client-area.types";
import type { MarketSignalRecord } from "@/lib/market-signal";
import { getMessages, type AppLocale } from "@/locales";

type ClientAreaMarketInsightSectionProps = {
  copy: DashboardCopy;
  items: MarketSignalRecord[];
  locale: AppLocale;
};

const SCROLL_EDGE_THRESHOLD_PX = 1;

export function ClientAreaMarketInsightSection({
  copy,
  items,
  locale,
}: ClientAreaMarketInsightSectionProps) {
  const insightCopy = getMessages(locale).clientArea.marketSignalDetail;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollAvailability = () => {
    const scrollEl = scrollRef.current;

    if (!scrollEl) {
      return;
    }

    setCanScrollLeft(scrollEl.scrollLeft > SCROLL_EDGE_THRESHOLD_PX);
    setCanScrollRight(
      scrollEl.scrollLeft + scrollEl.clientWidth <
      scrollEl.scrollWidth - SCROLL_EDGE_THRESHOLD_PX,
    );
  };

  useEffect(() => {
    updateScrollAvailability();
  }, [items]);

  // Scrolls to the neighbouring card's measured position instead of a fixed
  // pixel step: that position is exactly a snap point, so `snap-mandatory`
  // cannot overshoot to a later card.
  const scrollByStep = (direction: "left" | "right") => {
    const scrollEl = scrollRef.current;

    if (!scrollEl) {
      return;
    }

    const containerLeft = scrollEl.getBoundingClientRect().left;
    const cardOffsets = Array.from(scrollEl.children).map(
      (card) =>
        card.getBoundingClientRect().left - containerLeft + scrollEl.scrollLeft,
    );
    const current = scrollEl.scrollLeft;
    const target =
      direction === "right"
        ? cardOffsets.find((offset) => offset > current + SCROLL_EDGE_THRESHOLD_PX)
        : [...cardOffsets]
            .reverse()
            .find((offset) => offset < current - SCROLL_EDGE_THRESHOLD_PX);

    scrollEl.scrollTo({
      left: target ?? (direction === "right" ? scrollEl.scrollWidth : 0),
      behavior: "smooth",
    });
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div>
      <ClientAreaSectionHeader
        title={insightCopy.insightTitle}
        actionHref={`/${locale}/client-area/market-signal`}
        actionLabel={copy.viewMoreLabel}
      />

      <div className="relative w-full">
        {/* Left Arrow */}
        <ClientAreaScrollArrowButton
          ariaLabel={insightCopy.scrollLeftLabel}
          direction="left"
          disabled={!canScrollLeft}
          onClick={() => scrollByStep("left")}
          className="absolute left-2 top-1/2 z-10 -translate-y-1/2"
        />

        {/* Scroll Container */}
        <div className="min-w-0 overflow-hidden">
          <div
            ref={scrollRef}
            onScroll={updateScrollAvailability}
            className="flex w-full items-start gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="shrink-0 snap-start"
              >
                <ClientAreaMarketInsightCard
                  item={item}
                  locale={locale}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow */}
        <ClientAreaScrollArrowButton
          ariaLabel={insightCopy.scrollRightLabel}
          direction="right"
          disabled={!canScrollRight}
          onClick={() => scrollByStep("right")}
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2"
        />
      </div>
    </div>
  );
}
