import Image from "next/image";

type LoadingOverlayProps = {
  brandLabel: string;
  logoAlt: string;
  title: string;
  description: string;
  fadingOut?: boolean;
};

export function LoadingOverlay({
  logoAlt,
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
      <div className="relative flex h-32 w-32 items-center justify-center">
        {/* Outer Glow */}
        {/* <div className="absolute inset-0 rounded-full bg-[#D4AF37]/20 blur-2xl" /> */}

        {/* Loading Circle */}
        {/* <div className="absolute inset-0 rounded-full border border-[#D4AF37]/20" /> */}

        {/* Spinning Gold Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#D4AF37] border-r-[#F5D76E] animate-spin" />

        {/* Inner Circle */}
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full backdrop-blur-md">
          <Image
            src="/assets/Logo SG-WEB111.png"
            alt={logoAlt}
            width={48}
            height={48}
            priority
            className="h-auto w-12 object-contain"
            style={{ height: "auto" }}
          />
        </div>
      </div>
    </div>
  );
}
