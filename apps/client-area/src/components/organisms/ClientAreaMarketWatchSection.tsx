"use client";

import type { IconProp } from "@fortawesome/fontawesome-svg-core";

import { ClientAreaRecommendationCard } from "@/components/molecules/ClientAreaRecommendationCard";
import { ClientAreaSectionHeader } from "@/components/molecules/ClientAreaSectionHeader";
import {
  getClientAreaFeaturedMarketPrices,
  getClientAreaMarketCategory,
  resolveClientAreaTabHref,
} from "@/components/organisms/client-area.shared";
import type { DashboardCopy } from "@/components/organisms/client-area.types";
import { useLiveQuoteStream } from "@/hooks/useLiveQuoteStream";
import type { AppLocale } from "@/locales";

type ClientAreaMarketWatchSectionProps = {
  copy: DashboardCopy;
  locale: AppLocale;
  onSelectSymbol?: (symbol: string) => void;
  selectedSymbol?: string;
};

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
  copy,
  locale,
  onSelectSymbol,
  selectedSymbol,
}: ClientAreaMarketWatchSectionProps) {
  const { quotes } = useLiveQuoteStream();
  const watchlistItems = getClientAreaFeaturedMarketPrices(quotes).map((item) => ({
    badge: resolveMarketBadge(item.code),
    item,
  }));

  return (
    <div>
      <ClientAreaSectionHeader
        title={copy.marketWatchTitle}
        actionHref={resolveClientAreaTabHref(locale, "market")}
        actionLabel={copy.viewMoreLabel}
      />

      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 pr-1 touch-pan-x overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 sm:pr-0 2xl:grid-cols-4">
        {watchlistItems.map(({ badge, item }) => (
          <div
            key={item.code ?? item.name}
            className="w-[min(82vw,19rem)] shrink-0 snap-start sm:w-auto sm:shrink"
          >
            <ClientAreaRecommendationCard
              item={item}
              badge={badge.label}
              badgeClass={badge.badgeClass}
              displayCode={resolveHomeMarketDisplayCode(item.code)}
              icon={resolveMarketIcon(badge.label)}
              iconClass={resolveMarketIconClassName(badge.label)}
              isSelected={item.code === selectedSymbol}
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
  );
}
