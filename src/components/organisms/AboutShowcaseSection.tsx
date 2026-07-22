import { SectionContainer } from "@/components/atoms/SectionContainer";
import { AboutShowcaseCard } from "@/components/molecules/AboutShowcaseCard";
import { SectionIntro } from "@/components/molecules/SectionIntro";
import { ScrollReveal } from "../molecules/ScrollReveal";

type AboutShowcaseItem = {
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
};

type AboutShowcaseSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  items: AboutShowcaseItem[];
  surfaceClassName?: string;
};

export function AboutShowcaseSection({
  eyebrow,
  title,
  description,
  items,
  surfaceClassName,
}: AboutShowcaseSectionProps) {
  return (
    <section className={surfaceClassName}>
      <SectionContainer className="py-10 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
          <ScrollReveal effect="fade-right">
            <SectionIntro
              eyebrow={eyebrow}
              title={title}
              description={description}
              className="max-w-md"
              eyebrowClassName="uppercase tracking-[0.24em] text-yellow-500"
            />
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 gap-4">
            {items.map((item, index) => (
              <ScrollReveal key={`${item.title}-${item.subtitle}`} effect="fade-left" delay={index * 500}>
                <AboutShowcaseCard
                  title={item.title}
                  subtitle={item.subtitle}
                  imageSrc={item.imageSrc}
                  imageAlt={item.imageAlt}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}
