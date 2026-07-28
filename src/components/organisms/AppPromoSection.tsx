import Image from "next/image";
import {
  getMessages,
  getSolidGoldAppPageContent,
  type AppLocale,
} from "@/locales";
import { SectionContainer } from "../atoms/SectionContainer";
import { ScrollReveal } from "../molecules/ScrollReveal";

type AppPromoSectionProps = {
  locale: AppLocale;
};

export function AppPromoSection({ locale }: AppPromoSectionProps) {
  const messages = getMessages(locale).appPromoSection;
  const primaryPlatform = getSolidGoldAppPageContent(locale).platforms.items[0];
  const googlePlayLink = primaryPlatform?.stores[0]?.href ?? "#";
  const appStoreLink = primaryPlatform?.stores[1]?.href ?? "#";

  return (
    <SectionContainer className="pb-14 md:pb-18">
      <ScrollReveal effect="fade-up">
        <div
          className="relative overflow-hidden rounded-4xl border-2 border-yellow-500/50 bg-black bg-cover bg-center"
          style={{
            backgroundImage: "url('/assets/bg-tengah.png')",
          }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" />

          <div className="relative z-10 flex min-h-[22rem] flex-col items-center gap-7 px-4 py-7 text-center sm:px-5 sm:py-8 md:min-h-[24rem] md:flex-row md:items-center md:justify-between md:gap-4 md:px-5 md:py-8 md:text-left lg:gap-5 lg:px-6">
            <div className="order-2 max-w-xl md:order-1 md:max-w-none md:flex-1">
              <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl">
                {messages.title}
              </h2>

              <p className="mt-3 text-sm text-gray-300 sm:text-base md:text-lg">
                {messages.description}
              </p>

              <div className="mt-5 flex flex-wrap justify-center gap-4 md:justify-start">
                <a href={googlePlayLink} target="_blank" rel="noreferrer">
                  <Image
                    src="/assets/gp-button.png"
                    alt={messages.googlePlayAlt}
                    width={5514}
                    height={1612}
                    sizes="(max-width: 640px) 144px, 160px"
                    className="h-auto w-36 object-contain sm:w-40"
                  />
                </a>

                <a href={appStoreLink} target="_blank" rel="noreferrer">
                  <Image
                    src="/assets/as-button.png"
                    alt={messages.appStoreAlt}
                    width={5514}
                    height={1612}
                    sizes="(max-width: 640px) 144px, 160px"
                    className="h-auto w-36 object-contain sm:w-40"
                  />
                </a>
              </div>
            </div>

            <div className="order-1 relative w-full max-w-[17rem] shrink-0 sm:max-w-[19rem] md:order-2 md:max-w-[20rem] lg:max-w-[22rem]">
              <Image
                src="/assets/HP Solid-3.png"
                width={400}
                height={520}
                alt={messages.imageAlt}
                sizes="(max-width: 640px) 272px, (max-width: 1024px) 320px, 384px"
                className="mx-auto h-auto max-h-[18rem] w-full object-contain sm:max-h-[20rem] md:max-h-[24rem] lg:max-h-[26rem]"
              />
            </div>
          </div>
        </div>
      </ScrollReveal>
    </SectionContainer>
  );
}
