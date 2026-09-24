import Link from "next/link";

type ClientAreaSectionHeaderProps = {
  actionHref?: string;
  actionLabel?: string;
  subtitle?: string;
  titleClassname?: string;
  title: string;
};

export function ClientAreaSectionHeader({
  actionHref,
  actionLabel,
  subtitle,
  titleClassname,
  title,
}: ClientAreaSectionHeaderProps) {
  const resolvedTitleClassname = titleClassname?.trim() ?? "";
  const hasCustomTextSize = /(?:^|\s)text-(?:4xs|3xs|2xs|xs|sm|base|lg|xl|[2-9]xl)(?:\s|$)|(?:^|\s)text-\[[^\]]+\](?:\s|$)/.test(
    resolvedTitleClassname,
  );

  return (
    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
      <div className="min-w-0 space-y-1">
        <h2
          className={`flex items-center gap-2 font-bold text-zinc-100 ${hasCustomTextSize ? "" : "text-base"} ${resolvedTitleClassname}`}
        >
          <span className="h-4 w-1.5 rounded-full bg-yellow-500" />
          {title}
        </h2>
        {subtitle ? (
          <p className="text-sm leading-6 text-zinc-400">{subtitle}</p>
        ) : null}
      </div>

      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="w-fit text-sm text-yellow-500 transition duration-300 hover:text-yellow-600"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
