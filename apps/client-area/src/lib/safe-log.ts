/**
 * Server-log helper. Logging a raw Error prints its stack plus any attached
 * upstream payload (e.g. SgbApiError.errorType), which can carry account data.
 * Log only the error name/kind and a short message instead.
 */
export function describeError(error: unknown): string {
  if (error instanceof Error) {
    const kind = "kind" in error ? `/${String((error as { kind?: unknown }).kind)}` : "";
    const message = error.message.replace(/\s+/g, " ").slice(0, 200);

    return `${error.name}${kind}: ${message}`;
  }

  return typeof error === "string" ? error.slice(0, 200) : typeof error;
}
