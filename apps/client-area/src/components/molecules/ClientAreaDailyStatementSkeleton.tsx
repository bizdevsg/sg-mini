type ClientAreaDailyStatementSkeletonProps = {
  label: string;
};

function SkeletonLine({ className }: { className: string }) {
  return <span className={`block rounded-full bg-white/[0.07] ${className}`} />;
}

export function ClientAreaDailyStatementSkeleton({
  label,
}: ClientAreaDailyStatementSkeletonProps) {
  return (
    <div role="status" aria-live="polite" aria-label={label}>
      <span className="sr-only">{label}</span>

      <div
        aria-hidden="true"
        className="animate-pulse space-y-3 motion-reduce:animate-none"
      >
        <div className="flex min-h-18 flex-col justify-center gap-5 rounded-2xl border border-white/10 bg-[#17181b]/95 px-5 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <span className="size-10 shrink-0 rounded-xl bg-yellow-400/10" />
            <div className="space-y-2">
              <SkeletonLine className="h-2.5 w-20" />
              <SkeletonLine className="h-4 w-36" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8">
            {[0, 1].map((item) => (
              <div key={item} className="space-y-2">
                <SkeletonLine className="h-2.5 w-14" />
                <SkeletonLine className="h-3.5 w-24" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.15fr_1fr_1fr] lg:grid-rows-2">
          <div className="min-h-44 rounded-2xl border border-yellow-400/15 bg-[linear-gradient(145deg,rgba(250,204,21,0.08),rgba(24,24,27,0.96)_58%)] p-5 sm:col-span-2 sm:p-6 lg:col-span-1 lg:row-span-2">
            <SkeletonLine className="h-3 w-24 bg-yellow-300/10" />
            <SkeletonLine className="mt-5 h-8 w-44 bg-yellow-300/10" />
            <SkeletonLine className="mt-12 h-2.5 w-28" />
          </div>

          {[0, 1, 2, 3].map((item) => (
            <div
              key={item}
              className="min-h-20 rounded-2xl border border-white/10 bg-[#191a1e] px-5 py-4 sm:px-6"
            >
              <SkeletonLine className="h-2.5 w-24" />
              <SkeletonLine className="mt-3 h-5 w-32" />
            </div>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {Array.from({ length: 10 }, (_, index) => (
            <div
              key={index}
              className="min-h-18 rounded-xl border border-white/[0.08] bg-[#151619]/90 px-4 py-3.5"
            >
              <SkeletonLine className="h-2.5 w-20" />
              <SkeletonLine className="mt-3 h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
