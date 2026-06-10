"use client";

import { useEffect, useState } from "react";

export function Blur() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function syncVisibility() {
      const viewportBottom = window.scrollY + window.innerHeight;
      const pageBottom = document.documentElement.scrollHeight;
      const hasScrolled = window.scrollY > 0;
      const hasReachedBottom = viewportBottom >= pageBottom - 1;

      setIsVisible(hasScrolled && !hasReachedBottom);
    }

    syncVisibility();
    window.addEventListener("scroll", syncVisibility, { passive: true });
    window.addEventListener("resize", syncVisibility);

    return () => {
      window.removeEventListener("scroll", syncVisibility);
      window.removeEventListener("resize", syncVisibility);
    };
  }, []);

  return (
    <div
      className={`pointer-events-none fixed bottom-0 left-0 z-40 h-24 w-full transition-opacity duration-200 ${
        isVisible ? "opacity-100 backdrop-blur-xs" : "opacity-0"
      }`}
      style={{
        maskImage:
          "linear-gradient(to top, black 5%, black 52%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to top, black 5%, black 52%, transparent 100%)",
      }}
    />
  );
}
