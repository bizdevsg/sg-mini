import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type EbookCategoryCardProps = {
  countLabel: string;
  ctaLabel: string;
  description: string;
  href: string;
  title: string;
};

export function EbookCategoryCard({
  countLabel,
  ctaLabel,
  description,
  href,
  title,
}: EbookCategoryCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex h-full flex-col rounded-[24px] border border-line bg-linear-to-br from-zinc-900/55 to-black/35 p-6 transition-all duration-300 hover:border-yellow-500/40 hover:shadow-[0_22px_48px_rgba(250,204,21,0.08)]"
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-500/12 text-yellow-400">
          <FontAwesomeIcon icon={["fas", "book-open"]} className="text-lg" />
        </div>
        <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-yellow-300">
          {countLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col">
        <h3 className="text-xl font-bold tracking-[-0.02em] text-white">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-7 text-zinc-300">{description}</p>
      </div>

      <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-yellow-400 transition-all duration-300 group-hover:gap-3">
        <span>{ctaLabel}</span>
        <FontAwesomeIcon icon={["fas", "chevron-right"]} />
      </div>
    </Link>
  );
}
