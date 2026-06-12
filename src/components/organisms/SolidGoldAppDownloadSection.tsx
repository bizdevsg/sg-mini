import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ButtonLink } from "@/components/atoms/ButtonLink";
import { SectionContainer } from "@/components/atoms/SectionContainer";

type SolidGoldAppPlatform = {
  title: string;
  description: string;
  availability: string[];
  stores: Array<{
    label: string;
    href: string;
    icon: "google-play" | "apple";
  }>;
};

type SolidGoldAppDownloadSectionProps = {
  title: string;
  subtitle: string;
  platforms: SolidGoldAppPlatform[];
  benefitsTitle: string;
  benefits: string[];
};

export function SolidGoldAppDownloadSection({
  title,
  subtitle,
  platforms,
  benefitsTitle,
  benefits,
}: SolidGoldAppDownloadSectionProps) {
  return (
    <>
      <SectionContainer className="py-16 md:py-20">
        <div className="mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
              {title}
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-zinc-300">
              {subtitle}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {platforms.map((platform, index) => (
              <article
                key={platform.title}
                className="group relative flex flex-col rounded-[20px] border border-line bg-linear-to-br from-slate-900/40 to-slate-900/20 p-6 sm:p-8 backdrop-blur-sm transition-all duration-300 hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/10"
              >
                <div className="absolute right-6 top-6 sm:right-8 sm:top-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-yellow-500 to-amber-600 text-lg font-bold text-white shadow-lg">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                </div>

                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500/20 text-xl text-yellow-400">
                  <FontAwesomeIcon icon={["fas", "mobile-screen-button"]} />
                </div>

                <div className="flex flex-1 flex-col">
                  <h3 className="text-lg font-bold leading-tight text-white sm:text-xl">
                    {platform.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-foreground/70">
                    {platform.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {platform.availability.map((item) => (
                      <span
                        key={item}
                        className="inline-block rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-300"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {platform.stores.map((store) => (
                    <ButtonLink
                      key={`${platform.title}-${store.icon}`}
                      href={store.href}
                      target="_blank"
                      rel="noreferrer"
                      variant="ghost"
                      className="justify-between border-white/15 text-white"
                    >
                      <span className="inline-flex items-center gap-2">
                        <FontAwesomeIcon icon={["fab", store.icon]} />
                        {store.label}
                      </span>
                      <FontAwesomeIcon icon={["fas", "arrow-right"]} />
                    </ButtonLink>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </SectionContainer>
    </>
  );
}
