import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import type { AppLocale } from "@/locales";

type NewsDetailBreadcrumbProps = {
  locale: AppLocale;
  newsLabel: string;
  title: string;
};

export function NewsDetailBreadcrumb({
  locale,
  newsLabel,
  title,
}: NewsDetailBreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-nowrap items-center gap-2 text-xs text-gray-500 sm:text-sm"
    >
      <Link
        href={`/${locale}`}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-500 transition hover:bg-yellow-500/30"
      >
        <FontAwesomeIcon icon={["fas", "house"]} className="text-xs" />
      </Link>
      <span>{">"}</span>
      <Link
        href={`/${locale}/news`}
        className="text-yellow-400 transition hover:text-yellow-500"
      >
        {newsLabel}
      </Link>
      <span>{">"}</span>
      <span className="line-clamp-1 font-medium text-white">{title}</span>
    </nav>
  );
}
