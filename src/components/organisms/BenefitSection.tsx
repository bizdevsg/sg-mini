import Image from "next/image";
import { SectionContainer } from "../atoms/SectionContainer";
import { getMessages, type AppLocale } from "@/locales";

type BenefitSectionProps = {
  locale: AppLocale;
};

const benefitCardStyles = [
  "bg-linear-to-br from-black/70 via-black/20 to-yellow-500/20",
  "bg-linear-to-bl from-black/70 via-black/20 to-amber-500/20",
  "bg-linear-to-r from-black/70 via-black/20 to-amber-600/20",
] as const;

const benefitCardImages = [
  "/assets/img-card.png",
  "/assets/img-card-2.png",
  "/assets/img-card-3.png",
] as const;

export function BenefitSection({ locale }: BenefitSectionProps) {
  const items = getMessages(locale).benefitSection.items;

  return (
    <SectionContainer className="py-16 md:py-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <div
            key={`${item.eyebrow}-${item.title}`}
            className={`relative overflow-hidden rounded-2xl border-2 border-white/20 p-6 ${benefitCardStyles[index] ?? benefitCardStyles[0]}`}
          >
            <div
              className="absolute top-0 left-0 h-full w-full object-cover opacity-5"
              style={{ backgroundImage: "url('/assets/Texture-Fabrik-Film-Grain_05_PR 1.png')" }}
            />

            <div className="z-10 space-y-8">
              <div className="space-y-1">
                <h5 className="text-white font-normal text-2xl">{item.eyebrow}</h5>
                <h2 className="text-white font-bold text-4xl">{item.title}</h2>
                <p className="mt-2 text-sm text-white/50">{item.description}</p>
              </div>

              <div>
                <Image
                  src={benefitCardImages[index] ?? benefitCardImages[0]}
                  alt={item.imageAlt}
                  height={1000}
                  width={1000}
                  className="h-auto w-full"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
