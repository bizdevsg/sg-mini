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
    <div className="flex shrink-0 items-center">
      <Link
        href={`/${locale}`}
        aria-label={messages.app.homeLabel}
        className="flex items-center"
      >
        {/* Mobile Logo */}
        <Image
          src={mobileLogoMark}
          alt={messages.app.brandName}
          priority
          sizes="28px"
          className="h-auto w-7 object-contain sm:hidden"
        />

        {/* Desktop Logo */}
        <Image
          src={logoMark}
          alt={messages.app.brandName}
          priority
          sizes="(min-width: 1280px) 300px, (min-width: 1024px) 260px, (min-width: 640px) 220px, 0px"
          className="hidden h-12 w-auto object-contain sm:block lg:h-13 xl:h-14"
        />
      </Link>
    </div>
  );
}
