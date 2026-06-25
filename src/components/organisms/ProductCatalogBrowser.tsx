import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { PageHeroBanner } from "@/components/organisms/PageHeroBanner";
import { SectionContainer } from "@/components/atoms/SectionContainer";
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
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/${locale}/produk/${category}/${item.slug}`}
                className="group block"
              >
                <article className="flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.04),rgba(0,0,0,0.25))] text-left transition-all duration-300 hover:border-yellow-500/30 hover:shadow-[0_0_40px_rgba(205,161,58,0.08)]">
                  <div className="relative h-52 w-full overflow-hidden">
                    {item.imageSrc ? (
                      <>
                        <img
                          src={item.imageSrc}
                          alt={item.name}
                          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      </>
                    ) : (
                      <div className="relative flex h-full items-end bg-gradient-to-br from-yellow-500/20 via-yellow-500/5 to-transparent p-5">
                        <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/15 text-yellow-400">
                          <FontAwesomeIcon
                            icon={["fas", "box-open"]}
                            className="text-sm"
                          />
                        </div>
                      </div>
                    )}

                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-mono text-lg font-bold leading-snug text-white drop-shadow-lg line-clamp-2 transition-colors group-hover:text-yellow-300">
                        {item.name}
                      </h3>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-3 text-xs text-yellow-500/60">
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

                    <p className="mt-4 line-clamp-3 min-h-[4.5rem] text-sm leading-7 text-foreground/72">
                      {item.description}
                    </p>

                    <div className="mt-auto pt-4">
                      <div className="flex items-center justify-between border-t border-white/8 pt-3">
                        <span className="text-sm font-medium text-zinc-200 transition-colors group-hover:text-yellow-400">
                          {copy.viewDetailCta}
                        </span>
                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-yellow-500/25 bg-yellow-500/8 text-yellow-400 transition-all duration-300 group-hover:translate-x-0.5 group-hover:bg-yellow-500 group-hover:text-black">
                          <FontAwesomeIcon
                            icon={["fas", "arrow-right"]}
                            className="text-xs"
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border border-yellow-500/20 bg-yellow-500/[0.04] p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white">{copy.emptyTitle}</h2>
            <p className="mt-2 text-sm leading-7 text-zinc-400">
              {copy.emptyBody}
            </p>
          </div>
        )}
      </SectionContainer>
    </main>
  );
}
