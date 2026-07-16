import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { PageHeroBanner } from "@/components/organisms/PageHeroBanner";
import { SectionContainer } from "@/components/atoms/SectionContainer";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";
import type { ProductCatalogItem, ProductPageCategory } from "@/lib/products";
import type { AppLocale, AppMessages } from "@/locales";

type ProductCatalogBrowserProps = {
  items: ProductCatalogItem[];
  locale: AppLocale;
  homeLabel: string;
  category: ProductPageCategory;
  copy: AppMessages["productPage"];
};

export function ProductCatalogBrowser({
  items,
  locale,
  homeLabel,
  category,
  copy,
}: ProductCatalogBrowserProps) {
  const categoryCopy = copy.categories[category];

  return (
    <main>
      <PageHeroBanner
        locale={locale}
        homeLabel={homeLabel}
        eyebrow={categoryCopy.eyebrow}
        title={categoryCopy.title}
        description={categoryCopy.description}
        breadcrumbs={[
          {
            label: copy.breadcrumb,
            tone: "accent",
          },
          {
            label: categoryCopy.title,
            tone: "current",
          },
        ]}
      />

      <SectionContainer className="relative py-16 sm:py-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-25 bg-linear-to-b from-black to-transparent" />

        {items.length ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {items.map((item, index) => (
              <ScrollReveal
                key={item.id}
                className="group block"
                effect="fade-up"
                delay={Math.min(index * 80, 240)}
              >
                <Link
                  href={`/${locale}/produk/${category}/${item.slug}`}
                  className="block h-full"
                >
                  <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(180deg,#1a1a1a,#101010)] transition-all duration-300 hover:-translate-y-1 hover:border-yellow-500/30 hover:shadow-[0_18px_45px_rgba(205,161,58,0.12)]">
                    <div className="relative flex h-60 items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,rgba(205,161,58,0.18),transparent_70%),linear-gradient(180deg,#1c1c1c,#121212)]">
                      {item.imageSrc ? (
                        <img
                          src={item.imageSrc}
                          alt={item.name}
                          className="max-h-full max-w-full w-full object-cover transition duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-500/15 text-yellow-400">
                          <FontAwesomeIcon
                            icon={["fas", "box-open"]}
                            className="text-2xl"
                          />
                        </div>
                      )}

                      <div className="absolute bottom-0 w-full bg-linear-to-t from-black to-transparent p-4">
                        <h3 className="line-clamp-2 text-xl font-bold leading-tight text-white transition-colors group-hover:text-yellow-300">
                          {item.name}
                        </h3>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-center gap-3 text-xs text-yellow-500/70">
                        <span className="flex items-center gap-1.5">
                          <FontAwesomeIcon
                            icon={["fas", "layer-group"]}
                            className="text-[10px]"
                          />
                          {copy.sourceLabel}
                        </span>

                        <span className="h-px flex-1 bg-yellow-500/10" />

                        <span className="flex items-center gap-1.5">
                          <FontAwesomeIcon
                            icon={["fas", "tag"]}
                            className="text-[10px]"
                          />
                          {item.sourceCategory}
                        </span>
                      </div>

                      <p className="mt-4 line-clamp-3 min-h-[4.8rem] text-sm leading-7 text-zinc-400">
                        {item.description}
                      </p>

                      <div className="mt-auto pt-6">
                        <div className="flex items-center justify-between border-t border-white/10 pt-4">
                          <span className="font-medium text-zinc-200 transition group-hover:text-yellow-400">
                            {copy.viewDetailCta}
                          </span>

                          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 transition-all duration-300 group-hover:translate-x-1 group-hover:bg-yellow-500 group-hover:text-black">
                            <FontAwesomeIcon
                              icon={["fas", "arrow-right"]}
                              className="text-sm"
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <ScrollReveal
            className="mt-10 rounded-3xl border border-yellow-500/20 bg-yellow-500/[0.04] p-6 sm:p-8"
            effect="fade-up"
          >
            <h2 className="text-xl font-bold text-white">{copy.emptyTitle}</h2>
            <p className="mt-2 text-sm leading-7 text-zinc-400">
              {copy.emptyBody}
            </p>
          </ScrollReveal>
        )}
      </SectionContainer>
    </main>
  );
}
