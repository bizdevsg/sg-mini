"use client";

import { useEffect, useState } from "react";

import { getMessages, type AppLocale } from "@/locales";

type ScrollToTopButtonProps = {
  locale: AppLocale;
};

export function ScrollToTopButton({ locale }: ScrollToTopButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const label = getMessages(locale).navbar.scrollToTopLabel;

  useEffect(() => {
    const syncVisibility = () => {
      setIsVisible(window.scrollY > 320);
    };

    syncVisibility();
    window.addEventListener("scroll", syncVisibility, { passive: true });

    return () => {
      window.removeEventListener("scroll", syncVisibility);
    };
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      aria-label={label}
      onClick={handleClick}
      className={`fixed right-4 bottom-4 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full border border-yellow-500/35 bg-[rgba(16,16,16,0.88)] text-yellow-400 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-[rgba(24,24,24,0.96)] hover:text-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:right-6 sm:bottom-6 ${
        isVisible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
        className="h-5 w-5"
      >
        <path
          d="M12 19V5M5 12l7-7 7 7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
