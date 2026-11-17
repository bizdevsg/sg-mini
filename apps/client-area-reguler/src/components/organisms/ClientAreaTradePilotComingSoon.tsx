import Image from "next/image";

type ClientAreaTradePilotComingSoonProps = {
  description: string;
  title: string;
};

export function ClientAreaTradePilotComingSoon({
  description,
  title,
}: ClientAreaTradePilotComingSoonProps) {
  return (
    <section className="mx-auto flex min-h-[calc(100dvh-8.5rem)] w-full min-w-0 max-w-lg items-center justify-center py-4 sm:min-h-[420px] sm:py-0">
      <div className="w-full min-w-0 rounded-3xl border border-amber-500/30 bg-yellow-500/5 p-5 text-center backdrop-blur-xs min-[380px]:p-6 sm:p-10">
        <div className="mx-auto h-fit w-fit rounded-lg bg-yellow-500/10 p-1">
          <Image
            src="/assets/logo-tp.webp"
            alt={title}
            height={75}
            width={75}
            sizes="75px"
          />
        </div>
        <h1 className="mt-5 text-xl font-bold text-white sm:text-2xl">
          {title}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-400 italic">
          {description}
        </p>
      </div>
    </section>
  );
}
