import { SectionContainer } from "@/components/atoms/SectionContainer";
import { getFramerImageUrl, PUBLIC_REGISTER_URL } from "@/lib/env";
import { getMessages, type AppLocale } from "@/locales";
import Image from "next/image";
import { ButtonLink } from "../atoms/ButtonLink";

type FinalCtaSectionProps = {
  locale: AppLocale;
};

export function FinalCtaSection({ locale }: FinalCtaSectionProps) {
  const messages = getMessages(locale);
  const registerHref = PUBLIC_REGISTER_URL;

  return (
    <section className="bg-transparent">
      <SectionContainer className="py-20">
        <div className="text-center font-bold text-3xl md:text-4xl lg:text-5xl">
          <h1 className="mx-auto max-w-4xl text-yellow-500">
            {messages.finalCta.title}
          </h1>
          <h1 className="mx-auto max-w-4xl">{messages.finalCta.subTitle}</h1>
          <ButtonLink
            href={registerHref}
            target="_blank"
            rel="noreferrer"
            className="mt-10 px-8 py-2"
          >
            {messages.finalCta.cta}
          </ButtonLink>
        </div>

        <div className="relative mt-10 aspect-[3310/1163] w-full overflow-hidden rounded-[2rem]">
          <Image
            src={getFramerImageUrl(
              "ydoWDvRN7X60OhPjxdEIX6YnRAE.webp?scale-down-to=2048&width=3310&height=1163",
            )}
            alt={messages.finalCta.title}
            width={3310}
            height={1163}
            sizes="(max-width: 1280px) 100vw, 1280px"
            quality={90}
            className="absolute left-[48%] top-0 h-auto w-[110%] max-w-none -translate-x-1/2"
          />
        </div>
      </SectionContainer>
    </section>
  );
}
