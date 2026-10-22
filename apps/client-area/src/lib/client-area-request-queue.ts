type RequestTask<T> = () => Promise<T>;

/**
 * Serializes browser-to-BFF requests that may rotate the MiniMicro token.
 *
 * The upstream API can invalidate the token used by a request as soon as it
 * returns a replacement in the `csrf` header. Waiting for the previous fetch
 * response ensures the browser has applied its Set-Cookie header before the
 * next request is sent.
 */
export function createClientAreaRequestQueue() {
  let pending: Promise<void> = Promise.resolve();

  return function enqueue<T>(task: RequestTask<T>): Promise<T> {
    const result = pending.then(task, task);

    // A failed request must not prevent later requests from running.
    pending = result.then(
      () => undefined,
      () => undefined,
    );

    return result;
  };
}

