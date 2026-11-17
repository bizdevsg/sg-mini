import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getTradePilotPauseReason } from "./trade-pilot-availability";

const base = { enabled: true, modes: {}, instruments: {}, timeframes: {}, message: null };
const input = { instrumentId: "gold", mode: "real" as const, timeframe: "60" };

describe("getTradePilotPauseReason", () => {
  it("mengizinkan analisis bila pengaturan tidak ada atau semua aktif", () => {
    assert.equal(getTradePilotPauseReason(null, input), null);
    assert.equal(getTradePilotPauseReason(base, input), null);
  });

  it("mendahulukan jeda global, lalu mode, instrumen, timeframe", () => {
    assert.equal(getTradePilotPauseReason({ ...base, enabled: false, modes: { real: false } }, input), "global");
    assert.equal(getTradePilotPauseReason({ ...base, modes: { real: false }, instruments: { gold: false } }, input), "mode");
    assert.equal(getTradePilotPauseReason({ ...base, instruments: { gold: false } }, input), "instrument");
    assert.equal(getTradePilotPauseReason({ ...base, timeframes: { "60": false } }, input), "timeframe");
  });

  it("hanya false yang menjeda; true atau tidak diisi berarti aktif", () => {
    assert.equal(getTradePilotPauseReason({ ...base, modes: { demo: false, real: true } }, input), null);
    assert.equal(getTradePilotPauseReason({ ...base, timeframes: { "15": false } }, input), null);
  });
});
