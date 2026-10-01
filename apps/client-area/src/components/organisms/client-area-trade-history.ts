import {
  formatSignedUsd,
  formatUsd,
} from "@/components/organisms/client-area.shared";
import type { TransactionHistoryItem } from "@/components/organisms/client-area.types";
import type { SettledPositionCard } from "@/types/account-summary";
import type { TradeHistoryCard } from "@/types/trade-history";

function formatPrice(value: number | null) {
  // Forex quotes need more than 2 decimals; indices/commodities show 2.
  return value === null
    ? "-"
    : `$ ${value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 5,
      })}`;
}

/**
 * Turns an API trade row into the history card. The rows carry no profit/loss,
 * facility fee or VAT, so those stay unset (the card shows "-"); nothing is
 * computed. A row with a `liquidId` is a liquidation closing that order — its
 * status reads "Liq" and the card points at the order it closed. All other
 * rows are opening orders and read "BUY"/"SELL". The date and time are the
 * API's own `execute_done` split as-is (it names no time zone).
 */
export function toTradeHistoryItem(
  card: TradeHistoryCard,
  settled?: SettledPositionCard,
): TransactionHistoryItem {
  const [date = "-", time = "-"] = (card.executedAt ?? "").split(" ");
  const sideName = card.side === "buy" ? "BUY" : "SELL";
  const isLiquidation = card.liquidId !== null;

  return {
    id: card.id,
    instrument: card.product,
    symbol: card.product,
    statusLabel: isLiquidation ? "Liq" : sideName,
    statusTone: "muted",
    orderNumber: card.id,
    volume: card.lot === null ? "-" : `${card.lot.toFixed(2)} Lot`,
    date: date || "-",
    time: time || "-",
    closeLabel: `${card.side === "buy" ? "Buy" : "Sell"} Price`,
    closePrice: formatPrice(card.price),
    sideLabel: isLiquidation ? `Liq #${card.liquidId}` : "Side",
    sidePrice: isLiquidation ? formatPrice(card.liquidPrice) : sideName,
    // Real figures for a liquidation, matched by id from the account summary's
    // `settledPositions`; rows without a match keep "-" (never computed).
    ...(settled
      ? {
          profitLoss:
            settled.profitLoss === null
              ? undefined
              : formatSignedUsd(settled.profitLoss),
          facilityFee:
            settled.commission === null ? undefined : formatUsd(settled.commission),
          vat: settled.vat === null ? undefined : formatUsd(settled.vat),
        }
      : {}),
  };
}
