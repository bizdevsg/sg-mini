"use client";

import AOS from "aos";
import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
  useEffect,
  useState,
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
  desktopDelay?: number;
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
  desktopDelay,
  duration = 700,
  once = false,
  threshold = 0.18,
  rootMargin = "0px 0px -10% 0px",
  className,
  style,
  ...props
}: ScrollRevealProps<T>) {
  const Component = (as ?? "div") as ElementType;
  const [isHydrated, setIsHydrated] = useState(false);
  const [resolvedDelay, setResolvedDelay] = useState(delay);
  const aosAnchorPlacement = resolveAosAnchorPlacement(rootMargin);
  const aosOffset = Math.max(0, Math.round(threshold * 120));

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !isHydrated) {
      return;
    }

    if (desktopDelay === undefined) {
      setResolvedDelay(delay);
      return;
    }

    const mediaQuery = window.matchMedia("(min-width: 1280px)");
    const syncDelay = () => {
      setResolvedDelay(mediaQuery.matches ? desktopDelay : delay);
    };

    syncDelay();
    mediaQuery.addEventListener("change", syncDelay);

    return () => {
      mediaQuery.removeEventListener("change", syncDelay);
    };
  }, [delay, desktopDelay, isHydrated]);

  const refreshKey = [
    effect,
    resolvedDelay,
    duration,
    once,
    threshold,
    rootMargin,
  ].join("|");
  const mergedStyle = {
    ...style,
    "--scroll-reveal-delay": `${resolvedDelay}ms`,
  } as CSSProperties;

  useEffect(() => {
    if (typeof window === "undefined" || !isHydrated) {
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
  }, [isHydrated, refreshKey]);

  return (
    <Component
      className={className}
      style={mergedStyle}
      data-aos={isHydrated ? effect : undefined}
      data-aos-delay={isHydrated ? resolvedDelay : undefined}
      data-aos-duration={isHydrated ? duration : undefined}
      data-aos-once={isHydrated ? toAosBoolean(once) : undefined}
      data-aos-offset={isHydrated ? aosOffset : undefined}
      data-aos-easing={
        isHydrated ? "cubic-bezier(0.22, 1, 0.36, 1)" : undefined
      }
      data-aos-anchor-placement={isHydrated ? aosAnchorPlacement : undefined}
      {...props}
    >
      {children}
    </Component>
  );
}
