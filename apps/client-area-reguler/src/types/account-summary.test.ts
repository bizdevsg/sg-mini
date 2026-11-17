import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  parseAccountSummary,
  parseOpenPositions,
  parseSettledPositions,
  sessionHasAccountForMode,
} from "./account-summary";

// Synthetic payload shaped like the real UAT sample (decimal strings).
const summaryPayload = (right: Record<string, unknown>) => ({
  data: {
    account: { account: "XAAA0000000" },
    right,
  },
});

const fullRight = {
  newBalance: "967.7100",
  floating: "37.6000",
  equity: "1005.3100",
  dtm: "160.0000",
  edtm: "845.3100",
  equityRatio: "628.32",
  cm: "4262.16",
  al: "4268.56",
};

describe("parseAccountSummary", () => {
  it("maps SGB field names to the account card fields", () => {
    assert.deepEqual(parseAccountSummary(summaryPayload(fullRight)), {
      accountId: "XAAA0000000",
      balance: 967.71,
      floatingPl: 37.6,
      equity: 1005.31,
      marginRequired: 160,
      effectiveMargin: 845.31,
      equityRatio: 628.32,
      callMarginPlace: 4262.16,
      autoLiquidation: 4268.56,
    });
  });

  it("turns missing or unparsable numbers into null instead of inventing them", () => {
    const { cm: _cm, ...withoutCm } = fullRight;
    const card = parseAccountSummary(
      summaryPayload({ ...withoutCm, al: "not-a-number", floating: "" }),
    );

    assert.ok(card);
    assert.equal(card.callMarginPlace, null);
    assert.equal(card.autoLiquidation, null);
    assert.equal(card.floatingPl, null);
    assert.equal(card.balance, 967.71);
  });

  it("returns null when the payload does not have the expected shape", () => {
    assert.equal(parseAccountSummary(null), null);
    assert.equal(parseAccountSummary({ data: {} }), null);
  });
});

describe("parseOpenPositions", () => {
  const position = (overrides: Record<string, unknown>) => ({
    id: 1,
    productName: "XUL10",
    buy: "0",
    sell: "0",
    price: "4396.19",
    closingPrice: "4172.42",
    profitLoss: "0.0000",
    lot: 0.1,
    commission: "1.0000",
    vat: "0.1100",
    storage: "0.0000",
    orderDate: "2026-09-18",
    time: "13:41:20",
    ...overrides,
  });
  const payload = (openPositions: unknown[]) => ({ data: { openPositions } });

  it("derives the side from whichever price column is non-zero", () => {
    const positions = parseOpenPositions(
      payload([
        position({ id: 221, buy: "4396.19", profitLoss: "-2237.7000" }),
        position({ id: 222, sell: "4396.14", profitLoss: "2233.2000" }),
      ]),
    );

    assert.ok(positions);
    assert.deepEqual(
      positions.map((item) => [item.id, item.side]),
      [
        ["221", "buy"],
        ["222", "sell"],
      ],
    );
    assert.equal(positions[0]?.profitLoss, -2237.7);
    assert.equal(positions[0]?.openPrice, 4396.19);
    assert.equal(positions[0]?.currentPrice, 4172.42);
  });

  it("skips a row whose side cannot be determined instead of guessing", () => {
    const positions = parseOpenPositions(
      payload([position({ id: 9 }), position({ id: 10, sell: "1.5" })]),
    );

    assert.deepEqual(positions?.map((item) => item.id), ["10"]);
  });

  it("returns null when the payload has no openPositions list", () => {
    assert.equal(parseOpenPositions({ data: {} }), null);
    assert.equal(parseOpenPositions(null), null);
  });
});

describe("parseSettledPositions", () => {
  it("maps a liquidation row and points at the position it closed", () => {
    const positions = parseSettledPositions({
      data: {
        settledPositions: [
          {
            id: 305,
            productName: "XUL10",
            buy: "4176.63",
            sell: "0",
            price: "4176.63",
            closing_price: "4176.63",
            lot: 0.1,
            liquidId: 301,
            liquidPrice: "4179.23",
            profitLoss: "26.0000",
            commission: "2.0000",
            vat: "0.2200",
            date: "2026-09-30",
            time: "11:16:12",
          },
        ],
      },
    });

    assert.deepEqual(positions?.[0], {
      id: "305",
      productName: "XUL10",
      lot: 0.1,
      liquidId: 301,
      openPrice: 4179.23,
      closePrice: 4176.63,
      profitLoss: 26,
      commission: 2,
      vat: 0.22,
      date: "2026-09-30",
      time: "11:16:12",
    });
  });

  it("returns null when there is no settledPositions list", () => {
    assert.equal(parseSettledPositions({ data: {} }), null);
  });
});

describe("sessionHasAccountForMode", () => {
  it("only finds the demo account for a demo-only customer", () => {
    const accounts = [{ account: "XAAA0000000", type: "demo" }];

    assert.equal(sessionHasAccountForMode(accounts, "demo"), true);
    assert.equal(sessionHasAccountForMode(accounts, "real"), false);
  });

  it("does not block when the list has an unexpected shape", () => {
    assert.equal(sessionHasAccountForMode(null, "real"), true);
    assert.equal(sessionHasAccountForMode({ unexpected: true }, "real"), true);
  });
});
