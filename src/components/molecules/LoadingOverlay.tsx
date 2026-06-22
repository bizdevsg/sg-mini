import Image from "next/image";

type LoadingOverlayProps = {
  title: string;
  description: string;
  fadingOut?: boolean;
};

export function LoadingOverlay({
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
        <div className="mx-auto flex h-24 w-24 p-4 items-center justify-center rounded-xl border border-yellow-500/20 bg-[radial-gradient(circle_at_top,rgba(242,207,120,0.18),rgba(18,18,18,0.98)_72%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <Image
            src="/assets/Logo SG-WEB111.png"
            alt="Solid Gold Berjangka"
            width={72}
            height={72}
            priority
            className="h-full w-auto object-contain animate-pulse"
          />
        </div>

        <p className="mt-6 text-[0.65rem] font-semibold uppercase tracking-[0.36em] text-yellow-500/75">
          Solid Gold Berjangka
        </p>
        <h2 className="mt-3 font-mono text-2xl font-bold tracking-[-0.04em] text-white sm:text-[2rem]">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/65 sm:text-base">
          {description}
        </p>
      </div>
    </div>
  );
}
