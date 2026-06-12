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
      <SectionContainer className="py-16 md:py-20">
        <div className="flex flex-col items-center gap-5">
          <SectionEyebrow align="center">
            {messages.regulator.eyebrow}
          </SectionEyebrow>

          <div className="w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <div className="border border-yellow-500/16 bg-white/[0.02] py-5 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
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
                    className="shrink-0 pr-20 last:pr-0"
                    aria-hidden={index >= regulatorLogos.length}
                  >
                    <RegulatorLogoItem
                      logo={logo}
                      priority={index < regulatorLogos.length}
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
