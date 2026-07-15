import Image from "next/image";

import { SectionContainer } from "@/components/atoms/SectionContainer";
import { getMessages, type AppLocale } from "@/locales";

type AboutCompanyProfileSectionProps = {
  locale: AppLocale;
  companyName?: string;
  paragraphs?: string[];
};

export function AboutCompanyProfileSection({
  locale,
  companyName,
  paragraphs,
}: AboutCompanyProfileSectionProps) {
  const { companyProfile } = getMessages(locale).aboutPage;

  const profileParagraphs =
    paragraphs && paragraphs.length > 0
      ? paragraphs
      : companyProfile.paragraphs;

  return (
    <div
      className="relative bg-cover bg-top bg-no-repeat backdrop-blur-2xl sm:pt-10"
      style={{
        backgroundImage: "url('/assets/BCG.png')",
      }}
    >
      <SectionContainer className="py-16 sm:py-20">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-12">
          <div
            className="rounded-[28px] border border-white/8 bg-black/20 p-8"
            data-aos="zoom-in"
          >
            <div className="relative flex h-full items-center justify-center">
              <Image
                src="/assets/Logo SG-WEB111.png"
                alt={companyProfile.logoAlt}
                width={180}
                height={180}
                className="h-auto w-40 object-contain lg:w-48"
                style={{ height: "auto" }}
              />
            </div>
          </div>

          <div data-aos="fade-up" data-aos-delay="120">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-yellow-500">
              {companyProfile.eyebrow}
            </span>

            <h2 className="mt-5 text-3xl font-bold leading-tight text-white md:text-4xl ">
              {companyName || companyProfile.title}
            </h2>

            <div className="border-t border-white/8 pt-6 text-base md:text-lg">
              {profileParagraphs.map((paragraph, index) => (
                <p
                  key={`${companyName || companyProfile.title}-${index}`}
                  className={`text-shadow-lg text-shadow-black text-justify leading-8 text-zinc-300 ${index !== 0 ? "mt-4" : ""
                    }`}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </SectionContainer >

      <div className="absolute bottom-0 left-0 w-full h-25 bg-linear-to-t from-black to-transparent" />
    </div >
  );
}
