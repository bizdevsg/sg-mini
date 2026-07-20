import { ScrollReveal } from "./ScrollReveal";

type VisiMisiCardProps = {
  title: string;
  items: string[];
  indexLabel: string;
  effect?: string;
};

export function VisiMisiCard({ title, items, indexLabel, effect }: VisiMisiCardProps) {
  return (
    <ScrollReveal effect={effect}>
      <div className="rounded-[28px] border border-white/8 bg-black/20 p-6 h-full">
        <div className="flex items-center justify-between gap-4 border-b border-white/8 pb-4">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <div className="bg-yellow-500/20 h-8 w-8 rounded-full text-center flex items-center justify-center select-none">
            <p className="text-sm font-semibold text-yellow-500">{indexLabel}</p>
          </div>
        </div>

        <div className="mt-5">
          <ul className="list-outside list-disc space-y-4 pl-5 text-zinc-300">
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </ScrollReveal>
  );
}
