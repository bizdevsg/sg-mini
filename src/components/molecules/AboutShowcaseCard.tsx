import { ResilientImage } from "@/components/atoms/ResilientImage";

type AboutShowcaseCardProps = {
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
};

export function AboutShowcaseCard({
  title,
  subtitle,
  imageSrc,
  imageAlt,
}: AboutShowcaseCardProps) {
  return (
    <div className="group overflow-hidden rounded-[28px] border border-white/8 bg-black/20 transition-colors duration-300 hover:border-yellow-500/25">
      <div className="flex aspect-[4/3] items-center justify-center border-b border-white/8 bg-[#0d0d0d] p-6">
        <ResilientImage
          src={imageSrc}
          alt={imageAlt}
          className="max-h-36 w-auto object-contain transition-transform duration-500 group-hover:scale-[1.03]"
          fallback={
            <div className="flex h-full w-full items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/20 px-4 text-center text-xs font-semibold text-zinc-500">
              {title}
            </div>
          }
        />
      </div>

      <div className="p-5 text-center">
        <p className="line-clamp-2 text-sm font-semibold text-white">{title}</p>
        <p className="mt-2 line-clamp-2 text-xs leading-6 text-zinc-400">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
