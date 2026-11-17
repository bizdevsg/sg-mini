import Image from "next/image";

type StoreBadgeLinkProps = {
  href: string;
  alt: string;
  imageSrc: string;
  sizes: string;
  imageClassName: string;
  className?: string;
  width?: number;
  height?: number;
};

export function StoreBadgeLink({
  href,
  alt,
  imageSrc,
  sizes,
  imageClassName,
  className = "",
  width = 300,
  height = 90,
}: StoreBadgeLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={className}
    >
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        className={imageClassName}
      />
    </a>
  );
}
