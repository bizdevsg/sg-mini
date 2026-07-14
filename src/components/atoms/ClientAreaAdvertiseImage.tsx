import Image from "next/image";

export function ClientAreaAdvertiseImage() {
  return (
    <Image
      src="/assets/Advertise-sgb.png"
      alt="Promotional banner Solid Gold Berjangka"
      width={446}
      height={528}
      sizes="(max-width: 1023px) 100vw, 220px"
      className="block h-auto w-full object-cover"
    />
  );
}

