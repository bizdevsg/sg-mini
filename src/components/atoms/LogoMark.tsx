import Link from "next/link";
import Image from "next/image";

import { getCdnAssetUrl } from "@/lib/env";
import { getMessages, type AppLocale } from "@/locales";

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
          src={getCdnAssetUrl("Logo%20SG-WEB111.png")}
          alt={messages.app.brandName}
          width={50}
          height={50}
          sizes="(max-width: 300px) 30px, 36px"
          className="h-auto w-5 object-contain sm:w-6"
        />

        <span className="hidden font-mono font-bold tracking-[0.12em] text-foreground sm:inline-block">
          {messages.app.brandWordmark}
        </span>
      </Link>
    </div>
  );
}
