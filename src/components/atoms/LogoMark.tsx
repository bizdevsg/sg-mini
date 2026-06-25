import Link from "next/link";
import Image from "next/image";

import { getMessages, type AppLocale } from "@/locales";
import mobileLogoMark from "../../../public/assets/Logo SG-WEB111.png";
import logoMark from "../../../public/assets/logo-utama.png";

type LogoMarkProps = {
  locale: AppLocale;
};

export function LogoMark({ locale }: LogoMarkProps) {
  const messages = getMessages(locale);

  return (
    <div className="flex items-center">
      <Link
        href={`/${locale}`}
        aria-label={messages.app.homeLabel}
        className="flex items-center gap-4"
      >
        <Image
          src={mobileLogoMark}
          alt={messages.app.brandName}
          preload
          sizes="44px"
          className="h-ato w-6 object-contain sm:hidden"
        />

        <Image
          src={logoMark}
          alt={messages.app.brandName}
          preload
          sizes="220px"
          className="hidden h-auto w-60 object-contain sm:block"
        />
      </Link>
    </div>
  );
}
