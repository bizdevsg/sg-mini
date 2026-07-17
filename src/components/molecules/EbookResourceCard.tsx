import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.04),rgba(0,0,0,0.25))] text-left transition-all duration-300 hover:border-yellow-500/30 hover:shadow-[0_0_40px_rgba(205,161,58,0.08)]">
      <div className="relative overflow-hidden">
        {imageSrc ? (
          <>
            <Image
              src={imageSrc}
              alt={title}
              width={960}
              height={540}
              className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          </>
        ) : (
          <div className="relative flex h-56 items-end bg-gradient-to-br from-yellow-500/20 via-yellow-500/5 to-transparent p-5">
            <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/15 text-yellow-400">
              <FontAwesomeIcon icon={["fas", "book-open"]} className="text-sm" />
            </div>
          </div>
        )}

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-yellow-500 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black">
            {categoryLabel}
          </span>
          <span className="rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/82 backdrop-blur-sm">
            PDF
          </span>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="font-mono text-lg font-bold leading-snug text-white drop-shadow-lg line-clamp-2">
            {title}
          </h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="line-clamp-3 text-sm leading-7 text-zinc-300/88">
          {description}
        </p>

        <div className="mt-5 flex items-center gap-3 text-xs text-yellow-500/60">
          <span className="flex items-center gap-1.5">
            <FontAwesomeIcon
              icon={["fas", "book-open-reader"]}
              className="text-[10px]"
            />
            {previewLabel}
          </span>
          <span className="h-px flex-1 bg-yellow-500/10" />
          <span className="flex items-center gap-1.5">
            <FontAwesomeIcon
              icon={["fas", "download"]}
              className="text-[10px]"
            />
            {fileUrl ? ctaLabel : "Unavailable"}
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onPreviewClick}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm font-semibold text-zinc-200 transition hover:border-yellow-500/30 hover:bg-yellow-500/10 hover:text-yellow-200"
          >
            <FontAwesomeIcon icon={["fas", "circle-info"]} />
            {previewLabel}
          </button>

          {fileUrl ? (
            <Link
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-yellow-500 px-4 text-sm font-semibold text-black transition hover:bg-yellow-400"
            >
              <FontAwesomeIcon icon={["fas", "arrow-up-right-from-square"]} />
              {ctaLabel}
            </Link>
          ) : (
            <div className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/[0.02] px-4 text-sm font-semibold text-zinc-500">
              <FontAwesomeIcon icon={["fas", "ban"]} />
              {ctaLabel}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
