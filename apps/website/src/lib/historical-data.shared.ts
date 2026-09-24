/**
 * Helper tanggal yang dipakai bersama oleh client component (filter range di
 * `HistoricalDataBrowser`) dan route export server-side. Tidak boleh meng-import
 * modul `server-only`.
 */

/**
 * Normalisasi nilai tanggal apa pun menjadi kunci `YYYY-MM-DD` yang bisa
 * dibandingkan secara leksikografis. Mengembalikan string kosong jika tidak
 * bisa diparse.
 */
export function toHistoricalDateKey(value: string): string {
  const isoMatch = /^\d{4}-\d{2}-\d{2}/.exec(value.trim());

  if (isoMatch) {
    return isoMatch[0];
  }

  const parsed = new Date(value);

  return Number.isNaN(parsed.getTime())
    ? ""
    : parsed.toISOString().slice(0, 10);
}

/**
 * `true` jika `value` berada di dalam rentang `[from, to]` inklusif. `from`/`to`
 * diharapkan berupa `YYYY-MM-DD`; batas yang kosong/null berarti tak terbatas di
 * sisi tersebut.
 */
export function isWithinHistoricalDateRange(
  value: string,
  from: string | null | undefined,
  to: string | null | undefined,
): boolean {
  if (!from && !to) {
    return true;
  }

  const dateKey = toHistoricalDateKey(value);

  if (!dateKey) {
    return false;
  }

  if (from && dateKey < from) {
    return false;
  }

  if (to && dateKey > to) {
    return false;
  }

  return true;
}
