import Link from "next/link";

import type { AppLocale } from "@/locales";

type TradePilotWebviewPageProps = {
  locale: AppLocale;
};

export function TradePilotWebviewPage({
  locale,
}: TradePilotWebviewPageProps) {
  return (
    <section className="relative h-[100dvh] w-full overflow-hidden bg-black">
      <h1 className="sr-only">Trade Pilot Webview</h1>
      <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center justify-center rounded-full border border-white/12 bg-black/70 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition hover:border-yellow-500/30 hover:text-yellow-300"
        >
          Back to Home
        </Link>
      </div>
      <iframe
        src="https://tradepilot.id/"
        title="Trade Pilot Webview"
        className="h-full w-full border-0"
        loading="eager"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="clipboard-read; clipboard-write"
      />
    </section>
  );
}
