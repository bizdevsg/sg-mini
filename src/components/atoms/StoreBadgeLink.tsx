import Image from "next/image";

type StoreBadgeLinkProps = {
  href: string;
  alt: string;
  imageSrc: string;
  sizes: string;
  imageClassName: string;
  className?: string;
};

export function StoreBadgeLink({
  href,
  alt,
  imageSrc,
  sizes,
  imageClassName,
  className = "",
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
        width={5514}
        height={1612}
        sizes={sizes}
        className={imageClassName}
      />
    </a>
  );
}
