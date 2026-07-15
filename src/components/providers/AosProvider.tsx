"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import AOS from "aos";

type AosProviderProps = {
  children: React.ReactNode;
};

function shouldDisableAos() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function AosProvider({ children }: AosProviderProps) {
  const pathname = usePathname();

  useEffect(() => {
    AOS.init({
      once: true,
      duration: 700,
      easing: "ease-out-cubic",
      offset: 80,
      disable: shouldDisableAos,
    });
  }, []);

  useEffect(() => {
    const animationFrameId = window.requestAnimationFrame(() => {
      AOS.refreshHard();
    });

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [pathname]);

  return <>{children}</>;
}
