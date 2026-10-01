import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { parseDailyStatementReport } from "./daily-statement";

// Synthetic payload shaped like (and using the numbers of) the real UAT sample.
const payload = (overrides: Record<string, unknown> = {}) => ({
  account: "XAAA0000000",
  aeCode: "AECODE01",
  market_date: "2026-09-30",
  data: [
    {
      dailyStatement: {
        previousBalance: 971.04,
        marginIn: 0,
        marginOut: 0,
        storage: 2.22,
        profitLoss: 0,
        commissionFee: 0,
        vat: 0,
        discount: 0,
        interest: "0",
        adjustment: "0",
        newBalance: 968.82,
        floating: -26.5,
        equity: 942.32,
        dayTradeMargin: 60,
        effectiveDayTradeMargin: 882.32,
        equityRatio: "1570.53",
        market_date: "2026-09-29",
      },
      openPositions: [
        {
          product: "BCO10_BBJ",
          buy: "102.85",
          sell: "0",
          lot: 0.1,
          price: "102.85",
          liquidPrice: "95.55",
          floating: -730,
          storage: 0.555,
          orderDate: "2026-09-18",
          time: "13:42:44",
        },
        {
          product: "XUL10",
          buy: "0",
          sell: "4396.14",
          lot: 0.1,
          price: "4396.14",
          liquidPrice: "4172.82",
          floating: 2198.5,
          storage: 0.555,
          orderDate: "2026-09-18",
          time: "13:41:56",
        },
      ],
      settledPositions: [],
    },
  ],
  ...overrides,
});

describe("parseDailyStatementReport", () => {
  it("maps the statement, using the covered day and the real AE code", () => {
    const report = parseDailyStatementReport(payload());

    assert.ok(report);
    assert.equal(report.accountId, "XAAA0000000");
    assert.equal(report.aeCode, "AECODE01");
    // The statement covers the previous day, not the request day.
    assert.equal(report.statementDate, "2026-09-29");
    assert.equal(report.previousBalance, 971.04);
    assert.equal(report.marginRequired, 60);
    assert.equal(report.effectiveMargin, 882.32);
    assert.equal(report.equityRatio, 1570.53);
    assert.equal(report.interest, 0);
  });

  it("holds together arithmetically", () => {
    const report = parseDailyStatementReport(payload());

    assert.ok(report);
    const round = (value: number) => Math.round(value * 100) / 100;

    assert.equal(
      round(
        (report.previousBalance ?? 0) -
          (report.storage ?? 0) +
          (report.profitLoss ?? 0) -
          (report.commissionFee ?? 0) -
          (report.vat ?? 0),
      ),
      report.newBalance,
    );
    assert.equal(
      round((report.newBalance ?? 0) + (report.floating ?? 0)),
      report.equity,
    );
    assert.equal(
      round((report.equity ?? 0) - (report.marginRequired ?? 0)),
      report.effectiveMargin,
    );
  });

  it("maps positions with side, prices and closing price", () => {
    const report = parseDailyStatementReport(payload());

    assert.ok(report);
    assert.deepEqual(
      report.positions.map((item) => [
        item.productName,
        item.side,
        item.openPrice,
        item.closingPrice,
        item.floating,
      ]),
      [
        ["BCO10_BBJ", "buy", 102.85, 95.55, -730],
        ["XUL10", "sell", 4396.14, 4172.82, 2198.5],
      ],
    );
    assert.equal(report.settledCount, 0);
  });

  it("returns null when there is no statement entry", () => {
    assert.equal(parseDailyStatementReport(payload({ data: [] })), null);
    assert.equal(parseDailyStatementReport(null), null);
  });
});
