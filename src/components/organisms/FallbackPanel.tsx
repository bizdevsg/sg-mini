import Image from "next/image";
import type { ReactNode } from "react";

type FallbackPanelProps = {
  badge: string;
  code?: string;
  title: string;
  description: string;
  details?: string;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
};

export function FallbackPanel({
  badge,
  code,
  title,
  description,
  details,
  primaryAction,
  secondaryAction,
}: FallbackPanelProps) {
  const hasActions = Boolean(primaryAction || secondaryAction);

  return (
    <section className="relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-12">
      <div className="relative mx-auto max-w-3xl text-center">
        <div className="mx-auto mb-10 max-w-lg">
          <Image
            src="/assets/icon-impact/error-image.svg"
            width={1000}
            height={1000}
            alt="Error Illustration"
            loading="eager"
          />
        </div>

        <div className="mx-auto inline-flex max-w-full rounded-full border border-[rgba(255,214,120,0.24)] bg-[rgba(214,166,64,0.1)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f1cb74] sm:px-4 sm:text-[11px] sm:tracking-[0.28em]">
          {badge}
        </div>

        <div className="mt-5 space-y-4">
          {code ? (
            <p className="text-center text-3xl leading-none font-black tracking-[-0.05em] break-words text-white sm:text-4xl lg:text-5xl">
              {code}
            </p>
          ) : null}

          <h1 className="mx-auto max-w-2xl text-2xl leading-tight font-black tracking-[-0.03em] text-white break-words sm:text-3xl sm:tracking-[-0.04em]">
            {title}
          </h1>

          <p className="mx-auto max-w-2xl text-sm leading-6 break-words text-[#d7c28f] sm:text-base sm:leading-7">
            {description}
          </p>

          {details ? (
            <p className="mx-auto max-w-2xl text-xs leading-6 break-all text-[#9f9473] sm:text-sm">
              {details}
            </p>
          ) : null}
        </div>

        {hasActions ? (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {primaryAction}
            {secondaryAction}
          </div>
        ) : null}
      </div>
    </section>
  );
}
