import { SectionContainer } from "@/components/atoms/SectionContainer";
import { SectionEyebrow } from "@/components/atoms/SectionEyebrow";
import { regulatorLogos } from "@/types/landing";
import { getMessages, type AppLocale } from "@/locales";
import { RegulatorLogoItem } from "@/components/molecules/RegulatorLogoItem";

type RegulatorMarqueeSectionProps = {
  locale: AppLocale;
};

export function RegulatorMarqueeSection({
  locale,
}: RegulatorMarqueeSectionProps) {
  const messages = getMessages(locale);
  const marqueeLogos = [
    ...regulatorLogos,
    ...regulatorLogos,
    ...regulatorLogos,
    ...regulatorLogos,
  ];

  return (
    <section className="bg-linear-180 from-black to-transparent">
      <SectionContainer className="py-10 sm:py-16 md:py-20">
        <div className="flex flex-col items-center gap-5">
          <SectionEyebrow align="center">
            {messages.regulator.eyebrow}
          </SectionEyebrow>

          <div className="w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <div className="py-5 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
              <div
                className="flex w-max min-w-max items-center whitespace-nowrap"
                style={{
                  animation: "regulator-marquee 30s linear infinite",
                  willChange: "transform",
                }}
              >
                {marqueeLogos.map((logo, index) => (
                  <div
                    key={`${logo.alt}-${index}`}
                    className="shrink-0 pr-4 sm:pr-6 lg:pr-8 last:pr-0"
                    aria-hidden={index >= regulatorLogos.length}
                  >
                    <RegulatorLogoItem
                      logo={logo}
                      priority={index < regulatorLogos.length}
                      useFill
                      sizes="(max-width: 640px) 160px, (max-width: 1024px) 192px, 224px"
                      imageClassName="object-contain opacity-85"
                      containerClassName="h-[4.5rem] w-[9.5rem] rounded-2xl border border-white/6 bg-white/[0.03] p-3 sm:h-20 sm:w-[10.5rem] md:h-[5.5rem] md:w-[11.5rem]"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}
