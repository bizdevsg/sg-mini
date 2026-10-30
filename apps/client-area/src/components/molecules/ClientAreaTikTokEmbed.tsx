"use client";

import { ExternalLink } from "lucide-react";

import type { TikTokVideo } from "@/lib/tiktok-video.shared";
import type { AppMessages } from "@/locales";

type ClientAreaTikTokEmbedProps = {
  copy: AppMessages["clientArea"]["homeTikTok"];
  video: TikTokVideo;
};

export function ClientAreaTikTokEmbed({
  copy,
  video,
}: ClientAreaTikTokEmbedProps) {
  return (
    <section className="min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/10 p-4 shadow-2xl shadow-black/30 backdrop-blur-sm sm:p-5">
      <div className="mb-4">
        <h2 className="text-base font-bold text-white">{copy.title}</h2>
        <p className="mt-1 text-xs leading-5 text-zinc-400">
          {copy.description}
        </p>
      </div>

      <div className="mx-auto w-full max-w-[360px] overflow-hidden rounded-2xl bg-black ring-1 ring-white/10">
        <iframe
          allow="fullscreen; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="aspect-[9/16] w-full border-0"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          src={video.embedUrl}
          title={copy.frameTitle}
        />
      </div>

      <a
        className="mx-auto mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-bold text-zinc-200 transition hover:border-amber-400/40 hover:bg-amber-400/10 hover:text-amber-300"
        href={video.videoUrl}
        rel="noreferrer"
        target="_blank"
      >
        {copy.openVideoLabel}
        <ExternalLink aria-hidden="true" className="h-4 w-4" />
      </a>
    </section>
  );
}
