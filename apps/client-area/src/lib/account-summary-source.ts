/**
 * Where the Beranda/Transaksi account summary comes from.
 *
 * - `websocket`: SAI stream. Live balance/equity/margin, but no open or settled
 *   positions (the stream does not carry them).
 * - `http`: SGB /etrade/accountsummary polled through the BFF, with the live
 *   price feed moving the figures between polls. Includes positions.
 *
 * Client-safe on purpose (no `process.env`): the env value is read on the server
 * (see `ACCOUNT_SUMMARY_SOURCE` in env.ts) and handed to the browser by
 * ClientAreaAccountSummarySourceProvider.
 */
export type AccountSummarySource = "websocket" | "http";

/** Unset/unknown keeps the HTTP behaviour that production already runs. */
export const DEFAULT_ACCOUNT_SUMMARY_SOURCE: AccountSummarySource = "http";

export function normalizeAccountSummarySource(
  value: string | undefined,
): AccountSummarySource {
  const normalizedValue = value?.trim().toLowerCase();

  if (normalizedValue === "websocket" || normalizedValue === "http") {
    return normalizedValue;
  }

  return DEFAULT_ACCOUNT_SUMMARY_SOURCE;
}
