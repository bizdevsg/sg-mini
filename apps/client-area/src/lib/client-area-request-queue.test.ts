import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createClientAreaRequestQueue } from "./client-area-request-queue";

describe("client area request queue", () => {
  it("waits for a rotating request before starting the next request", async () => {
    const enqueue = createClientAreaRequestQueue();
    const events: string[] = [];
    let finishFirst!: () => void;
    const firstCanFinish = new Promise<void>((resolve) => {
      finishFirst = resolve;
    });

    const first = enqueue(async () => {
      events.push("first:start");
      await firstCanFinish;
      events.push("first:end");
      return "first";
    });
    const second = enqueue(async () => {
      events.push("second:start");
      return "second";
    });

    await Promise.resolve();
    assert.deepEqual(events, ["first:start"]);

    finishFirst();
    assert.deepEqual(await Promise.all([first, second]), ["first", "second"]);
    assert.deepEqual(events, ["first:start", "first:end", "second:start"]);
  });

  it("continues the queue after a request fails", async () => {
    const enqueue = createClientAreaRequestQueue();
    const expectedError = new Error("expired");
    const first = enqueue(async () => {
      throw expectedError;
    });
    const second = enqueue(async () => "recovered");

    await assert.rejects(first, expectedError);
    assert.equal(await second, "recovered");
  });
});
