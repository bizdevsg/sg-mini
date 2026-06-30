import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type ClientAreaLoginErrorModalProps = {
  isOpen: boolean;
  title: string;
  message: string;
  closeLabel: string;
  onClose: () => void;
};

const MODAL_ANIMATION_DURATION_MS = 220;

export function ClientAreaLoginErrorModal({
  isOpen,
  title,
  message,
  closeLabel,
  onClose,
}: ClientAreaLoginErrorModalProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
      return;
    }

    if (!shouldRender) {
      return;
    }

    setIsClosing(true);
    const timeoutId = window.setTimeout(() => {
      setShouldRender(false);
      setIsClosing(false);
    }, MODAL_ANIMATION_DURATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [isOpen, shouldRender]);

  useEffect(() => {
    if (!shouldRender) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [shouldRender, onClose]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/72 px-4 py-6 backdrop-blur-sm ${
        isClosing
          ? "animate-[pengumuman-modal-overlay-out_220ms_ease_forwards]"
          : "animate-[pengumuman-modal-overlay-in_220ms_ease_forwards]"
      }`}
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-error-modal-title"
        className={`w-full max-w-md rounded-[1.5rem] border border-amber-500/20 bg-[rgba(12,12,16,0.96)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.55)] sm:p-7 ${
          isClosing
            ? "animate-[pengumuman-modal-panel-out_220ms_cubic-bezier(0.22,1,0.36,1)_forwards]"
            : "animate-[pengumuman-modal-panel-in_220ms_cubic-bezier(0.22,1,0.36,1)_forwards]"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/10 text-2xl text-amber-400">
          <FontAwesomeIcon icon={["fas", "triangle-exclamation"]} />
        </div>

        <h2
          id="login-error-modal-title"
          className="mt-5 text-center text-[1.5rem] font-extrabold tracking-[-0.03em] text-white"
        >
          {title}
        </h2>

        <p className="mt-3 text-center text-sm leading-6 text-gray-300">
          {message}
        </p>

        <button
          type="button"
          className="mt-6 flex h-[3.125rem] w-full items-center justify-center rounded-[0.6rem] bg-gradient-to-r from-amber-500 to-amber-600 text-[0.92rem] font-black tracking-[0.12em] text-black shadow-[0_4px_24px_rgba(245,158,11,0.4),inset_0_1px_0_rgba(255,255,255,0.08)] transition-[opacity,box-shadow,transform] hover:-translate-y-px hover:opacity-95 hover:shadow-[0_6px_32px_rgba(245,158,11,0.55)]"
          onClick={onClose}
        >
          {closeLabel}
        </button>
      </div>
    </div>
  );
}
