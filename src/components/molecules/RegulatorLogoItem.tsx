import Image from "next/image";

import type { RegulatorLogo } from "@/components/content/landing-content";

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
        className="max-h-10 w-auto object-contain opacity-75"
      />
    </div>
  );
}
