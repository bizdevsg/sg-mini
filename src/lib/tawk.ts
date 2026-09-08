export const TAWK_CHAT_ENABLE_EVENT = "sgb:tawk-enable";

export const TAWK_CHAT_WIDGET_URL = process.env.NEXT_WIDGET_EMBED_URL ?? "";

export const TAWK_CHAT_WIDGET_ATTRIBUTES = {
  "data-site-id": "solid-gold-main",
  "data-position": "bottom-right",
  "data-language": "id",
} as const;
