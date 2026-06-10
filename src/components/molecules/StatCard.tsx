import type { Stat } from "@/components/content/landing-content";

type StatCardProps = {
  stat: Stat;
};

export function StatCard({ stat }: StatCardProps) {
  return (
    <article className="rounded-[30px] border border-line bg-[linear-gradient(180deg,#111111_0%,#0b0b0b_100%)] px-5 py-6 text-center shadow-[0_16px_36px_rgba(0,0,0,0.35)] sm:px-6 sm:py-7">
      <p className="font-mono text-3xl font-bold tracking-[-0.04em] text-yellow-500 sm:text-4xl">
        {stat.value}
      </p>
      <p className="mt-3 text-xs leading-6 text-foreground/62">{stat.label}</p>
    </article>
  );
}
