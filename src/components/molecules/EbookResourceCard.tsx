import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ButtonLink } from "@/components/atoms/ButtonLink";

type EbookResourceCardProps = {
  categoryLabel: string;
  ctaLabel: string;
  description: string;
  fileUrl: string | null;
  imageSrc: string | null;
  onPreviewClick: () => void;
  previewLabel: string;
  title: string;
};

export function EbookResourceCard({
  categoryLabel,
  ctaLabel,
  description,
  fileUrl,
  imageSrc,
  onPreviewClick,
  previewLabel,
  title,
}: EbookResourceCardProps) {
  return (
    <article className="flex h-full flex-col rounded-[24px] border border-line bg-linear-to-br from-zinc-900/55 to-black/35 p-5 shadow-[0_18px_44px_rgba(0,0,0,0.18)]">
      <div className="overflow-hidden rounded-2xl border border-white/8 bg-black/20">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={title}
            className="h-48 min-h-48 w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-48 items-center justify-center text-yellow-400">
            <FontAwesomeIcon icon={["fas", "book"]} className="text-3xl" />
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-1 flex-col justify-between">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-yellow-300">
              {categoryLabel}
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-300">
              PDF
            </span>
          </div>

          <h3 className="mt-4 text-lg font-bold tracking-[-0.02em] text-white sm:text-xl line-clamp-1">
            {title}
          </h3>
          <p className="mt-3 flex-1 overflow-hidden text-sm leading-7 text-zinc-300 line-clamp-2 max-h-14">
            {description}
          </p>
        </div>

        <div className="mt-6 w-full">
          <button
            type="button"
            onClick={onPreviewClick}
            className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-2xl border cursor-pointer border-white/10 bg-white/[0.03] px-4 text-sm font-semibold text-zinc-200 transition hover:border-yellow-500/30 hover:bg-yellow-500/10 hover:text-yellow-200"
          >
            <FontAwesomeIcon icon={["fas", "circle-info"]} />
            {previewLabel}
          </button>
        </div>
      </div>
    </article>
  );
}
