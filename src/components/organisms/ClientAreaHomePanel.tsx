"use client";

import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Dispatch, SetStateAction } from "react";

import { ClientAreaQuickActionButton } from "@/components/atoms/ClientAreaQuickActionButton";
import { ClientAreaHeroSlideshow } from "@/components/molecules/ClientAreaHeroSlideshow";
import { ClientAreaRecommendationCard } from "@/components/molecules/ClientAreaRecommendationCard";
import {
  ACTION_IDS,
  formatSignedUsd,
  formatUsd,
} from "@/components/organisms/client-area.shared";
import type {
  AccountMode,
  AccountSnapshot,
  ActionId,
  ClientAreaHeroSlide,
  DashboardCopy,
  MarketPrice,
} from "@/components/organisms/client-area.types";
import type { AppMessages } from "@/locales";

type ClientAreaHomePanelProps = {
  clientArea: AppMessages["clientArea"];
  copy: DashboardCopy;
  heroSlides: ClientAreaHeroSlide[];
  currentSlide: number;
  setCurrentSlide: Dispatch<SetStateAction<number>>;
  currentAccount: AccountSnapshot;
  accountMode: AccountMode;
  isAccountMenuOpen: boolean;
  setIsAccountMenuOpen: Dispatch<SetStateAction<boolean>>;
  onSelectAccountMode: (mode: AccountMode) => void;
  quickActionIconMap: Record<ActionId, IconProp>;
  onActionClick: (actionId: ActionId) => void;
  prices: MarketPrice[];
};

