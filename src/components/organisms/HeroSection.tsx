"use client";

import Image from "next/image";
import Link from "next/link";

import { getMessages, type AppLocale } from "@/locales";
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
        "right-[48%] top-[20%] w-[6.75rem] sm:right-[48.5%] sm:top-[18%] sm:w-[8.75rem]",
      desktopClassName: "left-[36rem] top-[4.75rem] w-[8rem]",
      animationClass: "animate-[hero-float_6.5s_ease-in-out_infinite]",
    },
    {
      src: "/assets/Floating Info Card 2.png",
      alt: "Floating market card",
      width: 648,
      height: 264,
      mobileClassName:
        "right-[31%] top-[33%] w-[6.75rem] sm:right-[28%] sm:top-[33%] sm:w-[8.75rem]",
      desktopClassName: "right-[7.5rem] top-[10rem] w-[8rem]",
      animationClass: "animate-[hero-float-alt_7.2s_ease-in-out_infinite]",
    },
    {
      src: "/assets/Floating Info Card 3.png",
      alt: "Floating growth card",
      width: 684,
      height: 264,
      mobileClassName:
        "right-[50%] top-[50%] w-[6.75rem] sm:right-[50.5%] sm:top-[50%] sm:w-[8.75rem]",
      desktopClassName: "left-[34rem] bottom-[13.5rem] w-[8rem]",
      animationClass: "animate-[hero-float_7.6s_ease-in-out_infinite]",
    },
    {
      src: "/assets/Floating Info Card 4.png",
      alt: "Floating metrics card",
      width: 768,
      height: 264,
      mobileClassName:
        "right-[32%] top-[65%] w-[6.75rem] sm:right-[30%] sm:top-[65%] sm:w-[8.75rem]",
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
      <SectionContainer className="relative mb-16 sm:mb-0 sm:pt-16 sm:mt-10 md:mt-0 md:pt-20">
        <div className="relative isolate z-10 flex flex-col gap-4 lg:min-h-[620px] lg:justify-center xl:min-h-[680px]">
          {/* Mobile Image */}
          <div className="relative order-1 mx-auto h-[500px] w-full xl:hidden sm:h-[620px] md:h-[700px]">
            <div className="pointer-events-none absolute top-15 left-[57%] h-full w-[min(1320px,210vw)] -translate-x-1/2">
              <img
                src="/assets/Banner Utama-HP-NO CUT.png"
                alt={messages.hero.visualAlt}
                className="h-full w-full object-contain"
              />

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
                    priority={card.src === "/assets/Floating Info Card 3.png"}
                    sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, 176px"
                    unoptimized={card.src === "/assets/Floating Info Card 3.png"}
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
              <p className="font-bold text-white text-xl">
                Download Aplikasi Sekarang!
              </p>

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
          </div>

          {/* Desktop Image */}
          <div
            className="pointer-events-none absolute z-0 hidden xl:bottom-7 xl:right-[-7.5rem] xl:block"
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
                  priority={card.src === "/assets/Floating Info Card 3.png"}
                  sizes="256px"
                  unoptimized={card.src === "/assets/Floating Info Card 3.png"}
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