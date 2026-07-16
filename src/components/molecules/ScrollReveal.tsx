"use client";

import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

type ScrollRevealEffect =
  | "fade"
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "zoom-in";

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

function getHiddenTransform(effect: ScrollRevealEffect) {
  switch (effect) {
    case "fade-up":
      return "translate3d(0, 28px, 0)";
    case "fade-down":
      return "translate3d(0, -28px, 0)";
    case "fade-left":
      return "translate3d(28px, 0, 0)";
    case "fade-right":
      return "translate3d(-28px, 0, 0)";
    case "zoom-in":
      return "scale(0.94)";
    case "fade":
    default:
      return "translate3d(0, 0, 0)";
  }
}

function isElementInViewport(element: HTMLElement) {
  const rect = element.getBoundingClientRect();

  return rect.top < window.innerHeight && rect.bottom > 0;
}

function isElementAboveViewport(element: HTMLElement) {
  return element.getBoundingClientRect().bottom <= 0;
}

export function ScrollReveal<T extends ElementType = "div">({
  as,
  children,
  effect = "fade-up",
  delay = 0,
  duration = 700,
  once = true,
  threshold = 0.18,
  rootMargin = "0px 0px -10% 0px",
  className,
  style,
  ...props
}: ScrollRevealProps<T>) {
  const Component = (as ?? "div") as ElementType;
  const elementRef = useRef<HTMLElement | null>(null);
  const hasBeenVisibleRef = useRef(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    setIsMounted(true);

    if (prefersReducedMotion) {
      hasBeenVisibleRef.current = true;
      setIsVisible(true);
      return;
    }

    if (
      isElementInViewport(element) ||
      (once && isElementAboveViewport(element))
    ) {
      hasBeenVisibleRef.current = true;
      setIsVisible(true);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (!entry) {
          return;
        }

        if (entry.isIntersecting) {
          hasBeenVisibleRef.current = true;
          setIsVisible(true);
          return;
        }

        if (!once) {
          setIsVisible(false);
          return;
        }

        const viewportBottom = entry.rootBounds?.bottom ?? window.innerHeight;
        const isAboveViewport = entry.boundingClientRect.bottom <= 0;
        const isBelowViewport = entry.boundingClientRect.top >= viewportBottom;

        if (isAboveViewport && hasBeenVisibleRef.current) {
          setIsVisible(true);
          return;
        }

        if (isBelowViewport) {
          hasBeenVisibleRef.current = false;
          setIsVisible(false);
          return;
        }

        setIsVisible(hasBeenVisibleRef.current);
      },
      {
        threshold,
        rootMargin,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [once, rootMargin, threshold]);

  const shouldHide = isMounted && !isVisible;

  return (
    <Component
      ref={elementRef}
      className={className}
      style={{
        ...style,
        opacity: shouldHide ? 0 : 1,
        transform: shouldHide
          ? getHiddenTransform(effect)
          : "translate3d(0, 0, 0) scale(1)",
        transitionProperty: isMounted ? "opacity, transform" : undefined,
        transitionDuration: isMounted ? `${duration}ms` : undefined,
        transitionTimingFunction: isMounted
          ? "cubic-bezier(0.22, 1, 0.36, 1)"
          : undefined,
        transitionDelay: isMounted ? `${delay}ms` : undefined,
        willChange: shouldHide ? "opacity, transform" : undefined,
      }}
      {...props}
    >
      {children}
    </Component>
  );
}