export function ClientAreaHomePanel({
  clientArea,
  copy,
  heroSlides,
  currentSlide,
  setCurrentSlide,
  currentAccount,
  accountMode,
  isAccountMenuOpen,
  setIsAccountMenuOpen,
  onSelectAccountMode,
  quickActionIconMap,
  onActionClick,
  prices,
}: ClientAreaHomePanelProps) {
  const [goldPrice, oilPrice, silverPrice] = prices;

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
      <div className="flex min-w-0 flex-col gap-6 xl:col-span-8">
        <ClientAreaHeroSlideshow
          slides={heroSlides}
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
        />

        <div className="grid grid-cols-5 gap-2 md:gap-4">
          {ACTION_IDS.map((actionId, index) => {
            const action = clientArea.quickActions.items[index];

            return (
              <ClientAreaQuickActionButton
                key={actionId}
                icon={quickActionIconMap[actionId]}
                label={action?.label ?? actionId}
                onClick={() => onActionClick(actionId)}
              />
            );
          })}
        </div>

        <div>
          <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-zinc-100">
            <span className="h-4 w-1.5 rounded-full bg-yellow-500" />
            {copy.recommendationsLabel}
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <ClientAreaRecommendationCard
              item={goldPrice}
              badge="Popular"
              badgeClass="bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
              icon={["fas", "coins"]}
              iconClass="bg-gradient-to-br from-yellow-400 to-amber-600 text-black shadow-yellow-600/20"
            />
            <ClientAreaRecommendationCard
              item={oilPrice}
              badge="Energy"
              badgeClass="bg-zinc-800 text-zinc-400 border-zinc-700"
              icon={["fas", "droplet"]}
              iconClass="bg-zinc-800 text-zinc-300 border border-zinc-700"
            />
            <ClientAreaRecommendationCard
              item={silverPrice}
              badge="Metal"
              badgeClass="bg-zinc-800 text-zinc-400 border-zinc-700"
              icon={["fas", "cubes"]}
              iconClass="bg-zinc-800 text-zinc-300 border border-zinc-700"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 xl:col-span-4">
        <div className="relative overflow-hidden rounded-3xl border border-yellow-400/30 bg-gradient-to-b from-amber-500 via-orange-500 to-yellow-500 p-5 text-black shadow-2xl">
          <div className="relative z-50 mb-4 flex items-center justify-between gap-4">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsAccountMenuOpen((open) => !open)}
                className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider shadow-md transition-colors ${accountMode === "demo"
                  ? "border-red-600 bg-red-700/90 text-white hover:bg-red-800"
                  : "border-yellow-400 bg-yellow-600 text-black hover:bg-yellow-500"
                  }`}
              >
                <span>{currentAccount.typeLabel}</span>
                <FontAwesomeIcon
                  icon={["fas", "chevron-down"]}
                  className="text-[9px]"
                />
              </button>

              {isAccountMenuOpen ? (
                <div className="absolute left-0 top-8 z-50 w-36 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 text-xs text-white shadow-xl">
                  <button
                    type="button"
                    onClick={() => onSelectAccountMode("demo")}
                    className="w-full px-4 py-2 text-left font-bold text-red-400 transition hover:bg-zinc-900 hover:text-red-300"
                  >
                    {copy.demoAccount.typeLabel}
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectAccountMode("real")}
                    className="w-full px-4 py-2 text-left font-bold text-yellow-400 transition hover:bg-zinc-900 hover:text-yellow-300"
                  >
                    {copy.realAccount.typeLabel}
                  </button>
                </div>
              ) : null}
            </div>

            <span className="text-base font-extrabold tracking-tight text-neutral-900">
              {currentAccount.accountId}
            </span>

            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-black/20 bg-zinc-900 shadow">
              <FontAwesomeIcon
                icon={["fas", "user"]}
                className="text-sm text-yellow-400"
              />
            </div>
          </div>

          <div className="relative mb-5 grid grid-cols-3 gap-2 rounded-2xl border border-black/5 bg-black/5 p-2.5">
            <div className="min-w-0 rounded-xl bg-black/10 px-3 py-2 text-center">
              <span className="block text-[9px] font-bold uppercase tracking-tight text-neutral-800">
                New Balance
              </span>
              <span className="mt-1 block break-words text-xs font-black leading-tight text-neutral-950">
                {formatUsd(currentAccount.balance)}
              </span>
            </div>

            <div className="min-w-0 rounded-xl bg-black/10 px-3 py-2 text-center">
              <span className="block text-[9px] font-bold uppercase tracking-tight text-neutral-800">
                Floating P/L
              </span>
              <div
                className={`mt-1 inline-flex max-w-full items-center justify-center gap-0.5 rounded-md px-2 py-1 text-[10px] font-black leading-tight text-white shadow-sm ${currentAccount.floatingPl >= 0
                  ? "bg-emerald-600"
                  : "bg-red-600"
                  }`}
              >
                <FontAwesomeIcon
                  icon={
                    currentAccount.floatingPl >= 0
                      ? ["fas", "arrow-up-long"]
                      : ["fas", "arrow-down-long"]
                  }
                  className="text-[8px]"
                />
                <span className="break-words">{formatSignedUsd(currentAccount.floatingPl)}</span>
              </div>
            </div>

            <div className="min-w-0 rounded-xl bg-black/10 px-3 py-2 text-center">
              <span className="block text-[9px] font-bold uppercase tracking-tight text-neutral-800">
                Equity
              </span>
              <span className="mt-1 block break-words text-sm font-black leading-tight text-neutral-950">
                {formatUsd(currentAccount.equity)}
              </span>
            </div>
          </div>

          <div className="relative z-10 space-y-3 px-1 text-xs font-semibold text-neutral-900">
            {[
              {
                icon: ["fas", "circle-exclamation"] as IconProp,
                label: "Margin Required",
                value: formatUsd(currentAccount.marginRequired),
              },
              {
                icon: ["fas", "shield-halved"] as IconProp,
                label: "Effective Margin",
                value: formatUsd(currentAccount.effectiveMargin),
              },
              {
                icon: ["fas", "bell"] as IconProp,
                label: "Call Margin Place",
                value: formatUsd(currentAccount.callMarginPlace),
              },
              {
                icon: ["fas", "percent"] as IconProp,
                label: "Equity Ratio",
                value: `${currentAccount.equityRatio.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}%`,
              },
              {
                icon: ["fas", "fire"] as IconProp,
                label: "Auto Liquidation",
                value: formatUsd(currentAccount.autoLiquidation),
              },
            ].map((item, index, items) => (
              <div
                key={item.label}
                className={`flex items-center justify-between ${index !== items.length - 1 ? "border-b border-black/10 pb-1.5" : ""
                  }`}
              >
                <span className="flex items-center gap-1 text-neutral-800">
                  <FontAwesomeIcon
                    icon={item.icon}
                    className="text-[9px] text-neutral-900/60"
                  />
                  {item.label}
                </span>
                <span className="font-bold text-black">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-3xl border border-zinc-800/80 bg-zinc-900/50 p-4">
          <span className="flex items-center gap-2 text-xs font-bold text-zinc-400">
            <FontAwesomeIcon
              icon={["fas", "scale-balanced"]}
              className="text-yellow-500"
            />
            {copy.sentimentLabel}
          </span>
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-zinc-800">
            <div className="h-full w-[68%] bg-emerald-500" />
            <div className="h-full w-[32%] bg-rose-500" />
          </div>
          <div className="flex justify-between text-[11px] font-bold">
            <span className="text-emerald-500">{copy.buyersLabel} (68%)</span>
            <span className="text-rose-500">(32%) {copy.sellersLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
