import Link from "next/link";
import Image from "next/image";

import { getMessages, type AppLocale } from "@/locales";
import logoMark from "../../../public/assets/Logo SG-WEB111.png";

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
          src={logoMark}
          alt={messages.app.brandName}
          preload
          sizes="(max-width: 300px) 30px, 36px"
          className="h-auto w-6 object-contain sm:w-7"
        />

        <span className="hidden font-serif text-lg font-bold tracking-[0.12em] text-yellow-500 sm:inline-block">
          {messages.app.brandWordmark}
        </span>
      </Link>
    </div>
  );
}
