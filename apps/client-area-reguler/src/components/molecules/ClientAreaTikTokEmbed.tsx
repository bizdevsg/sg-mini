"use client";

import { ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playerReadyRef = useRef(false);
  const [playerFailed, setPlayerFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    function handlePlayerMessage(event: MessageEvent) {
      if (event.origin !== "https://www.tiktok.com" || event.source !== iframeRef.current?.contentWindow) return;
      const message = event.data;
      if (!message || typeof message !== "object" || message["x-tiktok-player"] !== true) return;
      if (message.type === "onPlayerReady") {
        playerReadyRef.current = true;
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      } else if (message.type === "onPlayerError" || message.type === "onError") {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
        setPlayerFailed(true);
      }
    }
    window.addEventListener("message", handlePlayerMessage);
    return () => {
      window.removeEventListener("message", handlePlayerMessage);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    };
  }, [attempt, video.embedUrl]);

  function startPlayerTimeout() {
    if (playerReadyRef.current) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setPlayerFailed(true), 10000);
  }

  return (
    <section className="min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/10 p-4 shadow-2xl shadow-black/30 backdrop-blur-sm sm:p-5">
      <div className="mb-4">
        <h2 className="text-base font-bold text-white">{copy.title}</h2>
        <p className="mt-1 text-xs leading-5 text-zinc-400">
          {copy.description}
        </p>
      </div>

      <div className="mx-auto w-full max-w-[360px] overflow-hidden rounded-2xl bg-black ring-1 ring-white/10">
        {playerFailed ? (
          <div className="flex aspect-[9/16] flex-col items-center justify-center gap-4 px-6 text-center" role="status">
            <p className="text-sm text-zinc-300">{copy.playerUnavailable}</p>
            <button type="button" className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:border-amber-400/60" onClick={() => { playerReadyRef.current = false; setPlayerFailed(false); setAttempt((value) => value + 1); }}>
              {copy.retryPlayer}
            </button>
          </div>
        ) : video.directVideoUrl ? (
          <video
            key={attempt}
            className="aspect-[9/16] w-full bg-black object-contain"
            controls
            playsInline
            preload="metadata"
            src={video.directVideoUrl}
            aria-label={copy.frameTitle}
            onError={() => setPlayerFailed(true)}
          />
        ) : (
        <iframe
          key={attempt}
          ref={iframeRef}
          allow="fullscreen; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="aspect-[9/16] w-full border-0"
          loading="lazy"
          onLoad={startPlayerTimeout}
          referrerPolicy="strict-origin-when-cross-origin"
          src={video.embedUrl}
          title={copy.frameTitle}
        />
        )}
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
