"use client";

import { useEffect, useRef, useState } from "react";

import { ClientAreaScrollArrowButton } from "@/components/atoms/ClientAreaScrollArrowButton";
import { ClientAreaMarketInsightCard } from "@/components/molecules/ClientAreaMarketInsightCard";
import { ClientAreaSectionHeader } from "@/components/molecules/ClientAreaSectionHeader";
import type { DashboardCopy } from "@/components/organisms/client-area.types";
import type { MarketSignalRecord } from "@/lib/market-signal";
import type { AppLocale } from "@/locales";

type ClientAreaMarketInsightSectionProps = {
  copy: DashboardCopy;
  items: MarketSignalRecord[];
  locale: AppLocale;
};

const SCROLL_STEP_PX = 336;
const SCROLL_EDGE_THRESHOLD_PX = 1;

export function ClientAreaMarketInsightSection({
  copy,
  items,
  locale,
}: ClientAreaMarketInsightSectionProps) {
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

  const scrollByStep = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -SCROLL_STEP_PX : SCROLL_STEP_PX,
      behavior: "smooth",
    });
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div>
      <ClientAreaSectionHeader
        title="Market Insight"
        actionHref={`/${locale}/client-area/market-signal`}
        actionLabel={copy.viewMoreLabel}
      />

      <div className="relative w-full">
        {/* Left Arrow */}
        <ClientAreaScrollArrowButton
          ariaLabel="Scroll ke kiri"
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
          ariaLabel="Scroll ke kanan"
          direction="right"
          disabled={!canScrollRight}
          onClick={() => scrollByStep("right")}
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2"
        />
      </div>
    </div>
  );
}
