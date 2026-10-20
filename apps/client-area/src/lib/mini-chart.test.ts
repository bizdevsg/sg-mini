import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { describe, it } from "node:test";

import {
  buildChartUrl,
  buildChartUrlResponse,
  resolveMiniChartSymbol,
} from "./mini-chart";

function makeToken() {
  return [randomUUID(), randomUUID(), randomUUID()].join(".");
}

describe("buildChartUrl", () => {
  it("maps BBJ index quote symbols to MiniMicro chart symbols", () => {
    assert.equal(resolveMiniChartSymbol("HKK50_BBJ"), "HKK");
    assert.equal(resolveMiniChartSymbol("JPK50_BBJ"), "JPK");
    assert.equal(resolveMiniChartSymbol("XUL10"), "XUL10");

    const url = new URL(
      buildChartUrl({
        account: "A1",
        isDemo: false,
        symbol: "HKK50_BBJ",
        token: makeToken(),
      }),
    );

    assert.equal(url.searchParams.get("symbol"), "HKK");
  });

  it("selects the live and demo domains", () => {
    const token = makeToken();
    assert.equal(
      new URL(buildChartUrl({ account: "A1", isDemo: false, token })).origin,
      "https://minichart.sgberjangka.com",
    );
    assert.equal(
      new URL(buildChartUrl({ account: "A1", isDemo: true, token })).origin,
      "https://demominichart.sgberjangka.com",
    );
  });

  it("uses defaults, encodes them, and preserves the required parameter order", () => {
    const previousVersion = process.env.MM_CHART_VERSION_APP;
    const previousDevice = process.env.MM_CHART_TYPE_DEVICE;
    delete process.env.MM_CHART_VERSION_APP;
    delete process.env.MM_CHART_TYPE_DEVICE;
    const token = makeToken();
    const result = buildChartUrl({ account: "A1", isDemo: false, token });
    const url = new URL(result);

    assert.equal(url.searchParams.get("version_app"), "1.30.10 (259)");
    assert.equal(url.searchParams.get("type_device"), "Web - ClientArea");
    assert.match(result, /version_app=1\.30\.10\+%28259%29/);
    assert.deepEqual([...url.searchParams.keys()], [
      "account",
      "version_app",
      "symbol",
      "type_device",
      "type",
      "token",
    ]);
    if (previousVersion === undefined) {
      delete process.env.MM_CHART_VERSION_APP;
    } else {
      process.env.MM_CHART_VERSION_APP = previousVersion;
    }
    if (previousDevice === undefined) {
      delete process.env.MM_CHART_TYPE_DEVICE;
    } else {
      process.env.MM_CHART_TYPE_DEVICE = previousDevice;
    }
  });
});

describe("GET /api/chart-url", () => {
  it("returns 401 without a session", async () => {
    const response = buildChartUrlResponse(
      new Request("https://portal.example/api/chart-url"),
      null,
    );
    assert.equal(response.status, 401);
    assert.deepEqual(await response.json(), { error: "SESSION_EXPIRED" });
  });

  it("returns 400 for an invalid symbol", () => {
    const response = buildChartUrlResponse(
      new Request("https://portal.example/api/chart-url?symbol=BAD%20SYMBOL"),
      { account: "A1", isDemo: false, token: makeToken() },
    );
    assert.equal(response.status, 400);
  });

  it("returns a URL containing the current server-side token", async () => {
    const token = makeToken();
    const response = buildChartUrlResponse(
      new Request("https://portal.example/api/chart-url?symbol=XUL10"),
      { account: "A1", isDemo: false, token },
    );
    const payload = (await response.json()) as { url: string };

    assert.equal(response.status, 200);
    assert.equal(new URL(payload.url).searchParams.get("token"), token);
    assert.equal(response.headers.get("Cache-Control"), "private, no-store, max-age=0");
  });
});
