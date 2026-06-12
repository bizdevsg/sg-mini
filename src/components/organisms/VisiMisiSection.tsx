import { SectionContainer } from "@/components/atoms/SectionContainer";
import { SectionEyebrow } from "@/components/atoms/SectionEyebrow";
import { VisiMisiCard } from "@/components/molecules/VisiMisiCard";
import { VisiMisiSummary } from "@/components/molecules/VisiMisiSummary";
import { getMessages, type AppLocale } from "@/locales";

type VisiMisiSectionProps = {
  locale: AppLocale;
};

export default function VisiMisiSection({ locale }: VisiMisiSectionProps) {
  const { visiMisi } = getMessages(locale).aboutPage;

  return (
    <SectionContainer className="py-16 md:py-20">
      <div className="max-w-3xl">
        <SectionEyebrow textClassName="tracking-[0.24em]">
          {visiMisi.eyebrow}
        </SectionEyebrow>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
        <VisiMisiCard
          title={visiMisi.missionTitle}
          items={visiMisi.missionItems}
          indexLabel="01"
        />
        <VisiMisiCard
          title={visiMisi.visionTitle}
          items={visiMisi.visionItems}
          indexLabel="02"
        />
      </div>

      <VisiMisiSummary>{visiMisi.summary}</VisiMisiSummary>
    </SectionContainer>
  );
}
