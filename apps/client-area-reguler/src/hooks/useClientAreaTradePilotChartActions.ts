"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type UseClientAreaTradePilotChartActionsOptions = {
  captureFailedMessage: string;
  captureUnsupportedMessage: string;
  fileLabel: string;
  fullscreenUnsupportedMessage: string;
};

function waitForVideo(video: HTMLVideoElement) {
  if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    video.addEventListener("loadedmetadata", () => resolve(), { once: true });
    video.addEventListener("error", () => reject(video.error), { once: true });
  });
}

function createDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function useClientAreaTradePilotChartActions({
  captureFailedMessage,
  captureUnsupportedMessage,
  fileLabel,
  fullscreenUnsupportedMessage,
}: UseClientAreaTradePilotChartActionsOptions) {
  const panelRef = useRef<HTMLElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === panelRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const panel = panelRef.current;

    if (!panel || !document.fullscreenEnabled) {
      window.alert(fullscreenUnsupportedMessage);
      return;
    }

    try {
      if (document.fullscreenElement === panel) {
        await document.exitFullscreen();
        return;
      }

      await panel.requestFullscreen();
    } catch {
      window.alert(fullscreenUnsupportedMessage);
    }
  }, [fullscreenUnsupportedMessage]);

  const captureChart = useCallback(async () => {
    const panel = panelRef.current;
    const getDisplayMedia = navigator.mediaDevices?.getDisplayMedia;

    if (!panel || !getDisplayMedia) {
      window.alert(captureUnsupportedMessage);
      return;
    }

    setIsCapturing(true);
    let stream: MediaStream | null = null;

    try {
      stream = await getDisplayMedia.call(navigator.mediaDevices, {
        audio: false,
        video: {
          displaySurface: "browser",
        },
        preferCurrentTab: true,
        selfBrowserSurface: "include",
      } as DisplayMediaStreamOptions);

      const video = document.createElement("video");
      video.muted = true;
      video.playsInline = true;
      video.srcObject = stream;
      await waitForVideo(video);
      await video.play();
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      );

      const rect = panel.getBoundingClientRect();
      const scaleX = video.videoWidth / window.innerWidth;
      const scaleY = video.videoHeight / window.innerHeight;
      const sourceX = Math.max(0, rect.left * scaleX);
      const sourceY = Math.max(0, rect.top * scaleY);
      const sourceWidth = Math.min(
        video.videoWidth - sourceX,
        rect.width * scaleX,
      );
      const sourceHeight = Math.min(
        video.videoHeight - sourceY,
        rect.height * scaleY,
      );
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(sourceWidth));
      canvas.height = Math.max(1, Math.round(sourceHeight));
      const context = canvas.getContext("2d");

      if (!context) throw new Error("Canvas context is unavailable");

      context.drawImage(
        video,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        canvas.width,
        canvas.height,
      );

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png"),
      );

      if (!blob) throw new Error("Chart capture could not be encoded");

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const safeLabel = fileLabel.replace(/[^a-z0-9-]+/gi, "-").toLowerCase();
      createDownload(blob, `${safeLabel}-${timestamp}.png`);
    } catch (error) {
      const wasCancelled =
        error instanceof DOMException &&
        (error.name === "NotAllowedError" || error.name === "AbortError");

      if (!wasCancelled) {
        window.alert(captureFailedMessage);
      }
    } finally {
      stream?.getTracks().forEach((track) => track.stop());
      setIsCapturing(false);
    }
  }, [captureFailedMessage, captureUnsupportedMessage, fileLabel]);

  return {
    captureChart,
    isCapturing,
    isFullscreen,
    panelRef,
    toggleFullscreen,
  };
}
