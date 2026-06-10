import Image from "next/image";

import { SectionContainer } from "@/components/atoms/SectionContainer";
import { getMessages, type AppLocale } from "@/locales";

type AboutCompanyProfileSectionProps = {
  locale: AppLocale;
};

export function AboutCompanyProfileSection({
  locale,
}: AboutCompanyProfileSectionProps) {
  const { companyProfile } = getMessages(locale).aboutPage;

  return (
    <SectionContainer className="py-16 sm:py-20">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-12">
        <div className="rounded-[28px] border border-white/8 bg-black/20 p-8">
          <div className="relative flex h-full items-center justify-center">
            <Image
              src="https://cdn.pandalingua.my.id/sgb/assets/Logo%20SG-WEB111.png"
              alt={companyProfile.logoAlt}
              width={180}
              height={180}
              className="h-auto w-40 object-contain lg:w-48"
            />
          </div>
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-yellow-500">
            {companyProfile.eyebrow}
          </span>

          <h2 className="mt-5 text-3xl font-bold leading-tight text-white md:text-4xl">
            {companyProfile.title}
          </h2>

          <div className="border-t border-white/8 pt-6 text-base md:text-lg">
            <p className="text-justify leading-8 text-zinc-300">
              {companyProfile.paragraphs[0]}
            </p>

            <p className="mt-4 text-justify leading-8 text-zinc-300">
              {companyProfile.paragraphs[1]}
            </p>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
