import Image from "next/image";

import type { RegulatorLogo } from "@/types/landing";

type RegulatorLogoItemProps = {
  logo: RegulatorLogo;
  priority?: boolean;
};

export function RegulatorLogoItem({
  logo,
  priority = false,
}: RegulatorLogoItemProps) {
  return (
    <div className="flex shrink-0 items-center justify-center">
      <Image
        src={logo.src}
        alt={logo.alt}
        width={logo.width}
        height={logo.height}
        priority={priority}
        sizes="120px"
        className="max-h-200 w-auto object-contain opacity-75"
      />
    </div>
  );
}
