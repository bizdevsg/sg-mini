import Image from "next/image";

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
    width: 848,
    height: 464,
    desktopClassName: "right-[1.5rem] top-[17.5rem] w-[8.5rem]",
    animationClass: "animate-[hero-float_6.5s_ease-in-out_infinite]",
  },
  {
    src: "/assets/Floating Info Card 2.png",
    alt: "Floating market card",
    width: 648,
    height: 264,
    desktopClassName: "right-[19.5rem] top-[24rem] w-[8.5rem]",
    animationClass: "animate-[hero-float-alt_7.2s_ease-in-out_infinite]",
  },
  {
    src: "/assets/Floating Info Card 3.png",
    alt: "Floating growth card",
    width: 684,
    height: 264,
    desktopClassName: "right-[2rem] bottom-[27.5rem] w-[8.5rem]",
    animationClass: "animate-[hero-float_7.6s_ease-in-out_infinite]",
  },
  {
    src: "/assets/Floating Info Card 4.png",
    alt: "Floating metrics card",
    width: 768,
    height: 264,
    desktopClassName: "right-[21rem] bottom-[20rem] w-[9.5rem]",
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
      className="relative h-full min-h-[46rem] w-full overflow-visible"
      aria-hidden="true"
    >
      {/* MAIN VISUAL */}
      <div className="absolute inset-0">
        <Image
          src="/assets/BANNER-UTAMA-SOLID.png"
          alt="SG Berjangka Client Area"
          fill
          priority
          sizes="80vw"
          className="object-contain object-center mix-blend-multiply"
        />
      </div>

      {/* FLOATING CARDS */}
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
              sizes="200px"
              className="h-auto w-full object-contain drop-shadow-[0_18px_35px_rgba(0,0,0,0.32)]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
