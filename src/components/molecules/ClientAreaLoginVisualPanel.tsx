import Image from "next/image";

import { StoreBadgeLink } from "@/components/atoms/StoreBadgeLink";

type ClientAreaLoginVisualPanelProps = {
  googlePlayLink: string;
  googlePlayAlt: string;
  appStoreLink: string;
  appStoreAlt: string;
};

const heroFloatingCards = [
  {
    src: "/assets/Floating Info Card 1.png",
    alt: "Floating trading insight card",
    width: 648,
    height: 264,
    desktopClassName: "right-[1rem] top-[9.5rem] w-[6rem]",
    animationClass: "animate-[hero-float_6.5s_ease-in-out_infinite]",
  },
  {
    src: "/assets/Floating Info Card 2.png",
    alt: "Floating market card",
    width: 648,
    height: 264,
    desktopClassName: "right-[14rem] top-[14rem] w-[6rem]",
    animationClass: "animate-[hero-float-alt_7.2s_ease-in-out_infinite]",
  },
  {
    src: "/assets/Floating Info Card 3.png",
    alt: "Floating growth card",
    width: 684,
    height: 264,
    desktopClassName: "right-[2rem] bottom-[12rem] w-[6rem]",
    animationClass: "animate-[hero-float_7.6s_ease-in-out_infinite]",
  },
  {
    src: "/assets/Floating Info Card 4.png",
    alt: "Floating metrics card",
    width: 768,
    height: 264,
    desktopClassName: "right-[16rem] bottom-[9rem] w-[6rem]",
    animationClass: "animate-[hero-float-alt_6.8s_ease-in-out_infinite]",
  },
] as const;

export function ClientAreaLoginVisualPanel({
  googlePlayLink,
  googlePlayAlt,
  appStoreLink,
  appStoreAlt,
}: ClientAreaLoginVisualPanelProps) {
  return (
    <div
      className="relative hidden overflow-hidden xl:block xl:flex-[1.45]"
      aria-hidden="true"
    >
      <div className="absolute inset-0 isolate">
        <Image
          src="/assets/BANNER-UTAMA-SOLID.png"
          alt="SG Berjangka Client Area"
          fill
          className="object-cover object-center mix-blend-multiply"
          priority
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-10">
        {heroFloatingCards.map((card) => (
          <div
            key={card.src}
            className={`absolute ${card.desktopClassName} ${card.animationClass}`}
          >
            <Image
              src={card.src}
              alt={card.alt}
              width={card.width}
              height={card.height}
              sizes="160px"
              className="h-auto w-full object-contain drop-shadow-[0_18px_35px_rgba(0,0,0,0.32)]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
