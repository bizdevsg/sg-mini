import { z } from "zod";

/**
 * Schemas written from real UAT samples (docs/api/samples/, gitignored):
 *   GET /etrade/accountsummary → envelope.data = { data: { account, left, right, ... } }
 * Every number arrives as a decimal STRING ("967.7100"); anything missing or
 * unparsable becomes `null` and the UI shows "—" — values are never invented.
 */
function toNumberOrNull(value: unknown): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = typeof value === "number" ? value : Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

// `.optional()` matters: without it zod 4 rejects the whole payload when a key
// is absent, instead of just showing "—" for that one field.
const decimal = z.unknown().optional().transform(toNumberOrNull);

const accountSummaryDataSchema = z.object({
  data: z.object({
    account: z.object({ account: z.string() }),
    right: z.object({
      newBalance: decimal,
      floating: decimal,
      equity: decimal,
      dtm: decimal,
      edtm: decimal,
      equityRatio: decimal,
      cm: decimal,
      al: decimal,
    }),
  }),
});

/** Field names the Beranda account card renders — see parseAccountSummary. */
export type AccountSummaryCard = {
  accountId: string;
  balance: number | null;
  floatingPl: number | null;
  equity: number | null;
  marginRequired: number | null;
  effectiveMargin: number | null;
  equityRatio: number | null;
  callMarginPlace: number | null;
  autoLiquidation: number | null;
};

/**
 * Returns null when the payload does not match the schema, so callers can
 * treat it as an upstream error instead of rendering half-broken data.
 */
export function parseAccountSummary(payload: unknown): AccountSummaryCard | null {
  const parsed = accountSummaryDataSchema.safeParse(payload);

  if (!parsed.success) {
    return null;
  }

  const { account, right } = parsed.data.data;

  return {
    accountId: account.account,
    balance: right.newBalance,
    floatingPl: right.floating,
    equity: right.equity,
    // dtm = margin required; edtm = equity − dtm (verified against the sample).
    marginRequired: right.dtm,
    effectiveMargin: right.edtm,
    equityRatio: right.equityRatio,
    // cm / al look like price levels for `right.product`; shown as-is.
    callMarginPlace: right.cm,
    autoLiquidation: right.al,
  };
}

const openPositionSchema = z.object({
  id: z.union([z.number(), z.string()]),
  productName: z.string(),
  buy: decimal,
  sell: decimal,
  price: decimal,
  closingPrice: decimal,
  profitLoss: decimal,
  lot: decimal,
  commission: decimal,
  vat: decimal,
  storage: decimal,
  orderDate: z.string().optional(),
  time: z.string().optional(),
});

const openPositionsPayloadSchema = z.object({
  data: z.object({ openPositions: z.array(openPositionSchema) }),
});

/** One open position, as shown on the Transaksi page (numbers, not yet formatted). */
export type OpenPositionCard = {
  id: string;
  productName: string;
  side: "buy" | "sell";
  lot: number | null;
  openPrice: number | null;
  currentPrice: number | null;
  profitLoss: number | null;
  storage: number | null;
  commission: number | null;
  vat: number | null;
  orderDate: string | null;
  time: string | null;
};

/**
 * Open positions from the same /etrade/accountsummary payload (`openPositions`).
 * Verified on the UAT sample: the positions' profitLoss values sum exactly to
 * `right.floating`. The side comes from which price column is non-zero (`buy`
 * or `sell`); a row where neither is set has no determinable side and is
 * skipped rather than guessed. Returns null when the payload has no such list.
 */
export function parseOpenPositions(payload: unknown): OpenPositionCard[] | null {
  const parsed = openPositionsPayloadSchema.safeParse(payload);

  if (!parsed.success) {
    return null;
  }

  const positions: OpenPositionCard[] = [];

  for (const row of parsed.data.data.openPositions) {
    const side =
      (row.buy ?? 0) > 0 ? "buy" : (row.sell ?? 0) > 0 ? "sell" : null;

    if (!side) {
      continue;
    }

    positions.push({
      id: String(row.id),
      productName: row.productName,
      side,
      lot: row.lot,
      openPrice: row.price,
      currentPrice: row.closingPrice,
      profitLoss: row.profitLoss,
      storage: row.storage,
      commission: row.commission,
      vat: row.vat,
      orderDate: row.orderDate ?? null,
      time: row.time ?? null,
    });
  }

  return positions;
}

const settledPositionSchema = z.object({
  id: z.union([z.number(), z.string()]),
  productName: z.string(),
  buy: decimal,
  sell: decimal,
  price: decimal,
  closing_price: decimal,
  lot: decimal,
  liquidId: decimal,
  liquidPrice: decimal,
  profitLoss: decimal,
  commission: decimal,
  vat: decimal,
  date: z.string().optional(),
  time: z.string().optional(),
});

const settledPositionsPayloadSchema = z.object({
  data: z.object({ settledPositions: z.array(settledPositionSchema) }),
});

/**
 * A settled (closed) position from `settledPositions`. Each row is the
 * liquidating trade: `liquidId` names the position it closed and `liquidPrice`
 * is that position's price (verified: it equals the closed position's own price
 * in the trade history). `profitLoss`, `commission` and `vat` are the API's own
 * figures — never computed here.
 */
export type SettledPositionCard = {
  id: string;
  productName: string;
  lot: number | null;
  liquidId: number | null;
  openPrice: number | null;
  closePrice: number | null;
  profitLoss: number | null;
  commission: number | null;
  vat: number | null;
  date: string | null;
  time: string | null;
};

export function parseSettledPositions(
  payload: unknown,
): SettledPositionCard[] | null {
  const parsed = settledPositionsPayloadSchema.safeParse(payload);

  if (!parsed.success) {
    return null;
  }

  return parsed.data.data.settledPositions.map((row) => ({
    id: String(row.id),
    productName: row.productName,
    lot: row.lot,
    liquidId: (row.liquidId ?? 0) > 0 ? row.liquidId : null,
    openPrice: row.liquidPrice,
    closePrice: row.closing_price ?? row.price,
    profitLoss: row.profitLoss,
    commission: row.commission,
    vat: row.vat,
    date: row.date ?? null,
    time: row.time ?? null,
  }));
}

const accountListSchema = z.array(
  z.object({ account: z.string(), type: z.string() }),
);

/**
 * First account number in the session's list-account data. Profile data belongs
 * to the person, not to a Demo/Real account, so any of their accounts works as
 * the `customer_id`. Null when the list is missing/unexpected or empty.
 */
export function primaryAccountId(accounts: unknown): string | null {
  const parsed = accountListSchema.safeParse(accounts);

  return parsed.success ? (parsed.data[0]?.account ?? null) : null;
}

/**
 * Whether the customer owns an account of the requested mode, from the
 * list-account data kept in the session. Only "demo" is confirmed as a type
 * value, so "real" means "anything that is not demo". If the list has an
 * unexpected shape this returns true — the upstream call is then the judge.
 */
export function sessionHasAccountForMode(
  accounts: unknown,
  mode: "real" | "demo",
): boolean {
  const parsed = accountListSchema.safeParse(accounts);

  if (!parsed.success) {
    return true;
  }

  return parsed.data.some((entry) =>
    mode === "demo"
      ? entry.type.toLowerCase() === "demo"
      : entry.type.toLowerCase() !== "demo",
  );
}
