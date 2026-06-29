import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import type { SlideGraphic } from "@/components/organisms/client-area.types";

type ClientAreaHeroGraphicProps = {
  graphicType: SlideGraphic;
};

export function ClientAreaHeroGraphic({
  graphicType,
}: ClientAreaHeroGraphicProps) {
  if (graphicType === "education") {
    return (
      <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-white/10 shadow-inner backdrop-blur-md md:h-44 md:w-44">
        <FontAwesomeIcon
          icon={["fas", "graduation-cap"]}
          className="text-6xl text-neutral-900"
        />
        <FontAwesomeIcon
          icon={["fas", "star"]}
          className="absolute right-6 top-6 text-lg text-yellow-300"
        />
        <FontAwesomeIcon
          icon={["fas", "star"]}
          className="absolute bottom-6 left-6 text-lg text-yellow-300"
        />
      </div>
    );
  }

  if (graphicType === "gift") {
    return (
      <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-white/10 shadow-inner backdrop-blur-md md:h-44 md:w-44">
        <FontAwesomeIcon
          icon={["fas", "gift"]}
          className="text-6xl text-neutral-900"
        />
        <div className="absolute -bottom-1 rounded-full bg-neutral-950 px-3 py-1 text-[10px] font-bold text-yellow-400">
          Komisi $0
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-white/10 shadow-inner backdrop-blur-md md:h-44 md:w-44">
      <FontAwesomeIcon
        icon={["fas", "coins"]}
        className="absolute -left-2 bottom-1 rotate-12 text-2xl text-amber-400 drop-shadow"
      />
      <FontAwesomeIcon
        icon={["fas", "coins"]}
        className="absolute -top-2 left-4 -rotate-12 text-3xl text-amber-300 drop-shadow"
      />
      <FontAwesomeIcon
        icon={["fas", "circle-dollar-to-slot"]}
        className="absolute bottom-4 right-1 -rotate-45 text-4xl text-yellow-300 drop-shadow"
      />

      <div className="relative z-10 flex h-24 w-24 flex-col items-center justify-center rounded-2xl border-2 border-white/40 bg-gradient-to-b from-zinc-200 to-zinc-400 p-6 shadow-2xl">
        <div className="absolute -top-8 h-14 w-16 rounded-t-full border-[7px] border-zinc-300 border-b-0" />
        <div className="relative mt-2 flex h-6 w-4 items-center justify-center rounded-full bg-zinc-900">
          <div className="absolute bottom-0 h-2.5 w-2.5 rotate-45 bg-zinc-900" />
        </div>
      </div>
    </div>
  );
}
