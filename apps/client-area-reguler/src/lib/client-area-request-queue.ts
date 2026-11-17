type RequestTask<T> = () => Promise<T>;

// Shared by every tab of the same origin, so a rotation in one tab is applied
// to the cookie jar before another tab sends a request with the old token.
const REQUEST_LOCK_NAME = "sgb-client-area-bff-request";

function runExclusively<T>(task: RequestTask<T>): Promise<T> {
  const locks = typeof navigator === "undefined" ? undefined : navigator.locks;

  // Web Locks is unavailable in some contexts (e.g. insecure origins, older
  // browsers); the per-tab queue below still applies there.
  // The DOM typings wrap an async callback's result in a second Promise, but a
  // returned Promise is flattened at runtime, so the cast is accurate.
  return locks
    ? (locks.request(REQUEST_LOCK_NAME, task) as Promise<T>)
    : task();
}

/**
 * Serializes browser-to-BFF requests that may rotate the MiniMicro token.
 *
 * The upstream API can invalidate the token used by a request as soon as it
 * returns a replacement in the `csrf` header. Waiting for the previous fetch
 * response ensures the browser has applied its Set-Cookie header before the
 * next request is sent. The wait spans all tabs through the Web Locks API;
 * the in-tab chain remains as the fallback when locks are unavailable.
 */
export function createClientAreaRequestQueue() {
  let pending: Promise<void> = Promise.resolve();

  return function enqueue<T>(task: RequestTask<T>): Promise<T> {
    const run = () => runExclusively(task);
    const result = pending.then(run, run);

    // A failed request must not prevent later requests from running.
    pending = result.then(
      () => undefined,
      () => undefined,
    );

    return result;
  };
}

