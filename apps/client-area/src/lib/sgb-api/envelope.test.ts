import assert from "node:assert/strict";
import Module from "node:module";
import path from "node:path";
import { describe, it } from "node:test";

// envelope.ts imports `server-only`, which only Next.js resolves — redirect it
// to the no-op stub the discovery scripts use.
const stubPath = path.resolve(process.cwd(), "scripts", "stubs", "server-only.cjs");
const moduleInternals = Module as unknown as {
  _resolveFilename: (request: string, ...rest: unknown[]) => string;
};
const originalResolveFilename = moduleInternals._resolveFilename;
moduleInternals._resolveFilename = function (request, ...rest) {
  return request === "server-only"
    ? stubPath
    : originalResolveFilename.call(this, request, ...rest);
};

describe("parseSgbEnvelope", async () => {
  const { parseSgbEnvelope } = await import("./envelope");

  it("treats HTTP 200 with headers.statusCode !== 200 as a failure", () => {
    const result = parseSgbEnvelope(200, {
      headers: { statusCode: 400 },
      data: null,
    });

    assert.equal(result.ok, false);
    assert.equal(result.ok === false && result.statusCode, 400);
  });

  it("succeeds only when HTTP 200 and statusCode is 200", () => {
    const result = parseSgbEnvelope(200, {
      headers: { statusCode: 200, message: "ok", customMessage: false },
      data: { value: 1 },
    });

    assert.equal(result.ok, true);
    assert.deepEqual(result.ok && result.data, { value: 1 });
  });

  it("flags an expired session on HTTP 401 and on the documented message", () => {
    const byHttp = parseSgbEnvelope(401, null);
    const byMessage = parseSgbEnvelope(200, {
      headers: { statusCode: 401, message: "Session has been expired" },
    });

    assert.equal(byHttp.ok === false && byHttp.sessionExpired, true);
    assert.equal(byMessage.ok === false && byMessage.sessionExpired, true);
  });
});
