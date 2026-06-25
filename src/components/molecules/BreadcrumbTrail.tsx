import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { getMessages, type AppLocale } from "@/locales";

type BreadcrumbTrailItem = {
  label: string;
  href?: string;
  tone?: "default" | "accent" | "current";
  className?: string;
};

type BreadcrumbTrailProps = {
  locale: AppLocale;
  homeLabel: string;
  items: BreadcrumbTrailItem[];
  className?: string;
  wrap?: boolean;
};

const itemToneClassNames = {
  default: "text-gray-400 transition hover:text-white",
  accent: "text-yellow-400 transition hover:text-yellow-500",
  current: "font-medium text-white",
};

export function BreadcrumbTrail({
  locale,
  homeLabel,
  items,
  className = "",
  wrap = true,
}: BreadcrumbTrailProps) {
  const navigationLabel = getMessages(locale).app.breadcrumbLabel;

  return (
    <nav
      aria-label={navigationLabel}
      className={`flex items-center gap-2 text-xs text-gray-500 sm:text-sm ${wrap ? "flex-wrap" : "flex-nowrap"} ${className}`}
    >
      <Link
        href={`/${locale}`}
        aria-label={homeLabel}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-500 transition hover:bg-yellow-500/30"
      >
        <FontAwesomeIcon icon={["fas", "house"]} className="text-xs" />
      </Link>

      {items.map((item, index) => {
        const tone = item.tone ?? (item.href ? "default" : "current");
        const classNameForItem = `${itemToneClassNames[tone]} ${item.className ?? ""}`;

        return (
          <div key={`${item.label}-${index}`} className="contents">
            <span>{">"}</span>

            {item.href ? (
              <Link href={item.href} className={classNameForItem}>
                {item.label}
              </Link>
            ) : (
              <span className={classNameForItem}>{item.label}</span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
