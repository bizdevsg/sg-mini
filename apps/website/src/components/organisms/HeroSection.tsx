import Image from "next/image";

import { ScrollReveal } from "@/components/molecules/ScrollReveal";
import { getMessages, type AppLocale } from "@/locales";
import { AppDownloadModalTriggerButton } from "@/components/molecules/AppDownloadModalTriggerButton";
import { SectionContainer } from "../atoms/SectionContainer";

type HeroSectionProps = {
  locale: AppLocale;
};

export function HeroSection({ locale }: HeroSectionProps) {
  const messages = getMessages(locale);

  const HERO_FLOATING_CARDS = [
    {
      src: "/assets/Floating Info Card 1.webp",
      alt: "Floating trading insight card",
      width: 648,
      height: 264,
      mobileClassName:
        "right-[28%] top-[20%] w-[7rem] sm:right-[28%] sm:top-[25%] sm:w-[10rem]",
      desktopClassName: "left-[38rem] top-[4.75rem] w-[6rem]",
      animationClass: "animate-[hero-float_6.5s_ease-in-out_infinite]",
    },
    {
      src: "/assets/Floating Info Card 2.webp",
      alt: "Floating market card",
      width: 648,
      height: 264,
      mobileClassName:
        "right-[-3%] top-[43%] w-[7rem] sm:right-[-3%] sm:top-[50%] sm:w-[10rem]",
      desktopClassName: "right-[9.5rem] top-[10rem] w-[6rem]",
      animationClass: "animate-[hero-float-alt_7.2s_ease-in-out_infinite]",
    },
    {
      src: "/assets/Floating Info Card 3.webp",
      alt: "Floating growth card",
      width: 684,
      height: 264,
      mobileClassName:
        "right-[32%] top-[80%] w-[7rem] sm:right-[32%] sm:top-[80%] sm:w-[10rem]",
      desktopClassName: "left-[36rem] bottom-[17.5rem] w-[6rem]",
      animationClass: "animate-[hero-float_7.6s_ease-in-out_infinite]",
    },
    {
      src: "/assets/Floating Info Card 4.webp",
      alt: "Floating metrics card",
      width: 768,
      height: 264,
      mobileClassName:
        "right-[0%] top-[110%] w-[7rem] sm:right-[0%] sm:top-[105%] sm:w-[10rem]",
      desktopClassName: "right-[10.5rem] bottom-[12rem] w-[6rem]",
      animationClass: "animate-[hero-float-alt_6.8s_ease-in-out_infinite]",
    },
  ] as const;

  return (
    <div
      className="relative overflow-hidden bg-black bg-top bg-no-repeat"
      style={{
        backgroundImage: "url('/assets/BCG.webp')",
      }}
    >
      <SectionContainer className="relative mb-10 sm:mb-0 sm:pt-16 sm:mt-10 md:mt-0 md:pt-20">
        <div className="relative isolate z-10 flex flex-col gap-4 lg:min-h-[620px] lg:justify-center xl:min-h-[680px]">
          {/* Mobile Image */}
          <ScrollReveal
            className="relative order-1 mx-auto h-[450px] w-full xl:hidden sm:h-[570px] md:h-[650px] mt-5 sm:mt-0"
            effect="fade-left"
            delay={120}
          >
            <div className="pointer-events-none absolute top-15 left-[34%] sm:left-[45%] h-full w-[min(1100px,170vw)] -translate-x-1/2 origin-top scale-[0.65] sm:scale-[0.75]">
              <img
                src="/assets/Banner Paten Web Solid New-5.webp"
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
                    priority={card.src === "/assets/Floating Info Card 3.webp"}
                    sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, 176px"
                    unoptimized={card.src === "/assets/Floating Info Card 3.webp"}
                    className="h-auto w-full object-contain drop-shadow-[0_18px_35px_rgba(0,0,0,0.32)]"
                  />
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Text Content */}
          <ScrollReveal
            className="relative order-2 z-10 mx-auto text-center lg:max-w-2xl xl:mx-0 xl:max-w-[48rem] xl:text-left"
            effect="fade-up"
          >
            <h1 className="font-mono text-3xl font-bold leading-[1.2] tracking-[-0.05em] sm:text-[3.2rem] md:text-[4rem] lg:text-[3rem] xl:text-[4rem]">
              <span className="text-yellow-500 text-shadow-md text-shadow-black">
                {messages.hero.titleLead}
              </span>
              <span className="block text-white">
                {messages.hero.titleBody}
              </span>
            </h1>

            <p className="mt-3 text-center sm:text-lg text-white/85 text-shadow-lg text-shadow-black xl:text-left">
              {messages.hero.subTitle}
            </p>

            <div className="mt-5">
              <p className="font-bold text-white text-xl">
                Download Aplikasi Sekarang!
              </p>

              <div className="flex flex-col mx-auto xl:mx-0 sm:flex-row items-center gap-2 mt-2 sm:w-fit">
                <AppDownloadModalTriggerButton
                  locale={locale}
                  label="Open Account"
                  variant="primary"
                  size="md"
                  visualVariant="qr"
                  className="w-full sm:w-fit min-w-75 rounded-xl px-5 cursor-pointer"
                />

                {/* <AppDownloadModalTriggerButton
                  locale={locale}
                  label={messages.hero.demoLoginCta}
                  variant="ghost"
                  size="md"
                  visualVariant="qr"
                  className="w-full sm:w-fit rounded-xl px-5 cursor-pointer"
                /> */}
              </div>

              <p className="text-white/50 text-xs mt-3">
                {messages.hero.demoDisclaimer}
              </p>
            </div>
          </ScrollReveal>

          {/* Desktop Image */}
          <ScrollReveal
            className="pointer-events-none absolute z-0 hidden xl:bottom-7 xl:right-[-7.5rem] xl:block"
            aria-hidden="true"
            effect="fade-left"
            delay={160}
          >
            <img
              src="/assets/Banner SGB-FIX-1.webp"
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
                  priority={card.src === "/assets/Floating Info Card 3.webp"}
                  sizes="256px"
                  unoptimized={card.src === "/assets/Floating Info Card 3.webp"}
                  className="h-auto w-40 object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.32)]"
                />
              </div>
            ))}
          </ScrollReveal>
        </div>

        <div className="pointer-events-none absolute bottom-0 right-0 h-25 w-full bg-linear-to-t from-black to-transparent" />
      </SectionContainer>
    </div>
  );
}
