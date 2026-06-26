import Image from "next/image";
import {
  getMessages,
  getSolidGoldAppPageContent,
  type AppLocale,
} from "@/locales";
import { SectionContainer } from "../atoms/SectionContainer";

type AppPromoSectionProps = {
  locale: AppLocale;
};

export function AppPromoSection({ locale }: AppPromoSectionProps) {
  const messages = getMessages(locale).appPromoSection;
  const primaryPlatform = getSolidGoldAppPageContent(locale).platforms.items[0];
  const googlePlayLink = primaryPlatform?.stores[0]?.href ?? "#";
  const appStoreLink = primaryPlatform?.stores[1]?.href ?? "#";

  return (
    <SectionContainer className="pb-16 md:pb-20">
      <div
        className="relative overflow-hidden rounded-6xl border-2 border-yellow-500/50 bg-black bg-cover bg-center rounded-4xl"
        style={{
          backgroundImage: "url('/assets/bg-tengah.png')",
        }}
      >
        <div className="bg-black/50 absolute top-0 left-0 w-full h-full" />

        <div className="relative z-10 flex min-h-97.5 flex-col items-center gap-10 px-6 py-10 text-center sm:px-8 md:flex-row md:items-center md:justify-between md:px-12 md:text-left lg:px-20">
          <div className="order-2 max-w-xl md:order-1">
            <h2 className="text-4xl font-bold leading-tight text-white md:text-5xl">
              {messages.title}
            </h2>

            <p className="mt-5 text-gray-300 md:text-lg">
              {messages.description}
            </p>

            <div className="mt-6 flex justify-center gap-4 md:justify-start">
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

          <div className="order-1 relative w-full max-w-[20rem] sm:max-w-[23rem] md:order-2 md:max-w-[27rem]">
            <Image
              src="/assets/HP Solid-3.png"
              width={400}
              height={400}
              alt={messages.imageAlt}
              className="h-auto w-full object-contain"
            />
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
