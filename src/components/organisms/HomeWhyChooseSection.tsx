import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { SectionContainer } from "@/components/atoms/SectionContainer";
import { SectionEyebrow } from "@/components/atoms/SectionEyebrow";
import { getMessages, type AppLocale } from "@/locales";
import type { HomeWhyChooseItemId } from "@/locales/shared/messages";

type HomeWhyChooseSectionProps = {
  locale: AppLocale;
};

export const ICON_MAP: Record<HomeWhyChooseItemId, string> = {
  legal: "/assets/justice_1781185.png",
  experience: "/assets/experience_9295588.png",
  support: "/assets/online-chat_2600350.png",
  ebook: "/assets/ebook_6795784.png",
};

export function HomeWhyChooseSection({
  locale,
}: HomeWhyChooseSectionProps) {
  const copy = getMessages(locale).homeWhyChoose;

  return (
    <section className="pb-16 sm:pb-20">
      <SectionContainer>
        <div className="mx-auto max-w-4xl text-center">
          <SectionEyebrow align="center">{copy.eyebrow}</SectionEyebrow>

          <h2 className="mt-5 text-3xl font-bold leading-tight tracking-[-0.04em] text-white sm:text-4xl lg:text-[2.8rem]">
            {copy.titleLead}{" "}{copy.titleBody}
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-zinc-400 sm:text-base">
            {copy.description}
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {copy.items.map((item) => (
            <article
              key={item.id}
              className="group flex h-full flex-col items-center rounded-[20px] border border-line bg-linear-to-br from-white/5 to-white/2 p-6 text-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-sm transition-all duration-300 hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/10 sm:p-8"
            >
              <div className="flex items-center justify-center">
                <Image
                  src={ICON_MAP[item.id]}
                  alt={item.title}
                  width={100}
                  height={100}
                  className="h-15 w-15 object-contain"
                />
              </div>

              <h3 className="mt-5 font-mono text-lg font-bold leading-snug text-stone-100 sm:text-xl">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-zinc-400 sm:text-base">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}
