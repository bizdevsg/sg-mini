"use client";

import { ExternalLink, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { ClientAreaVideoPlayer } from "@/components/molecules/ClientAreaVideoPlayer";
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
      if (
        event.origin !== "https://www.tiktok.com" ||
        event.source !== iframeRef.current?.contentWindow
      )
        return;
      const message = event.data;
      if (
        !message ||
        typeof message !== "object" ||
        message["x-tiktok-player"] !== true
      )
        return;
      if (message.type === "onPlayerReady") {
        playerReadyRef.current = true;
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      } else if (
        message.type === "onPlayerError" ||
        message.type === "onError"
      ) {
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
    <section className="min-w-0 overflow-hidden rounded-2xl border border-yellow-400/20 bg-[#0a0a0b] p-3 shadow-xl shadow-black/30">
      <div className="flex items-center gap-3 pb-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-yellow-400/20 bg-yellow-400/10 text-yellow-400">
          <Play aria-hidden="true" className="ml-0.5 h-4 w-4 fill-current" />
        </span>
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-white">{copy.title}</h2>
          <p className="text-xs leading-4 text-zinc-400">{copy.description}</p>
        </div>
      </div>

      <div className="w-full overflow-hidden rounded-xl bg-black ring-1 ring-white/10">
        {playerFailed ? (
          <div
            className="flex aspect-[9/16] flex-col items-center justify-center gap-4 px-6 text-center"
            role="status"
          >
            <p className="text-sm text-zinc-300">{copy.playerUnavailable}</p>
            <button
              type="button"
              className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:border-amber-400/60"
              onClick={() => {
                playerReadyRef.current = false;
                setPlayerFailed(false);
                setAttempt((value) => value + 1);
              }}
            >
              {copy.retryPlayer}
            </button>
          </div>
        ) : video.directVideoUrl ? (
          <ClientAreaVideoPlayer
            key={attempt}
            label={copy.frameTitle}
            labels={{
              fullscreen: copy.fullscreenLabel,
              mute: copy.muteLabel,
              pause: copy.pauseLabel,
              play: copy.playLabel,
              seek: copy.seekLabel,
              unmute: copy.unmuteLabel,
            }}
            onError={() => setPlayerFailed(true)}
            src={video.directVideoUrl}
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
        className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-yellow-400/20 bg-yellow-400/10 px-4 py-2.5 text-xs font-bold text-yellow-300 transition hover:border-yellow-400/40 hover:bg-yellow-400/20 hover:text-yellow-200"
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
