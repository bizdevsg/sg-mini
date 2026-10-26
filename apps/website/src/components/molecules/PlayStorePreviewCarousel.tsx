"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";

type PlayStorePreviewImage = {
  alt: string;
  src: string;
};

type PlayStorePreviewCarouselProps = {
  ariaLabel: string;
  images: PlayStorePreviewImage[];
  nextLabel: string;
  previousLabel: string;
};

export function PlayStorePreviewCarousel({
  ariaLabel,
  images,
  nextLabel,
  previousLabel,
}: PlayStorePreviewCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const pointerStartX = useRef<number | null>(null);

  function navigate(step: -1 | 1) {
    setActiveIndex((currentIndex) => {
      return (currentIndex + step + images.length) % images.length;
    });
  }

  function getRelativePosition(index: number) {
    let difference = index - activeIndex;
    const halfwayPoint = images.length / 2;

    if (difference > halfwayPoint) {
      difference -= images.length;
    } else if (difference < -halfwayPoint) {
      difference += images.length;
    }

    return difference;
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      navigate(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      navigate(1);
    }
  }

  return (
    <div
      aria-label={ariaLabel}
      aria-roledescription="carousel"
      className="relative mx-auto max-w-7xl overflow-hidden px-2 py-6 sm:px-4 sm:py-8"
      onKeyDown={handleKeyDown}
      onPointerDown={(event) => {
        pointerStartX.current = event.clientX;
      }}
      onPointerUp={(event) => {
        if (pointerStartX.current === null) {
          return;
        }

        const movement = event.clientX - pointerStartX.current;
        pointerStartX.current = null;

        if (Math.abs(movement) >= 45) {
          navigate(movement > 0 ? -1 : 1);
        }
      }}
      role="region"
      tabIndex={0}
    >
      <div className="pointer-events-none absolute inset-x-[12%] top-1/2 h-52 -translate-y-1/2 rounded-full bg-yellow-400/10 blur-[90px]" />
      <div className="pointer-events-none absolute inset-x-[20%] bottom-8 h-16 rounded-full bg-black/80 blur-2xl" />

      <div className="relative h-[126vw] min-h-[420px] max-h-[630px] touch-pan-y">
        {images.map((image, index) => {
          const position = getRelativePosition(index);
          const isActive = position === 0;
          const isPrevious = position === -1;
          const isNext = position === 1;
          const isFarPrevious = position === -2;
          const isFarNext = position === 2;
          const isVisible =
            isActive ||
            isPrevious ||
            isNext ||
            isFarPrevious ||
            isFarNext;

          return (
            <div
              key={image.src}
              aria-hidden={!isVisible}
              className={`absolute top-1/2 w-[56vw] max-w-[280px] -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out ${
                isActive
                  ? "left-1/2 z-30 scale-100 opacity-100"
                  : isPrevious
                    ? "left-[27%] z-20 scale-[0.82] opacity-70 sm:left-[31%]"
                    : isNext
                      ? "left-[73%] z-20 scale-[0.82] opacity-70 sm:left-[69%]"
                      : isFarPrevious
                        ? "left-[7%] z-10 scale-[0.62] opacity-35 sm:left-[12%] sm:scale-[0.7]"
                        : isFarNext
                          ? "left-[93%] z-10 scale-[0.62] opacity-35 sm:left-[88%] sm:scale-[0.7]"
                          : "pointer-events-none left-1/2 z-0 scale-50 opacity-0"
              }`}
              role="group"
            >
              <button
                type="button"
                aria-label={isActive ? undefined : image.alt}
                disabled={!isVisible || isActive}
                onClick={() => setActiveIndex(index)}
                className="block w-full cursor-pointer overflow-hidden rounded-[1.75rem] border border-white/15 bg-black shadow-[0_28px_70px_rgba(0,0,0,0.55)] ring-1 ring-black/40 transition hover:border-yellow-400/35 disabled:cursor-default"
              >
                <Image
                  src={image.src}
                  alt={isActive ? image.alt : ""}
                  width={1290}
                  height={2796}
                  sizes="(max-width: 500px) 56vw, 280px"
                  className="h-auto w-full object-contain"
                  preload={index === 0}
                />
              </button>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        aria-label={previousLabel}
        onClick={() => navigate(-1)}
        className="absolute left-4 top-1/2 z-40 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-zinc-950/85 text-white shadow-xl backdrop-blur-md transition hover:scale-105 hover:border-yellow-400/50 hover:text-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 sm:left-8 sm:h-12 sm:w-12"
      >
        <ChevronLeft aria-hidden="true" className="h-5 w-5" />
      </button>

      <button
        type="button"
        aria-label={nextLabel}
        onClick={() => navigate(1)}
        className="absolute right-4 top-1/2 z-40 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-zinc-950/85 text-white shadow-xl backdrop-blur-md transition hover:scale-105 hover:border-yellow-400/50 hover:text-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 sm:right-8 sm:h-12 sm:w-12"
      >
        <ChevronRight aria-hidden="true" className="h-5 w-5" />
      </button>

      <div className="relative z-40 mt-3 flex items-center justify-center gap-2">
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            aria-label={image.alt}
            aria-current={index === activeIndex ? "true" : undefined}
            onClick={() => setActiveIndex(index)}
            className={`h-2 cursor-pointer rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
              index === activeIndex
                ? "w-7 bg-yellow-400"
                : "w-2 bg-white/25 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
