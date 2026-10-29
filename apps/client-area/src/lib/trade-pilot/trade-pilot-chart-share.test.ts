import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { chartShareLevels, chartShareSide, selectAnalysisCandles } from "./trade-pilot-chart-share";

const hourly = (count: number, startIso: string) =>
  Array.from({ length: count }, (_, i) => {
    const date = new Date(Date.parse(startIso) + i * 3_600_000).toISOString();
    return { date, open: 100 + i, high: 101 + i, low: 99 + i, close: 100.5 + i };
  });

describe("selectAnalysisCandles", () => {
  it("keeps only candles that closed before the analysis time", () => {
    const candles = hourly(20, "2026-10-28T00:00:00.000Z");
    // Analisis 10:30 -> candle 09:00 (tutup 10:00) masuk, candle 10:00 (tutup 11:00) tidak.
    const result = selectAnalysisCandles(candles, "1h", "2026-10-28T10:30:00.000Z");
    assert.equal(result.length, 10);
    assert.equal(result.at(-1)?.date, "2026-10-28T09:00:00.000Z");
  });

  it("caps the chart at the latest 56 candles", () => {
    const result = selectAnalysisCandles(hourly(100, "2026-10-20T00:00:00.000Z"), "1h", "2026-11-01T00:00:00.000Z");
    assert.equal(result.length, 56);
  });

  it("returns no candles when there are too few or the timeframe is unknown", () => {
    assert.deepEqual(selectAnalysisCandles(hourly(5, "2026-10-28T00:00:00.000Z"), "1h", "2026-10-29T00:00:00.000Z"), []);
    assert.deepEqual(selectAnalysisCandles(hourly(20, "2026-10-28T00:00:00.000Z"), "2h", "2026-10-29T00:00:00.000Z"), []);
  });
});

describe("chartShareSide", () => {
  it("follows the analysis direction", () => {
    assert.equal(chartShareSide("bullish"), "buy");
    assert.equal(chartShareSide("bearish"), "sell");
    assert.equal(chartShareSide("neutral"), "both");
  });
});

describe("chartShareLevels", () => {
  const analysis = {
    buyLevels: { entry: "4172.00", stopLoss: "4152.00", takeProfitOne: "4192.00", takeProfitTwo: "4212.00" },
    sellLevels: { entry: "4148.00", stopLoss: "4168.00", takeProfitOne: "4128.00", takeProfitTwo: "4108.00" },
  } as Parameters<typeof chartShareLevels>[0]["analysis"];

  it("draws four lines for one side and eight for both", () => {
    assert.equal(chartShareLevels({ analysis }, "sell").length, 4);
    assert.equal(chartShareLevels({ analysis }, "both").length, 8);
    assert.ok(chartShareLevels({ analysis }, "sell").every((level) => level.dashed));
  });
});
