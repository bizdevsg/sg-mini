import Image from "next/image";

import { getMessages, getSolidGoldAppPageContent, type AppLocale } from "@/locales";
import { SectionContainer } from "../atoms/SectionContainer";

type HeroSectionProps = {
  locale: AppLocale;
};

export function HeroSection({ locale }: HeroSectionProps) {
  const messages = getMessages(locale);
  const appPromoMessages = messages.appPromoSection;
  const primaryPlatform = getSolidGoldAppPageContent(locale).platforms.items[0];
  const googlePlayLink = primaryPlatform?.stores[0]?.href ?? "#";
  const appStoreLink = primaryPlatform?.stores[1]?.href ?? "#";

  return (
    <div
      className="relative overflow-hidden bg-black bg-top bg-no-repeat"
      style={{
        backgroundImage: "url('/assets/BCG.png')",
      }}
    >
      <SectionContainer className="pt-24 pb-14 sm:pt-28 sm:pb-16 md:pt-32 md:pb-20 lg:py-20">
        <div className="relative isolate z-10 flex flex-col gap-8 sm:gap-10 md:gap-12 lg:min-h-[620px] lg:justify-center xl:min-h-[680px]">
          <div className="order-2 relative z-10 mx-auto max-w-[22rem] text-center sm:max-w-[30rem] md:max-w-[38rem] xl:mx-0 lg:max-w-[34rem] xl:text-left xl:max-w-[48rem]">
            <h1 className="font-mono text-[2.35rem] font-bold leading-[0.96] tracking-[-0.05em] sm:text-[3.2rem] md:text-[4rem] lg:text-[3.45rem] xl:text-[4.4rem]">
              <span className="text-yellow-500">{messages.hero.titleLead}</span>
              <span className="block text-white">
                {messages.hero.titleBody}
              </span>
            </h1>
            <div className="mt-6 flex gap-4">
              <a href={googlePlayLink} target="_blank" rel="noreferrer">
                <Image
                  src="/assets/gp-button.png"
                  alt={appPromoMessages.googlePlayAlt}
                  width={5514}
                  height={1612}
                  sizes="(max-width: 640px) 144px, 160px"
                  className="h-auto w-36 object-contain sm:w-40"
                />
              </a>

              <a href={appStoreLink} target="_blank" rel="noreferrer">
                <Image
                  src="/assets/as-button.png"
                  alt={appPromoMessages.appStoreAlt}
                  width={5514}
                  height={1612}
                  sizes="(max-width: 640px) 144px, 160px"
                  className="h-auto w-36 object-contain sm:w-40"
                />
              </a>
            </div>
          </div>

          <div className="relative z-0 order-1 mx-auto w-full max-w-[20rem] sm:max-w-[24rem] md:max-w-[36rem] xl:hidden">
            <div className="pointer-events-none relative flex justify-center md:-mb-6">
              <img
                src="/assets/BANNER-UTAMA-SOLID.png"
                alt={messages.hero.visualAlt}
                className="w-full object-contain scale-[1.06] sm:scale-[1.08] md:scale-[1.02]"
              />
            </div>
          </div>

          <div
            className="pointer-events-none absolute z-0 hidden xl:block lg:bottom-2 lg:right-[-5rem] xl:bottom-10 xl:right-[-3rem]"
            aria-hidden="true"
          >
            <img
              src="/assets/BANNER-UTAMA-SOLID.png"
              alt=""
              className="w-[700px] max-w-none object-contain xl:w-[860px]"
            />
          </div>
        </div>

        <div className="absolute bottom-0 right-0 bg-linear-to-t from-black to-transparent h-25 w-full " />
      </SectionContainer>
    </div>
  );
}
