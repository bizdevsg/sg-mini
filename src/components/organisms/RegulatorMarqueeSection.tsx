"use client";

import { type PointerEvent as ReactPointerEvent, useEffect, useRef } from "react";

import { SectionContainer } from "@/components/atoms/SectionContainer";
import { SectionEyebrow } from "@/components/atoms/SectionEyebrow";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";
import { regulatorLogos } from "@/types/landing";
import { getMessages, type AppLocale } from "@/locales";
import { RegulatorLogoItem } from "@/components/molecules/RegulatorLogoItem";

type RegulatorMarqueeSectionProps = {
  locale: AppLocale;
};

export function RegulatorMarqueeSection({
  locale,
}: RegulatorMarqueeSectionProps) {
  const messages = getMessages(locale);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const autoScrollFrameRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);
  const dragStartXRef = useRef(0);
  const dragStartScrollLeftRef = useRef(0);
  const marqueeLogos = [
    ...regulatorLogos,
    ...regulatorLogos,
    ...regulatorLogos,
    ...regulatorLogos,
  ];

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;

    if (!viewport || !track) {
      return;
    }

    let singleSetWidth = 0;

    const updateSingleSetWidth = () => {
      singleSetWidth = track.scrollWidth / 4;

      if (singleSetWidth > 0 && viewport.scrollLeft === 0) {
        viewport.scrollLeft = singleSetWidth;
      }
    };

    const step = () => {
      if (!viewport || !singleSetWidth) {
        autoScrollFrameRef.current = window.requestAnimationFrame(step);
        return;
      }

      if (!isDraggingRef.current) {
        viewport.scrollLeft += 0.45;

        if (viewport.scrollLeft >= singleSetWidth * 2) {
          viewport.scrollLeft -= singleSetWidth;
        } else if (viewport.scrollLeft <= 0) {
          viewport.scrollLeft += singleSetWidth;
        }
      }

      autoScrollFrameRef.current = window.requestAnimationFrame(step);
    };

    updateSingleSetWidth();
    autoScrollFrameRef.current = window.requestAnimationFrame(step);
    window.addEventListener("resize", updateSingleSetWidth);

    return () => {
      window.removeEventListener("resize", updateSingleSetWidth);

      if (autoScrollFrameRef.current !== null) {
        window.cancelAnimationFrame(autoScrollFrameRef.current);
      }
    };
  }, []);

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    isDraggingRef.current = true;
    pointerIdRef.current = event.pointerId;
    dragStartXRef.current = event.clientX;
    dragStartScrollLeftRef.current = viewport.scrollLeft;

    viewport.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const viewport = viewportRef.current;

    if (!viewport || !isDraggingRef.current) {
      return;
    }

    const deltaX = event.clientX - dragStartXRef.current;
    viewport.scrollLeft = dragStartScrollLeftRef.current - deltaX;
  }

  function finishPointerInteraction() {
    const viewport = viewportRef.current;
    const pointerId = pointerIdRef.current;

    if (viewport && pointerId !== null && viewport.hasPointerCapture(pointerId)) {
      viewport.releasePointerCapture(pointerId);
    }

    isDraggingRef.current = false;
    pointerIdRef.current = null;
  }

  return (
    <section className="bg-linear-180 from-black to-transparent">
      <SectionContainer className="py-10 sm:pb-16 md:pb-20 pt-10 md:pt-14">
        <div className="flex flex-col items-center gap-5">
          <ScrollReveal effect="zoom-in">
            <SectionEyebrow align="center">
              {messages.regulator.eyebrow}
            </SectionEyebrow>
          </ScrollReveal>

          <div
            ref={viewportRef}
            className="w-full overflow-x-auto overflow-y-hidden touch-pan-x cursor-grab active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] [&::-webkit-scrollbar]:hidden"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishPointerInteraction}
            onPointerCancel={finishPointerInteraction}
          >
            <div className="py-5 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
              <ScrollReveal effect="fade-up">
                <div
                  ref={trackRef}
                  className="flex w-max min-w-max items-center whitespace-nowrap"
                  style={{ willChange: "scroll-position" }}
                >
                  {marqueeLogos.map((logo, index) => (
                    <div
                      key={`${logo.alt}-${index}`}
                      className="shrink-0 pr-4 sm:pr-6 lg:pr-8 last:pr-0"
                      aria-hidden={index >= regulatorLogos.length}
                    >
                      <RegulatorLogoItem
                        logo={logo}
                        priority={index < regulatorLogos.length}
                        useFill
                        sizes="(max-width: 640px) 160px, (max-width: 1024px) 192px, 224px"
                        imageClassName="object-contain opacity-85"
                        containerClassName="h-[4.5rem] w-[9.5rem] rounded-2xl border border-white/6 bg-white/[0.03] p-3 sm:h-20 sm:w-[10.5rem] md:h-[5.5rem] md:w-[11.5rem]"
                      />
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}
