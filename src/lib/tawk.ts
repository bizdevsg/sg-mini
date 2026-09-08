export const TAWK_CHAT_ENABLE_EVENT = "sgb:tawk-enable";

// This module is imported by a Client Component, so the URL must use the
// NEXT_PUBLIC_ prefix to be embedded in the browser bundle by Next.js.
export const TAWK_CHAT_WIDGET_URL =
  process.env.NEXT_PUBLIC_WIDGET_EMBED_URL?.trim() ?? "";

export const TAWK_CHAT_WIDGET_ATTRIBUTES = {
  "data-site-id": "solid-gold-main",
  "data-position": "bottom-right",
  "data-language": "id",
} as const;
