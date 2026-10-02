import Image from "next/image";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";
import { SectionContainer } from "../atoms/SectionContainer";
import { getMessages, type AppLocale } from "@/locales";

type BenefitSectionProps = {
  locale: AppLocale;
  /** Narrow layout for placing inside a dashboard column (no page container). */
  compact?: boolean;
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

const benefitCardAos = [
  "fade-right",
  "fade-up",
  "fade-left",
] as const;

export function BenefitSection({ locale, compact = false }: BenefitSectionProps) {
  const items = getMessages(locale).benefitSection.items;

  const grid = (
    <div
      className={`grid grid-cols-1 gap-4 ${compact ? "sm:grid-cols-3" : "md:grid-cols-3"}`}
    >
        {items.map((item, index) => (
          <ScrollReveal
            key={`${item.eyebrow}-${item.title}`}
            className={`relative overflow-hidden rounded-2xl border-2 border-white/20 ${compact ? "p-4" : "p-6"} ${benefitCardStyles[index] ?? benefitCardStyles[0]}`}
            effect={benefitCardAos[index] ?? "fade-up"}
            delay={index * 80}
          >
            <div
              className="absolute top-0 left-0 h-full w-full object-cover opacity-5"
              style={{ backgroundImage: "url('/assets/Texture-Fabrik-Film-Grain_05_PR 1.png')" }}
            />

            <div className={`z-10 ${compact ? "space-y-4" : "space-y-8"}`}>
              <div className="space-y-1">
                <h5 className={`text-white font-normal ${compact ? "text-base" : "text-2xl"}`}>{item.eyebrow}</h5>
                <h2 className={`text-white font-bold ${compact ? "text-xl" : "text-4xl"}`}>{item.title}</h2>
                <p className={`mt-2 text-white/50 ${compact ? "text-xs" : "text-sm"}`}>{item.description}</p>
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
          </ScrollReveal>
        ))}
    </div>
  );

  if (compact) {
    return grid;
  }

  return <SectionContainer className="py-10 md:py-20">{grid}</SectionContainer>;
}
