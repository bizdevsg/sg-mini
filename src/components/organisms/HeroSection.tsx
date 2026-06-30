import Image from "next/image";
import Link from "next/link";

import {
  getMessages,
  type AppLocale,
} from "@/locales";
import { AppDownloadModalTriggerButton } from "@/components/molecules/AppDownloadModalTriggerButton";
import { SectionContainer } from "../atoms/SectionContainer";

type HeroSectionProps = {
  locale: AppLocale;
};

export function HeroSection({ locale }: HeroSectionProps) {
  const messages = getMessages(locale);
  const clientAreaLoginHref = `/${locale}/client-area/login`;

  const HERO_FLOATING_CARDS = [
    {
      src: "/assets/Floating Info Card 1.png",
      alt: "Floating trading insight card",
      width: 648,
      height: 264,
      mobileClassName:
        "right-[1rem] top-[4rem] w-[6.75rem] sm:right-[4rem] sm:top-[5rem] sm:w-32",
      desktopClassName: "left-[36rem] top-[4.75rem] w-[8rem]",
      animationClass: "animate-[hero-float_6.5s_ease-in-out_infinite]",
    },
    {
      src: "/assets/Floating Info Card 2.png",
      alt: "Floating market card",
      width: 648,
      height: 264,
      mobileClassName:
        "left-[1rem] top-[8rem] w-[6.75rem] sm:left-[4rem] sm:top-[10rem] sm:w-32",
      desktopClassName: "right-[7.5rem] top-[10rem] w-[8rem]",
      animationClass: "animate-[hero-float-alt_7.2s_ease-in-out_infinite]",
    },
    {
      src: "/assets/Floating Info Card 3.png",
      alt: "Floating growth card",
      width: 684,
      height: 264,
      mobileClassName: "hidden",
      desktopClassName: "left-[34rem] bottom-[13.5rem] w-[8rem]",
      animationClass: "animate-[hero-float_7.6s_ease-in-out_infinite]",
    },
    {
      src: "/assets/Floating Info Card 4.png",
      alt: "Floating metrics card",
      width: 768,
      height: 264,
      mobileClassName:
        "right-[1rem] bottom-[2rem] w-[7.5rem] sm:right-[5rem] sm:bottom-[3rem] sm:w-36",
      desktopClassName: "right-[8.5rem] bottom-[10rem] w-[8rem]",
      animationClass: "animate-[hero-float-alt_6.8s_ease-in-out_infinite]",
    },
  ] as const;

  return (
    <div
      className="relative overflow-hidden bg-black bg-top bg-no-repeat"
      style={{
        backgroundImage: "url('/assets/BCG.png')",
      }}
    >
      <SectionContainer className="relative py-16 mt-10 md:mt-0 md:pt-20">
        <div className="relative isolate z-10 flex flex-col gap-8 sm:gap-10 md:gap-12 lg:min-h-[620px] lg:justify-center xl:min-h-[680px]">
          {/* Mobile Image */}
          <div className="relative order-1 mx-auto h-[360px] w-full sm:h-[430px] md:h-[500px] xl:hidden">
            <div className="pointer-events-none absolute left-[40%] top-0 h-full w-[min(920px,160vw)] -translate-x-1/2">
              <img
                src="/assets/Banner SGB-FIX.png"
                alt={messages.hero.visualAlt}
                className="absolute left-1/2 top-0 w-[760px] max-w-none -translate-x-1/2 object-contain sm:w-[880px] md:w-[980px]" />

              {HERO_FLOATING_CARDS.map((card) => (
                <div
                  key={card.src}
                  className={`absolute ${card.mobileClassName} ${card.animationClass}`}
                >
                  <Image
                    src={card.src}
                    alt={card.alt}
                    width={card.width}
                    height={card.height}
                    sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, 176px"
                    className="h-auto w-full object-contain drop-shadow-[0_18px_35px_rgba(0,0,0,0.32)]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Text Content */}
          <div className="relative order-2 z-10 mx-auto max-w-[22rem] text-center sm:max-w-[30rem] md:max-w-[38rem] lg:max-w-[34rem] xl:mx-0 xl:max-w-[48rem] xl:text-left">
            <h1 className="font-mono text-[2.35rem] font-bold leading-[1.2] tracking-[-0.05em] sm:text-[3.2rem] md:text-[4rem] lg:text-[3.45rem] xl:text-[4.4rem]">
              <span className="text-yellow-500">
                {messages.hero.titleLead}
              </span>
              <span className="block text-white">
                {messages.hero.titleBody}
              </span>
            </h1>

            <p className="mt-3 max-w-2xl text-center text-lg text-white/85 text-shadow-lg text-shadow-black xl:text-left">
              {messages.hero.subTitle}
            </p>

            <div className="mt-5">
              <p className="font-bold text-white text-xl">Download Aplikasi Sekarang!</p>

              <div className="flex flex-col mx-auto xl:mx-0 sm:flex-row items-center gap-2 mt-2 sm:w-fit">
                <AppDownloadModalTriggerButton
                  locale={locale}
                  label="Open Demo Account"
                  variant="primary"
                  size="md"
                  visualVariant="qr"
                  className="w-full sm:w-fit rounded-xl px-5 cursor-pointer"
                />

                <Link
                  href={clientAreaLoginHref}
                  className="w-full sm:w-fit py-3 px-5 border rounded-xl font-semibold text-white border-yellow-500"
                >
                  Login Demo Account
                </Link>
              </div>
            </div>

            {/* <div className="mx-auto mt-6 flex w-fit gap-4 xl:mx-0">
              <Link href={googlePlayLink} target="_blank" rel="noreferrer">
                <Image
                  src="/assets/gp-button.png"
                  alt={appPromoMessages.googlePlayAlt}
                  width={5514}
                  height={1612}
                  sizes="(max-width: 640px) 144px, 160px"
                  className="h-auto w-36 object-contain sm:w-40"
                />
              </Link>

              <Link href={appStoreLink} target="_blank" rel="noreferrer">
                <Image
                  src="/assets/as-button.png"
                  alt={appPromoMessages.appStoreAlt}
                  width={5514}
                  height={1612}
                  sizes="(max-width: 640px) 144px, 160px"
                  className="h-auto w-36 object-contain sm:w-40"
                />
              </Link>
            </div> */}
          </div>

          {/* Desktop Image */}
          <div
            className="pointer-events-none absolute z-0 hidden xl:bottom-7 xl:right-[-11.5rem] xl:block"
            aria-hidden="true"
          >
            <img
              src="/assets/Banner SGB-FIX.png"
              alt=""
              className="w-[900px] max-w-none object-contain xl:w-[1060px]"
            />

            {HERO_FLOATING_CARDS.map((card) => (
              <div
                key={`${card.src}-desktop`}
                className={`absolute ${card.desktopClassName} ${card.animationClass}`}
              >
                <Image
                  src={card.src}
                  alt={card.alt}
                  width={card.width}
                  height={card.height}
                  sizes="256px"
                  className="h-auto w-40 object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.32)]"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 right-0 h-25 w-full bg-linear-to-t from-black to-transparent" />
      </SectionContainer>
    </div>
  );
}
