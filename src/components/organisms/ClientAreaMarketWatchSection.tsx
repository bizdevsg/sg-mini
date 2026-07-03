"use client";

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
    return ["fas", "coins"] as const;
  }

  if (label === "Index") {
    return ["fas", "chart-column"] as const;
  }

  return ["fas", "dollar-sign"] as const;
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

export function ClientAreaMarketWatchSection({
  copy,
  locale,
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {watchlistItems.map(({ badge, item }) => (
          <ClientAreaRecommendationCard
            key={item.code ?? item.name}
            item={item}
            badge={badge.label}
            badgeClass={badge.badgeClass}
            icon={resolveMarketIcon(badge.label)}
            iconClass={resolveMarketIconClassName(badge.label)}
          />
        ))}
      </div>
    </div>
  );
}
