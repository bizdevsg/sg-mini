import Image from "next/image";

type ClientAreaMarketSignalHeaderProps = {
  categoryIconSrc?: string | null;
  categoryName: string;
  updatedLabel: string;
  updateValue?: string | null;
};

export function ClientAreaMarketSignalHeader({
  categoryIconSrc,
  categoryName,
  updatedLabel,
  updateValue,
}: ClientAreaMarketSignalHeaderProps) {
  return (
    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-transparent p-2 sm:h-16 sm:w-16 sm:p-2.5">
        {categoryIconSrc ? (
          <Image
            src={categoryIconSrc}
            alt={categoryName}
            fill
            sizes="64px"
            className="object-contain p-2"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
            {categoryName.slice(0, 2)}
          </div>
        )}
      </div>

      <div className="min-w-0">
        <h1 className="text-xl font-bold capitalize text-white sm:text-3xl">
          {categoryName}
        </h1>
        {updateValue ? (
          <p className="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-zinc-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-yellow-500" />
            </span>
            {updatedLabel} {updateValue}
          </p>
        ) : null}
      </div>
    </div>
  );
}
