import Image from "next/image";

// Positions are the badge centre as a % of the main visual (1640x1482), derived
// from the login mockup. The badge images are square (1253px) with the card in
// the middle, so `width` is the whole square, not just the card.
const floatingBadges = [
  {
    src: "/assets/1.webp",
    left: "13.7%",
    top: "20.2%",
    width: "22.8%",
    animationDelay: "0s",
  },
  {
    src: "/assets/2.webp",
    left: "74.9%",
    top: "27.7%",
    width: "22.3%",
    animationDelay: "-1.6s",
  },
  {
    src: "/assets/3.webp",
    left: "11.8%",
    top: "59.9%",
    width: "21%",
    animationDelay: "-3.2s",
  },
  {
    src: "/assets/4.webp",
    left: "81.1%",
    top: "56.5%",
    width: "24.4%",
    animationDelay: "-4.8s",
  },
] as const;

export function ClientAreaLoginVisualPanel() {
  return (
    <div
      className="relative flex h-full w-full items-end justify-center"
      aria-hidden="true"
    >
      <div className="relative aspect-[1640/1482] w-[150%] max-w-230 shrink-0 translate-x-[15%]">
        {/* MAIN VISUAL */}
        <div className="absolute inset-0 right-0">
          <Image
            src="/assets/Banner-solid copy.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-contain object-center mix-blend-multiply [mask-image:linear-gradient(to_bottom,#000_85%,transparent_100%)]"
          />
        </div>

        {/* FLOATING BADGES */}
        <div className="pointer-events-none absolute inset-0 z-10">
          {floatingBadges.map((badge) => (
            <div
              key={badge.src}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: badge.left, top: badge.top, width: badge.width }}
            >
              <div
                className="animate-[hero-float_6.5s_ease-in-out_infinite]"
                style={{ animationDelay: badge.animationDelay }}
              >
                <Image
                  src={badge.src}
                  alt=""
                  width={1253}
                  height={1253}
                  sizes="240px"
                  className="h-auto w-full object-contain drop-shadow-[0_18px_35px_rgba(0,0,0,0.32)]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
