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

  it("serializes requests across separate queues through Web Locks", async () => {
    // Two queues stand in for two browser tabs sharing one lock manager.
    let tail: Promise<unknown> = Promise.resolve();
    const fakeLocks = {
      request<T>(_name: string, task: () => Promise<T>) {
        const result = tail.then(task, task);
        tail = result.catch(() => undefined);
        return result;
      },
    };
    const original = Object.getOwnPropertyDescriptor(globalThis, "navigator");
    Object.defineProperty(globalThis, "navigator", {
      configurable: true,
      value: { locks: fakeLocks },
    });

    try {
      const tabA = createClientAreaRequestQueue();
      const tabB = createClientAreaRequestQueue();
      const events: string[] = [];
      let finishA!: () => void;
      const aCanFinish = new Promise<void>((resolve) => {
        finishA = resolve;
      });

      const a = tabA(async () => {
        events.push("a:start");
        await aCanFinish;
        events.push("a:end");
      });
      const b = tabB(async () => {
        events.push("b:start");
      });

      await new Promise((resolve) => setTimeout(resolve, 0));
      assert.deepEqual(events, ["a:start"]);

      finishA();
      await Promise.all([a, b]);
      assert.deepEqual(events, ["a:start", "a:end", "b:start"]);
    } finally {
      if (original) {
        Object.defineProperty(globalThis, "navigator", original);
      } else {
        Reflect.deleteProperty(globalThis, "navigator");
      }
    }
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
