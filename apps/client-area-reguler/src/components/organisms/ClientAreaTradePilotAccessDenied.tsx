import { LockKeyhole } from "lucide-react";
import Link from "next/link";

type ClientAreaTradePilotAccessDeniedProps = {
  berandaBack: string;
  description: string;
  href: string;
  title: string;
};

export function ClientAreaTradePilotAccessDenied({
  berandaBack,
  description,
  href,
  title,
}: ClientAreaTradePilotAccessDeniedProps) {
  return (
    <section className="mx-auto flex min-h-[420px] max-w-2xl items-center justify-center">
      <div className="w-full rounded-3xl border border-amber-500/30 bg-zinc-900/5 backdrop-blur-sm p-6 text-center sm:p-10">
        <div className="mb-5">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
            <LockKeyhole className="h-7 w-7" />
          </span>
          <h1 className="mt-5 text-xl font-bold text-white sm:text-2xl">{title}</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-400">
            {description}
          </p>
        </div>
        <Link
          href={href}
          prefetch={false}
          className="px-4 py-2 text-sm border border-yellow-500 bg-linear-to-b from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold rounded-lg transition-all duration-300 ease-in-out"
        >
          {berandaBack}
        </Link>
      </div>
    </section>
  );
}
