import {
  formatSignedUsd,
  formatUsd,
} from "@/components/organisms/client-area.shared";
import type { PositionItem } from "@/components/organisms/client-area.types";
import type { OpenPositionCard } from "@/types/account-summary";

const EMPTY = "—";

export function formatPrice(value: number | null) {
  // Forex quotes need more than 2 decimals; indices/commodities show 2.
  return value === null
    ? EMPTY
    : value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 5,
      });
}

function formatMoney(value: number | null) {
  return value === null ? EMPTY : formatUsd(value);
}

/**
 * Turns an API open position into the card's display strings. A missing value is
 * shown as "—" — never a made-up number. The product name is the only
 * instrument label the API gives (no long name like "Gold"), so it is used for
 * both `symbol` and `instrument`. `orderNumber` is the position `id`, the only
 * identifier in the payload (its `tradeID` is 0). `commission` is shown as
 * "Facility Fee" — the closest match in the payload, not confirmed by SGB.
 */
export function toPositionItem(card: OpenPositionCard): PositionItem {
  const openedAt = [card.orderDate, card.time].filter(Boolean).join(", ");

  return {
    id: card.id,
    symbol: card.productName,
    instrument: card.productName,
    side: card.side,
    orderNumber: card.id,
    volume: card.lot === null ? EMPTY : `${card.lot.toFixed(2)} Lot`,
    openPrice: formatPrice(card.openPrice),
    currentPrice: formatPrice(card.currentPrice),
    floatingPl:
      card.profitLoss === null ? EMPTY : formatSignedUsd(card.profitLoss),
    storageFee: formatMoney(card.storage),
    facilityFee: formatMoney(card.commission),
    vat: formatMoney(card.vat),
    openedAt: openedAt || EMPTY,
  };
}
