import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type EbookItem = {
  title: string;
  description: string;
  format: string;
  level: string;
  topics: string[];
};

type EbookCardProps = {
  item: EbookItem;
  index: number;
};

export function EbookCard({ item, index }: EbookCardProps) {
  const levelColors: Record<string, string> = {
    Pemula: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    Menengah: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    Lanjut: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    Beginner: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    Intermediate: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    Advanced: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  };

  return (
    <article className="group relative flex flex-col rounded-[20px] border border-line bg-linear-to-br from-slate-900/40 to-slate-900/20 p-6 sm:p-8 backdrop-blur-sm transition-all duration-300 hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/10">
      {/* Number Badge */}
      <div className="absolute right-6 top-6 sm:right-8 sm:top-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-yellow-500 to-amber-600 text-lg font-bold text-white shadow-lg">
          {String(index).padStart(2, "0")}
        </div>
      </div>

      {/* Icon */}
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500/20 text-yellow-400">
        <FontAwesomeIcon icon={["fas", "book"]} />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col">
        <h3 className="text-lg font-bold leading-tight text-white sm:text-xl">
          {item.title}
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-foreground/70">
          {item.description}
        </p>

        {/* Meta Info */}
        <div className="mt-6 flex flex-wrap gap-2">
          <span className="inline-block rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
            {item.format}
          </span>
          <span
            className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${
              levelColors[item.level] ||
              "bg-slate-800/50 text-slate-300 border-slate-700"
            }`}
          >
            {item.level}
          </span>
        </div>

        {/* Topics */}
        <div className="mt-4 flex flex-wrap gap-2">
          {item.topics.map((topic) => (
            <span
              key={topic}
              className="rounded-full bg-slate-800/60 px-2.5 py-1 text-xs text-slate-400"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/* CTA Arrow */}
      <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-yellow-400 transition-all duration-300 group-hover:gap-3">
        <span>Lihat Detail</span>
        <FontAwesomeIcon
          icon={["fas", "chevron-right"]}
          className="transition-transform"
        />
      </div>
    </article>
  );
}
