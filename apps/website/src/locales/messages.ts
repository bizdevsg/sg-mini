import type { AppLocale } from "./config";
import { enMessages } from "./en/messages";
import { idMessages } from "./id/messages";
import type { AppMessages } from "./shared/messages";

export type { AppMessages } from "./shared/messages";

export const messages: Record<AppLocale, AppMessages> = {
  id: idMessages,
  en: enMessages,
};
