
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

type ClientAreaTransactionEmptyStateProps = {
  actionLabel?: string;
  imageAlt: string;
  message: string;
  onAction?: () => void;
  title: string;
};

export function ClientAreaTransactionEmptyState({
  actionLabel,
  imageAlt,
  message,
  onAction,
  title,
}: ClientAreaTransactionEmptyStateProps) {
  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/80 p-4 shadow-xl shadow-black/10 sm:p-5">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
        {/* Illustration */}
        <div className="relative flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/[0.03] sm:size-50">
          <Image
            src="/assets/sorry-image.webp"
            alt={imageAlt}
            width={360}
            height={360}
            className="relative z-10 h-full w-full object-contain"
          />

          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-zinc-900/80 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col items-center text-center sm:items-start sm:text-left">
          <h3 className="mb-1 text-sm font-semibold tracking-tight text-zinc-100">
            {title}
          </h3>

          <p className="text-xs leading-relaxed text-zinc-400 sm:text-sm">
            {message}
          </p>

          {actionLabel && onAction ? (
            <button
              type="button"
              onClick={onAction}
              className="group mt-3 inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-yellow-400/50 bg-linear-to-b from-yellow-400 to-yellow-500 px-4 py-2 text-xs font-semibold text-zinc-950 shadow-sm shadow-yellow-500/10 transition-all duration-200 hover:from-yellow-300 hover:to-yellow-400 active:scale-[0.98]"
            >
              {actionLabel}
              <ArrowUpRight
                aria-hidden="true"
                size={14}
                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
