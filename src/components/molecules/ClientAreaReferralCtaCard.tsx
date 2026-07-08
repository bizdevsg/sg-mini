"use client";

import Link from "next/link";

type ClientAreaReferralCtaCardProps = {
  ctaHref: string;
  ctaLabel: string;
  description: string;
};

export function ClientAreaReferralCtaCard({
  ctaHref,
  ctaLabel,
  description,
}: ClientAreaReferralCtaCardProps) {
  return (
    <div className="rounded-[28px] border border-zinc-800 bg-black/40 px-5 py-8 text-center sm:px-7">
      <p className="mx-auto max-w-3xl text-sm leading-8 text-zinc-100 sm:text-lg">
        {description}
      </p>

      <Link
        href={ctaHref}
        prefetch={false}
        className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-to-r from-yellow-500 to-amber-400 px-8 py-3 text-sm font-bold text-black transition hover:brightness-105 sm:min-w-[260px] sm:text-base"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
