import Image from "next/image";

import { SectionContainer } from "@/components/atoms/SectionContainer";
import type { AppLocale } from "@/locales";

type AppPromoSectionProps = {
  locale: AppLocale;
};

const appBenefits = [
  "Trading komoditas kapan saja dan di mana saja",
  "Pantau pergerakan harga dan informasi market secara real time",
  "Kelola akun trading dengan mudah dan praktis",
];

export function AppPromoSection({ locale: _locale }: AppPromoSectionProps) {
  return (
    <section className="">
      <SectionContainer className="py-16 sm:py-20 lg:py-18">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
          <div className="mx-auto w-full">
            <Image
              src="/assets/solid-phone.png"
              alt="Mockup Handphone"
              width={640}
              height={640}
              className="h-auto w-full"
            />
          </div>

          <div className="max-w-2xl">
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
              Peluang Trading Komoditas dalam Satu Genggaman
            </h5>

            <p className="mt-5 text-justify text-sm leading-7 text-zinc-300 sm:text-base">
              Akses pasar komoditas dengan lebih mudah melalui satu aplikasi.
              Pantau pergerakan harga, kelola akun, dan lakukan transaksi
              komoditas secara fleksibel selama 24/5.
            </p>

            <ul className="mt-6 grid gap-3 text-sm text-zinc-200 sm:text-base">
              {appBenefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-start gap-3 rounded-2xl border border-line/80 bg-white/[0.03] px-4 py-3"
                >
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-yellow-500" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center gap-4">
              <a href="">
                <Image
                  src="/assets/image.avif"
                  alt="Download di Google Play"
                  width={5514}
                  height={1612}
                  sizes="160px"
                  className="h-auto w-40 object-contain"
                />
              </a>

              <a href="">
                <Image
                  src="/assets/image (1).avif"
                  alt="Download di App Store"
                  width={5514}
                  height={1612}
                  sizes="160px"
                  className="h-auto w-40 object-contain"
                />
              </a>
            </div>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}
