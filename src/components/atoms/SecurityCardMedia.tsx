import Image from "next/image";

type SecurityCardMediaProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  wrapperClassName: string;
  className?: string;
};

export function SecurityCardMedia({
  src,
  alt,
  width,
  height,
  wrapperClassName,
  className = "",
}: SecurityCardMediaProps) {
  return (
    <div className={`pointer-events-none absolute ${wrapperClassName}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        unoptimized={src.endsWith(".svg")}
        className={`h-auto w-full select-none object-contain object-bottom drop-shadow-[0_34px_44px_rgba(0,0,0,0.38)] transition-transform duration-300 group-hover:scale-[1.1] ${className}`}
      />
    </div>
  );
}
