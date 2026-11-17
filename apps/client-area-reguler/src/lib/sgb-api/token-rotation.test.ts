import assert from "node:assert/strict";
import Module from "node:module";
import path from "node:path";
import { describe, it } from "node:test";

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

describe("extractRotatedSgbToken", async () => {
  const { extractRotatedSgbToken } = await import("./token-rotation");

  it("accepts a JWT-shaped token from the case-insensitive csrf header", () => {
    const headers = new Headers({ CsRf: "  header.payload.signature  " });

    assert.equal(
      extractRotatedSgbToken(headers),
      "header.payload.signature",
    );
  });

  it("rejects missing and non-JWT csrf values", () => {
    assert.equal(extractRotatedSgbToken(new Headers()), undefined);
    assert.equal(
      extractRotatedSgbToken(new Headers({ csrf: "opaque-csrf-value" })),
      undefined,
    );
  });
});
