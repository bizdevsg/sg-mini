import Image from "next/image";

const heroFloatingCards = [
  {
    src: "/assets/Floating Info Card 1.webp",
    width: 648,
    height: 264,
    desktopClassName: "left-[57%] top-[23%] w-[10%]",
    animationClass: "animate-[hero-float_6.5s_ease-in-out_infinite]",
  },
  {
    src: "/assets/Floating Info Card 2.webp",
    width: 648,
    height: 264,
    desktopClassName: "left-[77%] top-[35%] w-[10%]",
    animationClass: "animate-[hero-float_6.5s_ease-in-out_infinite]",
  },
  {
    src: "/assets/Floating Info Card 3.webp",
    width: 684,
    height: 264,
    desktopClassName: "left-[55%] top-[45%] w-[10%]",
    animationClass: "animate-[hero-float_6.5s_ease-in-out_infinite]",
  },
  {
    src: "/assets/Floating Info Card 4.webp",
    width: 768,
    height: 264,
    desktopClassName: "left-[75%] top-[60%] w-[10%]",
    animationClass: "animate-[hero-float_6.5s_ease-in-out_infinite]",
  },
] as const;

export function ClientAreaLoginVisualPanel() {
  return (
    <div
      className="relative flex h-full w-full items-center justify-center"
      aria-hidden="true"
    >
      <div className="relative aspect-[3125/2383] w-[150%] max-w-304 shrink-0 translate-x-[0%] top-15">
        {/* MAIN VISUAL */}
        <div className="absolute inset-0">
          <Image
            src="/assets/Banner UTAMA-FIX-1.webp"
            alt=""
            fill
            priority
            sizes="100vw"
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
                alt=""
                width={card.width}
                height={card.height}
                sizes="200px"
                className="h-auto w-full object-contain drop-shadow-[0_18px_35px_rgba(0,0,0,0.32)]"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
