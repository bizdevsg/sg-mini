type LiveQuoteSkeletonProps = {
  mode: "compact" | "full";
};

function SkeletonBar({
  className,
}: {
  className: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`rounded-full bg-white/10 animate-pulse ${className}`}
    />
  );
}

function CompactCardSkeleton() {
  return (
    <article className="rounded-xl border border-line px-5 py-5 shadow-[0_16px_36px_rgba(0,0,0,0.24)] sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            aria-hidden="true"
            className="h-10 w-10 rounded-full bg-white/10 animate-pulse"
          />
          <div className="space-y-2">
            <SkeletonBar className="h-4 w-20" />
            <SkeletonBar className="h-3 w-14" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            aria-hidden="true"
            className="h-6 w-6 rounded-full bg-white/10 animate-pulse"
          />
          <SkeletonBar className="h-6 w-20" />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="rounded-lg border border-white/10 bg-black/10 px-4 py-3"
          >
            <SkeletonBar className="h-3 w-12" />
            <SkeletonBar className="mt-3 h-5 w-16" />
          </div>
        ))}
      </div>
    </article>
  );
}

function FullCardSkeleton() {
  return (
    <article className="rounded-xl border border-line p-4 shadow-[0_16px_36px_rgba(0,0,0,0.24)]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            aria-hidden="true"
            className="h-10 w-10 rounded-full bg-white/10 animate-pulse"
          />
          <div className="space-y-2">
            <SkeletonBar className="h-4 w-20" />
            <SkeletonBar className="h-3 w-12" />
          </div>
        </div>

        <div className="space-y-2 text-right">
          <SkeletonBar className="ml-auto h-3 w-10" />
          <SkeletonBar className="ml-auto h-5 w-20" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="rounded-lg border border-line bg-black/20 px-4 py-3"
          >
            <SkeletonBar className="h-3 w-10" />
            <SkeletonBar className="mt-3 h-5 w-16" />
          </div>
        ))}
      </div>
    </article>
  );
}

function DataTableSkeleton() {
  return (
    <div className="hidden overflow-hidden rounded-xl border border-line md:block">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-white/5">
              {Array.from({ length: 8 }).map((_, index) => (
                <th
                  key={index}
                  className="px-4 py-3"
                >
                  <SkeletonBar className="mx-auto h-3 w-14" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-t border-line align-middle"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      aria-hidden="true"
                      className="h-10 w-10 rounded-full bg-white/10 animate-pulse"
                    />
                    <div className="space-y-2">
                      <SkeletonBar className="h-4 w-20" />
                      <SkeletonBar className="h-3 w-12" />
                    </div>
                  </div>
                </td>
                {Array.from({ length: 7 }).map((_, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-4 py-3"
                  >
                    <SkeletonBar className="mx-auto h-4 w-[4.5rem]" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function LiveQuoteSkeleton({
  mode,
}: LiveQuoteSkeletonProps) {
  if (mode === "full") {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:hidden">
          {Array.from({ length: 4 }).map((_, index) => (
            <FullCardSkeleton key={index} />
          ))}
        </div>
        <DataTableSkeleton />
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <CompactCardSkeleton key={index} />
      ))}
    </div>
  );
}
