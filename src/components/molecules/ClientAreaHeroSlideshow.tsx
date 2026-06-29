"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Dispatch, SetStateAction } from "react";

import { ClientAreaHeroGraphic } from "@/components/atoms/ClientAreaHeroGraphic";
import type { ClientAreaHeroSlide } from "@/components/organisms/client-area.types";

type ClientAreaHeroSlideshowProps = {
  currentSlide: number;
  setCurrentSlide: Dispatch<SetStateAction<number>>;
  slides: ClientAreaHeroSlide[];
};

export function ClientAreaHeroSlideshow({
  currentSlide,
  setCurrentSlide,
  slides,
}: ClientAreaHeroSlideshowProps) {
  if (!slides.length) {
    return null;
  }

  const safeCurrentSlide =
    ((currentSlide % slides.length) + slides.length) % slides.length;

  return (
    <div className="relative min-h-[220px] overflow-hidden rounded-3xl bg-zinc-950 shadow-xl shadow-yellow-500/10 md:min-h-[260px]">
      {slides.map((slide, index) => {
        const isActive = index === safeCurrentSlide;
        const hasImage = Boolean(slide.imageUrl);

        return (
          <article
            key={slide.id}
            className={`absolute inset-0 transition-all duration-500 ${isActive
              ? "translate-x-0 opacity-100"
              : "pointer-events-none translate-x-4 opacity-0"
              }`}
            aria-hidden={!isActive}
          >
            {hasImage ? (
              <>
                <img
                  src={slide.imageUrl}
                  alt={slide.title}
                  loading={isActive ? "eager" : "lazy"}
                  className="absolute inset-0 h-auto w-full object-cover"
                />
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,191,36,0.4),transparent_60%)] opacity-70" />
                <div className="absolute inset-0 opacity-10 mix-blend-overlay [background-image:linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] [background-size:40px_40px]" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/18 via-transparent to-transparent" />
              </>
            )}
          </article>
        );
      })}

      {slides.length > 1 ? (
        <>
          {/* <button
            type="button"
            aria-label="Previous slide"
            onClick={() =>
              setCurrentSlide(
                (safeCurrentSlide - 1 + slides.length) % slides.length,
              )
            }
            className="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/55"
          >
            <FontAwesomeIcon icon={["fas", "chevron-left"]} />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => setCurrentSlide((safeCurrentSlide + 1) % slides.length)}
            className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/55"
          >
            <FontAwesomeIcon icon={["fas", "chevron-right"]} />
          </button> */}

          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {slides.map((slide, index) => {
              const isActive = index === safeCurrentSlide;

              return (
                <button
                  key={slide.id}
                  type="button"
                  aria-label={`Slide ${index + 1}`}
                  aria-pressed={isActive}
                  onClick={() => setCurrentSlide(index)}
                  className={`rounded-full transition-all duration-300 ${isActive
                    ? "h-2.5 w-8 bg-yellow-400"
                    : "h-2.5 w-2.5 bg-white/40 hover:bg-white/65"
                    }`}
                />
              );
            })}
          </div>
        </>
      ) : null}
    </div>
  );
}
