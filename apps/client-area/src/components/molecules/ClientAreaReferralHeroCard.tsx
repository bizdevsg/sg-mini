"use client";

import Image from "next/image";

type ClientAreaReferralHeroCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  brandAlt: string;
  visualAlt: string;
};

export function ClientAreaReferralHeroCard({
  visualAlt,
}: ClientAreaReferralHeroCardProps) {
  return (
    <div className="relative w-full aspect-[8/3] overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 shadow-xl shadow-yellow-500/10">
      <Image
        src="/assets/banner/Banner%20SG%20Solid%20Web%20New-2.jpg.jpeg"
        alt={visualAlt}
        fill
        priority
        className="object-cover"
      />
    </div>
  );
}
