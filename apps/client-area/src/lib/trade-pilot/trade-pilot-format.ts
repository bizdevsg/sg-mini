/** Waktu analisis untuk nasabah: "28 Okt 2026, 14.18 WIB" (selalu zona Jakarta). */
export function formatTradePilotDateTime(value: string, locale: "id" | "en") {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const formatted = new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "id-ID", {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
  return `${formatted} WIB`;
}
