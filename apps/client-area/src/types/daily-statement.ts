import { z } from "zod";

/**
 * Written from a real UAT sample of GET /etrade/dailystatement. This is the
 * previous trading day's CLOSING statement (`market_date` = the day it covers,
 * generated after close) — not the live snapshot of /etrade/accountsummary.
 * envelope.data = { data: [ { dailyStatement, openPositions, settledPositions } ],
 * account, market_date, aeCode }.
 *
 * Verified on the sample: previousBalance − storage + profitLoss − commissionFee
 * − vat = newBalance; newBalance + floating = equity; equity − dayTradeMargin =
 * effectiveDayTradeMargin; and the open positions' `floating` values sum to the
 * statement's `floating`. Numbers can arrive as strings or numbers; anything
 * unparsable becomes null and the page shows "—".
 */
function toNumberOrNull(value: unknown): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = typeof value === "number" ? value : Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

const decimal = z.unknown().optional().transform(toNumberOrNull);

const statementRowSchema = z.object({
  previousBalance: decimal,
  marginIn: decimal,
  marginOut: decimal,
  storage: decimal,
  profitLoss: decimal,
  commissionFee: decimal,
  vat: decimal,
  discount: decimal,
  interest: decimal,
  adjustment: decimal,
  newBalance: decimal,
  floating: decimal,
  equity: decimal,
  dayTradeMargin: decimal,
  effectiveDayTradeMargin: decimal,
  equityRatio: decimal,
  market_date: z.string().nullable().optional(),
});

const positionRowSchema = z.object({
  product: z.string(),
  buy: decimal,
  sell: decimal,
  lot: decimal,
  price: decimal,
  liquidPrice: decimal,
  floating: decimal,
  storage: decimal,
  orderDate: z.string().nullable().optional(),
  time: z.string().nullable().optional(),
});

const dailyStatementPayloadSchema = z.object({
  account: z.string(),
  aeCode: z.string().nullable().optional(),
  market_date: z.string().nullable().optional(),
  data: z
    .array(
      z.object({
        dailyStatement: statementRowSchema,
        openPositions: z.array(positionRowSchema),
        settledPositions: z.array(z.unknown()),
      }),
    )
    .min(1),
});

/** One open position as of the statement's closing (`liquidPrice` = closing price). */
export type StatementPosition = {
  productName: string;
  side: "buy" | "sell";
  lot: number | null;
  openPrice: number | null;
  closingPrice: number | null;
  floating: number | null;
  storage: number | null;
  orderDate: string | null;
  time: string | null;
};

export type DailyStatementReport = {
  accountId: string;
  aeCode: string | null;
  /** The trading day the statement covers, e.g. "2026-09-29". */
  statementDate: string | null;
  previousBalance: number | null;
  marginIn: number | null;
  marginOut: number | null;
  storage: number | null;
  profitLoss: number | null;
  commissionFee: number | null;
  vat: number | null;
  discount: number | null;
  interest: number | null;
  adjustment: number | null;
  newBalance: number | null;
  floating: number | null;
  equity: number | null;
  marginRequired: number | null;
  effectiveMargin: number | null;
  equityRatio: number | null;
  positions: StatementPosition[];
  /** Only counted: the shape of a settled row is unknown (the sample has none). */
  settledCount: number;
};

/**
 * Returns null when the payload does not match. A position whose side cannot be
 * told (neither `buy` nor `sell` is set) is skipped rather than guessed.
 */
export function parseDailyStatementReport(
  payload: unknown,
): DailyStatementReport | null {
  const parsed = dailyStatementPayloadSchema.safeParse(payload);

  if (!parsed.success) {
    return null;
  }

  const { account, aeCode, market_date, data } = parsed.data;
  const [entry] = data;

  if (!entry) {
    return null;
  }

  const { dailyStatement: row } = entry;
  const positions: StatementPosition[] = [];

  for (const position of entry.openPositions) {
    const side =
      (position.buy ?? 0) > 0 ? "buy" : (position.sell ?? 0) > 0 ? "sell" : null;

    if (!side) {
      continue;
    }

    positions.push({
      productName: position.product,
      side,
      lot: position.lot,
      openPrice: position.price,
      closingPrice: position.liquidPrice,
      floating: position.floating,
      storage: position.storage,
      orderDate: position.orderDate ?? null,
      time: position.time ?? null,
    });
  }

  return {
    accountId: account,
    aeCode: aeCode ?? null,
    statementDate: row.market_date ?? market_date ?? null,
    previousBalance: row.previousBalance,
    marginIn: row.marginIn,
    marginOut: row.marginOut,
    storage: row.storage,
    profitLoss: row.profitLoss,
    commissionFee: row.commissionFee,
    vat: row.vat,
    discount: row.discount,
    interest: row.interest,
    adjustment: row.adjustment,
    newBalance: row.newBalance,
    floating: row.floating,
    equity: row.equity,
    marginRequired: row.dayTradeMargin,
    effectiveMargin: row.effectiveDayTradeMargin,
    equityRatio: row.equityRatio,
    positions,
    settledCount: entry.settledPositions.length,
  };
}
