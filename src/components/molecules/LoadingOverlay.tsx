import Image from "next/image";

type LoadingOverlayProps = {
  brandLabel: string;
  logoAlt: string;
  title: string;
  description: string;
  fadingOut?: boolean;
};

export function LoadingOverlay({
  brandLabel,
  logoAlt,
  title,
  description,
  fadingOut = false,
}: LoadingOverlayProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`fixed inset-0 z-[120] flex items-center justify-center overflow-hidden bg-black px-6 transition-opacity duration-300 ${fadingOut ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
    >
      <div className="relative w-full max-w-sm rounded-xl border border-white/10 bg-[rgba(10,10,10,0.82)] px-8 py-10 text-center shadow-[0_30px_90px_rgba(0,0,0,0.48)] backdrop-blur-xl">
        <Image
          src="/assets/Logo SG-WEB111.png"
          alt={logoAlt}
          width={72}
          height={72}
          priority
          className="h-full w-auto object-contain animate-pulse mx-auto"
        />

        <p className="mt-6 text-[0.65rem] font-semibold uppercase tracking-[0.36em] text-yellow-500/75">
          {brandLabel}
        </p>
        {/* <h2 className="mt-3 font-mono text-2xl font-bold tracking-[-0.04em] text-white sm:text-[2rem]">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/65 sm:text-base">
          {description}
        </p> */}
      </div>
    </div>
  );
}
