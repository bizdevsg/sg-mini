import { SectionContainer } from "@/components/atoms/SectionContainer";
import { SectionEyebrow } from "@/components/atoms/SectionEyebrow";
import { AboutShowcaseCard } from "@/components/molecules/AboutShowcaseCard";

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
          <div className="max-w-md">
            <SectionEyebrow className="uppercase tracking-[0.24em] text-yellow-500">
              {eyebrow}
            </SectionEyebrow>
            <h2 className="mt-5 text-3xl font-bold text-white md:text-4xl">
              {title}
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-300 sm:text-base">
              {description}
            </p>
          </div>

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
