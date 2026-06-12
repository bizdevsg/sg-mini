import { SectionContainer } from "@/components/atoms/SectionContainer";
import { AboutShowcaseCard } from "@/components/molecules/AboutShowcaseCard";
import { SectionIntro } from "@/components/molecules/SectionIntro";

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
      <SectionContainer className="py-16 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
          <SectionIntro
            eyebrow={eyebrow}
            title={title}
            description={description}
            className="max-w-md"
            eyebrowClassName="uppercase tracking-[0.24em] text-yellow-500"
          />

          <div className="grid grid-cols-2 gap-4">
            {items.map((item) => (
              <AboutShowcaseCard
                key={`${item.title}-${item.subtitle}`}
                title={item.title}
                subtitle={item.subtitle}
                imageSrc={item.imageSrc}
                imageAlt={item.imageAlt}
              />
            ))}
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}
