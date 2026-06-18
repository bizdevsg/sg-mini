import { ButtonLink } from "@/components/atoms/ButtonLink";
import { getCdnAssetUrl, getFramerImageUrl, PUBLIC_HERO_CTA_URL } from "@/lib/env";
import { getMessages, type AppLocale } from "@/locales";

type HeroSectionProps = {
  locale: AppLocale;
};

export function HeroSection({ locale }: HeroSectionProps) {
  const messages = getMessages(locale);

  return (
    <section
      className="bg-cover bg-bottom bg-no-repeat"
      style={{
        backgroundImage:
          `url('${getCdnAssetUrl("bg-hero1.avif")}')`,
      }}
    >
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 sm:pb-16 sm:pt-32 lg:px-10 lg:pb-0 lg:pt-28">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl text-center lg:text-left">
            <h1 className="font-mono text-[2.25rem] font-bold leading-[0.96] tracking-[-0.05em] sm:text-[3.45rem] lg:text-[4.5rem]">
              <span className="text-yellow-500">{messages.hero.titleLead}</span>
              <span className="block text-white">
                {messages.hero.titleBody}
              </span>
            </h1>
            <ButtonLink
              href={PUBLIC_HERO_CTA_URL}
              target="_blank"
              rel="noreferrer"
              size="lg"
              className="mt-8 w-full sm:min-w-[220px] sm:w-auto"
            >
              {messages.hero.cta}
            </ButtonLink>
          </div>

          <div className="relative mx-auto w-full max-w-[22rem] overflow-hidden sm:max-w-[26rem] lg:mx-0 lg:max-w-[30rem]">
            <div className="relative grid min-h-[240px] items-end sm:min-h-[380px] lg:min-h-[500px]">
              <img
                src={getFramerImageUrl(
                  "852i2sfEYXSfE1r3eJjVmPA8KZE.webp?height=1020&width=750",
                )}
                alt={messages.hero.visualAlt}
                className="mx-auto w-full max-w-[280px] sm:max-w-[390px] lg:max-w-[450px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
