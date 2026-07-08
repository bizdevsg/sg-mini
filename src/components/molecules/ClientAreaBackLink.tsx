"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type ClientAreaBackLinkProps = {
  href: string;
  label: string;
};

export function ClientAreaBackLink({
  href,
  label,
}: ClientAreaBackLinkProps) {
  return (
    <Link
      href={href}
      prefetch={false}
      className="inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-yellow-400"
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500 text-black">
        <FontAwesomeIcon icon={["fas", "chevron-left"]} className="text-xs" />
      </span>
      <span>{label}</span>
    </Link>
  );
}
