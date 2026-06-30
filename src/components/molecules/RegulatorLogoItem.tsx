import Image from "next/image";

import type { RegulatorLogo } from "@/types/landing";

type RegulatorLogoItemProps = {
  logo: RegulatorLogo;
  priority?: boolean;
  sizes?: string;
  imageClassName?: string;
  containerClassName?: string;
  useFill?: boolean;
};

export function RegulatorLogoItem({
  logo,
  priority = false,
  sizes = "(max-width: 640px) 180px, (max-width: 1024px) 220px, 260px",
  imageClassName = "h-10 w-auto object-contain opacity-75 sm:h-12 md:h-14",
  containerClassName = "",
  useFill = false,
}: RegulatorLogoItemProps) {
  if (useFill) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center ${containerClassName}`}
      >
        <div className="relative h-full w-full">
          <Image
            src={logo.src}
            alt={logo.alt}
            fill
            priority={priority}
            sizes={sizes}
            className={imageClassName}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center ${containerClassName}`}
    >
      <Image
        src={logo.src}
        alt={logo.alt}
        width={logo.width}
        height={logo.height}
        priority={priority}
        sizes={sizes}
        className={imageClassName}
      />
    </div>
  );
}
