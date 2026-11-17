import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
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

function makeToken() {
  return [randomUUID(), randomUUID(), randomUUID()].join(".");
}

describe("mmFetch", async () => {
  const { createMmFetch, SessionExpiredError } = await import("./mm-fetch");

  function setup(response: Response) {
    const token = makeToken();
    const rotated: string[] = [];
    let ended = 0;
    const request = createMmFetch({
      fetch: (async () => response) as typeof fetch,
      getSession: async () => ({ account: "A1", isDemo: false, token }),
      rotateToken: async (value: string) => {
        rotated.push(value);
      },
      endSession: async () => {
        ended += 1;
      },
    });

    return { ended: () => ended, request, rotated, token };
  }

  it("rotates the token when csrf is present", async () => {
    const nextToken = makeToken();
    const context = setup(
      Response.json(
        { headers: { statusCode: 200, message: "Success" }, data: { ok: true } },
        { headers: { csrf: nextToken } },
      ),
    );

    await context.request("/etrade/accountsummary");
    assert.deepEqual(context.rotated, [nextToken]);
  });

  it("keeps the current token when csrf is absent", async () => {
    const context = setup(
      Response.json({ headers: { statusCode: 200 }, data: { ok: true } }),
    );
    await context.request("/etrade/accountsummary");
    assert.deepEqual(context.rotated, []);
  });

  it("ends the session and throws on HTTP 401", async () => {
    const context = setup(new Response("Unauthorized", { status: 401 }));
    await assert.rejects(
      context.request("/etrade/accountsummary"),
      SessionExpiredError,
    );
    assert.equal(context.ended(), 1);
  });

  it("ends the session when a 200 body says the session expired", async () => {
    const context = setup(
      Response.json({
        headers: { statusCode: 200 },
        data: { message: "Session has been expired" },
      }),
    );
    await assert.rejects(
      context.request("/etrade/accountsummary"),
      SessionExpiredError,
    );
    assert.equal(context.ended(), 1);
  });
});
