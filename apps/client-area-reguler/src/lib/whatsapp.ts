/**
 * wa.me needs the international form without "+" or leading zero. Indonesian
 * numbers are usually written locally (0812…), so a leading 0 becomes 62.
 */
export function toWhatsAppDigits(number: string) {
  const digits = number.replace(/\D/g, "");

  return digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
}

export function buildWhatsAppHref(number: string, text?: string) {
  const base = `https://wa.me/${toWhatsAppDigits(number)}`;

  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
