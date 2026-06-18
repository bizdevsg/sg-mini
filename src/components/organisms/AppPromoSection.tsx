import Image from "next/image";

import { SectionContainer } from "@/components/atoms/SectionContainer";
import {
  PUBLIC_SOLID_GOLD_APP_STORE_URL,
  PUBLIC_SOLID_GOLD_PLAY_STORE_URL,
} from "@/lib/env";
import { getMessages, type AppLocale } from "@/locales";

type AppPromoSectionProps = {
  locale: AppLocale;
};

export function AppPromoSection({ locale }: AppPromoSectionProps) {
  const copy = getMessages(locale).appPromoSection;

  return (
    <section className="">
      <SectionContainer className="py-14 sm:py-20 lg:py-18">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-10">
          <div className="mx-auto w-full">
            <Image
              src="/assets/solid-phone.png"
              alt={copy.imageAlt}
              width={640}
              height={640}
              className="mx-auto h-auto w-full max-w-[420px] lg:max-w-none"
            />
          </div>

          <div className="max-w-2xl text-center lg:text-left">
            {/* <div className="flex items-center gap-3 mb-4">
              <Image
                src="/assets/Logo SG-WEB111.png"
                alt="Logo Solid Gold"
                width={80}
                height={80}
                className="h-10 w-10 object-contain"
              />
            </div> */}

            <h5 className="text-lg font-semibold text-white sm:text-xl">
              {copy.title}
            </h5>

            <p className="mt-5 text-sm leading-7 text-zinc-300 sm:text-base lg:text-justify">
              {copy.description}
            </p>

            <ul className="mt-6 grid gap-3 text-sm text-zinc-200 sm:text-base">
              {copy.benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-start gap-3 rounded-2xl text-left border border-line/80 bg-white/[0.03] px-4 py-3"
                >
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-yellow-500" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
              <a
                href={PUBLIC_SOLID_GOLD_PLAY_STORE_URL}
                target="_blank"
                rel="noreferrer"
              >
                <Image
                  src="/assets/image.avif"
                  alt={copy.googlePlayAlt}
                  width={5514}
                  height={1612}
                  sizes="(max-width: 640px) 144px, 160px"
                  className="h-auto w-36 object-contain sm:w-40"
                />
              </a>

              <a
                href={PUBLIC_SOLID_GOLD_APP_STORE_URL}
                target="_blank"
                rel="noreferrer"
              >
                <Image
                  src="/assets/image (1).avif"
                  alt={copy.appStoreAlt}
                  width={5514}
                  height={1612}
                  sizes="(max-width: 640px) 144px, 160px"
                  className="h-auto w-36 object-contain sm:w-40"
                />
              </a>
            </div>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}
