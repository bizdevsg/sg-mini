"use client";

import Link from "next/link";
import type { Dispatch, SetStateAction } from "react";

import type { ClientAreaHeroSlide } from "@/components/organisms/client-area.types";

type ClientAreaHeroSlideshowProps = {
  currentSlide: number;
  detailLabel: string;
  setCurrentSlide: Dispatch<SetStateAction<number>>;
  slides: ClientAreaHeroSlide[];
};

export function ClientAreaHeroSlideshow({
  currentSlide,
  detailLabel,
  setCurrentSlide,
  slides,
}: ClientAreaHeroSlideshowProps) {
  if (!slides.length) {
    return null;
  }

  const safeCurrentSlide =
    ((currentSlide % slides.length) + slides.length) % slides.length;

  return (
    <div className="relative w-full aspect-[8/3] overflow-hidden rounded-3xl bg-zinc-950 shadow-xl shadow-yellow-500/10">
      {slides.map((slide, index) => {
        const isActive = index === safeCurrentSlide;
        const hasImage = Boolean(slide.imageUrl);
        const cardClassName = `absolute inset-0 overflow-hidden transition-all duration-500 ${isActive
          ? "translate-x-0 opacity-100"
          : "pointer-events-none translate-x-4 opacity-0"
          }`;
        const content = (
          <>
            {hasImage ? (
              <>
                <img
                  src={slide.imageUrl}
                  alt={slide.title}
                  loading={isActive ? "eager" : "lazy"}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {/* <div className="absolute inset-0 bg-linear-to-r from-black/45 via-black/12 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/55 to-transparent" /> */}
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-linear-to-r from-yellow-400 via-amber-400 to-yellow-500" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,191,36,0.4),transparent_60%)] opacity-70" />
                <div className="absolute inset-0 opacity-10 mix-blend-overlay [background-image:linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] [background-size:40px_40px]" />
                <div className="absolute inset-0 bg-linear-to-r from-black/18 via-transparent to-transparent" />
              </>
            )}

            {/* {slide.href ? (
              <div className="absolute right-4 top-4 z-10 rounded-full border border-yellow-400/30 bg-black/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-yellow-300 backdrop-blur-sm">
                {detailLabel}
              </div>
            ) : null} */}
          </>
        );

        return (
          slide.href ? (
            <Link
              key={slide.id}
              href={slide.href}
              aria-label={`${slide.title} - ${detailLabel}`}
              className={`${cardClassName} cursor-pointer`}
              aria-hidden={!isActive}
            >
              {content}
            </Link>
          ) : (
            <article
              key={slide.id}
              className={cardClassName}
              aria-hidden={!isActive}
            >
              {content}
            </article>
          )
        );
      })}

      {slides.length > 1 ? (
        <>
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
                  className={`rounded-full transition-all duration-300 border border-black/50 ${isActive
                    ? "h-2.5 w-8 bg-linear-to-r from-[#FF9600] to-[#FFDE00]"
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
