import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { parseTradeHistory } from "./trade-history";

// Synthetic rows shaped like the real UAT sample of /etrade/tradehistory.
const row = (overrides: Record<string, unknown>) => ({
  id: 1,
  product: "XUL10",
  buy: "0",
  sell: "0",
  price: "0",
  lot: 0.1,
  liquidId: 0,
  liquidPrice: "0",
  execute_done: "2026-09-30 11:17:15",
  date: "2026-09-30 11:17:15",
  transaction: 1,
  ...overrides,
});

const payload = (data: unknown[], count = data.length) => ({ data, count });

describe("parseTradeHistory", () => {
  it("maps an opening order (no liquidation) with its side and price", () => {
    const page = parseTradeHistory(
      payload([row({ id: 301, sell: "4179.23", price: "4179.23" })]),
    );

    assert.ok(page);
    assert.deepEqual(page.items[0], {
      id: "301",
      product: "XUL10",
      side: "sell",
      lot: 0.1,
      price: 4179.23,
      liquidId: null,
      liquidPrice: null,
      executedAt: "2026-09-30 11:17:15",
    });
  });

  it("keeps the closed order reference on a liquidation row", () => {
    const page = parseTradeHistory(
      payload([
        row({
          id: 306,
          buy: "4176.21",
          price: "4176.21",
          liquidId: 222,
          liquidPrice: "4396.14",
          transaction: 4,
        }),
      ]),
    );

    assert.ok(page);
    assert.equal(page.items[0]?.side, "buy");
    assert.equal(page.items[0]?.liquidId, 222);
    assert.equal(page.items[0]?.liquidPrice, 4396.14);
  });

  it("skips rows without a determinable side and reports the total", () => {
    const page = parseTradeHistory(
      payload([row({ id: 1 }), row({ id: 2, buy: "10", price: "10" })], 7),
    );

    assert.deepEqual(page?.items.map((item) => item.id), ["2"]);
    assert.equal(page?.total, 7);
  });

  it("returns null for a payload that is not a trade list", () => {
    assert.equal(parseTradeHistory(null), null);
    assert.equal(parseTradeHistory({ data: "nope" }), null);
  });
});
