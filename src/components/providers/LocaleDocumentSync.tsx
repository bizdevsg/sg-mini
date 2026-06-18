"use client";

import { useEffect } from "react";

import { getLocaleConfig, type AppLocale } from "@/locales";

type LocaleDocumentSyncProps = {
  locale: AppLocale;
};

export function LocaleDocumentSync({ locale }: LocaleDocumentSyncProps) {
  useEffect(() => {
    const html = document.documentElement;
    html.lang = getLocaleConfig(locale).lang;
    html.dataset.locale = locale;
  }, [locale]);

  return null;
}
