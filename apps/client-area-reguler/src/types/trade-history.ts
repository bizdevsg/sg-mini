import { z } from "zod";

/**
 * Written from a real UAT sample of GET /etrade/tradehistory/{limit}/{page}:
 *   envelope.data = { data: [ {id, product, buy, sell, price, lot, liquidId,
 *   liquidPrice, execute_done, transaction, ...} ], count }
 * Numbers arrive as decimal strings; anything unparsable becomes null.
 * `transaction` 1/2 are opening orders (sell/buy) and 4 is a liquidation that
 * closes the position named by `liquidId` (`liquidPrice` = that position's price).
 * The rows carry no profit/loss, fee or VAT — the UI shows "-" for those; profit
 * is NOT computed here because the contract multiplier differs per product.
 */
function toNumberOrNull(value: unknown): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = typeof value === "number" ? value : Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

const decimal = z.unknown().optional().transform(toNumberOrNull);

const tradeRowSchema = z.object({
  id: z.union([z.number(), z.string()]),
  product: z.string(),
  buy: decimal,
  sell: decimal,
  price: decimal,
  lot: decimal,
  liquidId: decimal,
  liquidPrice: decimal,
  execute_done: z.string().nullable().optional(),
  date: z.string().nullable().optional(),
});

const tradeHistoryPayloadSchema = z.object({
  data: z.array(tradeRowSchema),
  count: decimal,
});

export type TradeHistoryCard = {
  id: string;
  product: string;
  side: "buy" | "sell";
  lot: number | null;
  price: number | null;
  /** Set when this row is a liquidation closing position `liquidId`. */
  liquidId: number | null;
  liquidPrice: number | null;
  /** "YYYY-MM-DD HH:mm:ss" exactly as the API sends it (no time zone given). */
  executedAt: string | null;
};

export type TradeHistoryPage = {
  items: TradeHistoryCard[];
  total: number | null;
};

/**
 * Returns null when the payload does not match. A row whose side cannot be told
 * (neither `buy` nor `sell` is set) is skipped rather than guessed.
 */
export function parseTradeHistory(payload: unknown): TradeHistoryPage | null {
  const parsed = tradeHistoryPayloadSchema.safeParse(payload);

  if (!parsed.success) {
    return null;
  }

  const items: TradeHistoryCard[] = [];

  for (const row of parsed.data.data) {
    const side =
      (row.buy ?? 0) > 0 ? "buy" : (row.sell ?? 0) > 0 ? "sell" : null;

    if (!side) {
      continue;
    }

    const hasLiquidation = (row.liquidId ?? 0) > 0;

    items.push({
      id: String(row.id),
      product: row.product,
      side,
      lot: row.lot,
      price: row.price,
      liquidId: hasLiquidation ? row.liquidId : null,
      liquidPrice: hasLiquidation ? row.liquidPrice : null,
      executedAt: row.execute_done ?? row.date ?? null,
    });
  }

  return { items, total: parsed.data.count };
}
