import Link from "next/link";

type ClientAreaSectionHeaderProps = {
  actionHref?: string;
  actionLabel?: string;
  subtitle?: string;
  title: string;
};

export function ClientAreaSectionHeader({
  actionHref,
  actionLabel,
  subtitle,
  title,
}: ClientAreaSectionHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="space-y-1">
        <h2 className="flex items-center gap-2 text-base font-bold text-zinc-100">
          <span className="h-4 w-1.5 rounded-full bg-yellow-500" />
          {title}
        </h2>
      </div>

      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="text-sm text-yellow-500 transition duration-300 hover:text-yellow-600"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
