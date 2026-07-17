"use client";

import AOS from "aos";
import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
  useEffect,
} from "react";

type KnownScrollRevealEffect =
  | "fade"
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "zoom-in";

type ScrollRevealEffect = KnownScrollRevealEffect | (string & {});

type ScrollRevealProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  effect?: ScrollRevealEffect;
  delay?: number;
  duration?: number;
  once?: boolean;
  threshold?: number;
  rootMargin?: string;
  className?: string;
  style?: CSSProperties;
} & Omit<
  ComponentPropsWithoutRef<T>,
  "as" | "children" | "className" | "style"
>;

let hasInitializedAos = false;

function resolveAosAnchorPlacement(rootMargin: string) {
  if (rootMargin.includes("-25%")) {
    return "top-center";
  }

  if (rootMargin.includes("-10%")) {
    return "top-bottom";
  }

  return undefined;
}

function toAosBoolean(value: boolean) {
  return value ? "true" : "false";
}

export function ScrollReveal<T extends ElementType = "div">({
  as,
  children,
  effect = "fade-up",
  delay = 0,
  duration = 700,
  once = false,
  threshold = 0.18,
  rootMargin = "0px 0px -10% 0px",
  className,
  style,
  ...props
}: ScrollRevealProps<T>) {
  const Component = (as ?? "div") as ElementType;
  const aosAnchorPlacement = resolveAosAnchorPlacement(rootMargin);
  const aosOffset = Math.max(0, Math.round(threshold * 120));
  const refreshKey = [
    effect,
    delay,
    duration,
    once,
    threshold,
    rootMargin,
  ].join("|");
  const mergedStyle = {
    ...style,
    "--scroll-reveal-delay": `${delay}ms`,
  } as CSSProperties;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!hasInitializedAos) {
      AOS.init({
        duration: 700,
        delay: 0,
        once: true,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        disable: () =>
          window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      });
      hasInitializedAos = true;
    }

    const frameId = window.requestAnimationFrame(() => {
      AOS.refreshHard();
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [refreshKey]);

  return (
    <Component
      className={className}
      style={mergedStyle}
      data-aos={effect}
      data-aos-delay={delay}
      data-aos-duration={duration}
      data-aos-once={toAosBoolean(once)}
      data-aos-offset={aosOffset}
      data-aos-easing="cubic-bezier(0.22, 1, 0.36, 1)"
      data-aos-anchor-placement={aosAnchorPlacement}
      {...props}
    >
      {children}
    </Component>
  );
}
