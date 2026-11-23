"use client";

import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useEffect, useRef, useState } from "react";

import { ClientAreaScrollArrowButton } from "@/components/atoms/ClientAreaScrollArrowButton";
import { ClientAreaRecommendationCard } from "@/components/molecules/ClientAreaRecommendationCard";
import {
  getClientAreaFeaturedMarketPrices,
  getClientAreaMarketCategory,
} from "@/components/organisms/client-area.shared";
import { useLiveQuoteStream } from "@/hooks/useLiveQuoteStream";
import { getMessages, type AppLocale } from "@/locales";

type ClientAreaMarketWatchSectionProps = {
  locale: AppLocale;
  onSelectSymbol?: (symbol: string) => void;
  selectedSymbol?: string;
};

const SCROLL_EDGE_THRESHOLD_PX = 1;

function resolveMarketBadge(symbol?: string) {
  const category = getClientAreaMarketCategory(symbol);

  if (category === "Commodity") {
    return {
      label: category,
      badgeClass: "border-yellow-500/20 bg-yellow-500/10 text-yellow-500",
    };
  }

  if (category === "Index") {
    return {
      label: category,
      badgeClass: "border-sky-500/20 bg-sky-500/10 text-sky-400",
    };
  }

  return {
    label: category,
    badgeClass: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  };
}

function resolveMarketIcon(label: string) {
  if (label === "Commodity") {
    return ["fas", "coins"] as IconProp;
  }

  if (label === "Index") {
    return ["fas", "chart-column"] as IconProp;
  }

  return ["fas", "dollar-sign"] as IconProp;
}

function resolveMarketIconClassName(label: string) {
  if (label === "Commodity") {
    return "bg-gradient-to-br from-yellow-400 to-amber-600 text-black shadow-yellow-600/20";
  }

  if (label === "Index") {
    return "border border-sky-500/20 bg-sky-500/10 text-sky-300";
  }

  return "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
}

function resolveHomeMarketDisplayCode(symbol?: string) {
  if (!symbol) return "";

  return symbol.replace(/_BBJ$/, "");
}

export function ClientAreaMarketWatchSection({
  locale,
  onSelectSymbol,
  selectedSymbol,
}: ClientAreaMarketWatchSectionProps) {
  const messages = getMessages(locale);
  const { quotes } = useLiveQuoteStream();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const watchlistItems = getClientAreaFeaturedMarketPrices(quotes).map((item) => ({
    badge: resolveMarketBadge(item.code),
    item,
  }));
  const itemCount = watchlistItems.length;

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
    // Card widths depend on the viewport, so re-measure on resize too.
    window.addEventListener("resize", updateScrollAvailability);

    return () => window.removeEventListener("resize", updateScrollAvailability);
  }, [itemCount]);

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

  const scrollCopy = messages.clientArea.marketSignalDetail;
  const showArrows = canScrollLeft || canScrollRight;

  return (
    <div className="relative w-full">
      {showArrows ? (
        <ClientAreaScrollArrowButton
          ariaLabel={scrollCopy.scrollLeftLabel}
          direction="left"
          disabled={!canScrollLeft}
          onClick={() => scrollByStep("left")}
          className="absolute -left-3 top-1/2 z-10 -translate-y-1/2"
        />
      ) : null}

      <div className="min-w-0 overflow-hidden">
        <div
          ref={scrollRef}
          onScroll={updateScrollAvailability}
          className="flex w-full snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 touch-pan-x overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {watchlistItems.map(({ badge, item }) => (
            <div
              key={item.code ?? item.name}
              className="w-[min(82vw,19rem)] shrink-0 snap-start sm:w-[calc((100%-1rem)/2)] 2xl:w-[calc((100%-3rem)/4)]"
            >
              <ClientAreaRecommendationCard
                item={item}
                badge={badge.label}
                badgeClass={badge.badgeClass}
                displayCode={resolveHomeMarketDisplayCode(item.code)}
                icon={resolveMarketIcon(badge.label)}
                iconClass={resolveMarketIconClassName(badge.label)}
                isSelected={item.code === selectedSymbol}
                liveTickLabel={messages.clientArea.livePriceTicker.tickLabel}
                priceLabel={messages.liveQuoteTable.fields.price}
                onClick={
                  item.code && onSelectSymbol
                    ? () => onSelectSymbol(item.code as string)
                    : undefined
                }
              />
            </div>
          ))}
        </div>
      </div>

      {showArrows ? (
        <ClientAreaScrollArrowButton
          ariaLabel={scrollCopy.scrollRightLabel}
          direction="right"
          disabled={!canScrollRight}
          onClick={() => scrollByStep("right")}
          className="absolute -right-3 top-1/2 z-10 -translate-y-1/2"
        />
      ) : null}
    </div>
  );
}
