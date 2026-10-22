import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { resolveAvailableClientAreaAccountMode } from "./client-area-account-mode";

describe("resolveAvailableClientAreaAccountMode", () => {
  it("keeps the saved mode when its account exists", () => {
    assert.equal(
      resolveAvailableClientAreaAccountMode("demo", {
        demo: "DEMO-1",
        real: "REAL-1",
      }),
      "demo",
    );
  });

  it("falls back to a real account when the saved demo account is unavailable", () => {
    assert.equal(
      resolveAvailableClientAreaAccountMode("demo", {
        demo: null,
        real: "REAL-1",
      }),
      "real",
    );
  });

  it("falls back to a demo account when the saved real account is unavailable", () => {
    assert.equal(
      resolveAvailableClientAreaAccountMode("real", {
        demo: "DEMO-1",
        real: null,
      }),
      "demo",
    );
  });
});

