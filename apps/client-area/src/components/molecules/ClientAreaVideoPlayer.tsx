"use client";

import { Maximize, Minimize, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ClientAreaVideoPlayerLabels = {
  fullscreen: string;
  mute: string;
  pause: string;
  play: string;
  seek: string;
  unmute: string;
};

type ClientAreaVideoPlayerProps = {
  label: string;
  labels: ClientAreaVideoPlayerLabels;
  onError?: () => void;
  src: string;
};

type WebkitVideoElement = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void;
};

const CONTROL_BUTTON_CLASS =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/55 text-white ring-1 ring-white/15 backdrop-blur transition hover:bg-amber-400 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const rest = Math.floor(seconds % 60);

  return `${minutes}:${rest.toString().padStart(2, "0")}`;
}

/**
 * `video.duration` is Infinity for some servers (no Content-Length/range
 * support) and the metadata event can fire before React attaches its handlers,
 * so fall back to the end of the seekable range.
 */
function readDuration(video: HTMLVideoElement) {
  if (Number.isFinite(video.duration) && video.duration > 0) {
    return video.duration;
  }

  const { seekable } = video;

  if (seekable.length > 0) {
    const end = seekable.end(seekable.length - 1);

    if (Number.isFinite(end) && end > 0) {
      return end;
    }
  }

  return 0;
}

/**
 * Custom player for a direct video file: starts muted and loops (browsers only
 * allow autoplay while muted), unless the visitor prefers reduced motion. The
 * native controls are replaced by round buttons and a progress bar.
 */
export function ClientAreaVideoPlayer({
  label,
  labels,
  onError,
  src,
}: ClientAreaVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    // `muted` as a React prop is not reliably reflected before playback starts.
    video.muted = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    video.play().catch(() => {
      // Autoplay refused: the big play button stays visible.
    });
  }, [src]);

  useEffect(() => {
    const onFullscreenChange = () =>
      setFullscreen(document.fullscreenElement === containerRef.current);

    document.addEventListener("fullscreenchange", onFullscreenChange);

    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  function togglePlay() {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }

  function toggleMute() {
    const video = videoRef.current;

    if (video) {
      video.muted = !video.muted;
    }
  }

  function seek(value: string) {
    const video = videoRef.current;
    const next = Number(value);

    if (video && Number.isFinite(next)) {
      video.currentTime = next;
      setCurrentTime(next);
    }
  }

  function toggleFullscreen() {
    const container = containerRef.current;
    const video = videoRef.current as WebkitVideoElement | null;

    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else if (container?.requestFullscreen) {
      void container.requestFullscreen();
    } else {
      // iOS Safari only supports fullscreen on the video element itself.
      video?.webkitEnterFullscreen?.();
    }
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className="group relative aspect-[9/16] w-full overflow-hidden bg-black"
      ref={containerRef}
    >
      <video
        aria-label={label}
        className="absolute inset-0 h-full w-full cursor-pointer bg-black object-contain"
        loop
        muted
        onClick={togglePlay}
        onDurationChange={(event) =>
          setDuration(readDuration(event.currentTarget))
        }
        onError={onError}
        onLoadedMetadata={(event) =>
          setDuration(readDuration(event.currentTarget))
        }
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
        onProgress={(event) => setDuration(readDuration(event.currentTarget))}
        onTimeUpdate={(event) => {
          setCurrentTime(event.currentTarget.currentTime);
          // Self-heals when the metadata event fired before hydration.
          setDuration(readDuration(event.currentTarget));
        }}
        onVolumeChange={(event) => setMuted(event.currentTarget.muted)}
        playsInline
        preload="metadata"
        ref={videoRef}
        src={src}
      />

      {!playing ? (
        <button
          aria-label={labels.play}
          className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-amber-400 text-black shadow-xl shadow-black/50 ring-4 ring-amber-400/30 transition hover:scale-105 hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-amber-200"
          onClick={togglePlay}
          type="button"
        >
          <Play aria-hidden="true" className="ml-1 h-7 w-7 fill-current" />
        </button>
      ) : null}

      <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-linear-to-t from-black/85 via-black/40 to-transparent px-3 pb-3 pt-10">
        <button
          aria-label={playing ? labels.pause : labels.play}
          className={CONTROL_BUTTON_CLASS}
          onClick={togglePlay}
          type="button"
        >
          {playing ? (
            <Pause aria-hidden="true" className="h-4 w-4 fill-current" />
          ) : (
            <Play aria-hidden="true" className="ml-0.5 h-4 w-4 fill-current" />
          )}
        </button>

        <input
          aria-label={labels.seek}
          className="h-1.5 min-w-0 flex-1 cursor-pointer appearance-none rounded-full [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-amber-300 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-300"
          max={duration || 0}
          min={0}
          onChange={(event) => seek(event.target.value)}
          step="any"
          style={{
            background: `linear-gradient(to right, #fbbf24 ${progress}%, rgba(255,255,255,0.25) ${progress}%)`,
          }}
          type="range"
          value={Math.min(currentTime, duration || 0)}
        />

        <span className="shrink-0 text-[11px] font-semibold tabular-nums text-zinc-200">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        <button
          aria-label={muted ? labels.unmute : labels.mute}
          className={CONTROL_BUTTON_CLASS}
          onClick={toggleMute}
          type="button"
        >
          {muted ? (
            <VolumeX aria-hidden="true" className="h-4 w-4" />
          ) : (
            <Volume2 aria-hidden="true" className="h-4 w-4" />
          )}
        </button>

        <button
          aria-label={labels.fullscreen}
          className={CONTROL_BUTTON_CLASS}
          onClick={toggleFullscreen}
          type="button"
        >
          {fullscreen ? (
            <Minimize aria-hidden="true" className="h-4 w-4" />
          ) : (
            <Maximize aria-hidden="true" className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}
