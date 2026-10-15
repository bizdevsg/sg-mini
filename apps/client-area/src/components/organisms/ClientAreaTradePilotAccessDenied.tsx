import { LockKeyhole } from "lucide-react";

type ClientAreaTradePilotAccessDeniedProps = {
  description: string;
  mockDataLabel: string;
  title: string;
};

export function ClientAreaTradePilotAccessDenied({
  description,
  mockDataLabel,
  title,
}: ClientAreaTradePilotAccessDeniedProps) {
  return (
    <section className="mx-auto flex min-h-[420px] max-w-2xl items-center justify-center">
      <div className="w-full rounded-3xl border border-amber-500/30 bg-[#101113] p-6 text-center sm:p-10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
          <LockKeyhole className="h-7 w-7" />
        </span>
        <h1 className="mt-5 text-xl font-bold text-white sm:text-2xl">{title}</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-400">
          {description}
        </p>
        <span className="mt-5 inline-flex rounded-full border border-zinc-700 px-3 py-1 text-xs font-semibold text-zinc-400">
          {mockDataLabel}
        </span>
      </div>
    </section>
  );
}

