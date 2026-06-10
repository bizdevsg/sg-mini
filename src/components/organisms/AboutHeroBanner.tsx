import { SectionContainer } from "@/components/atoms/SectionContainer";

export function AboutHeroBanner() {
  return (
    <SectionContainer className="py-16 sm:py-20">
      <div className="mt-5 rounded-xl bg-yellow-500 py-10 text-center leading-5">
        <h1 className="text-3xl font-bold uppercase text-black md:text-4xl">
          Tentang Solid
        </h1>
        <p className="mt-2 text-xs font-semibold text-black/50">
          Platform trading terdepan di Indonesia
        </p>
      </div>
    </SectionContainer>
  );
}
