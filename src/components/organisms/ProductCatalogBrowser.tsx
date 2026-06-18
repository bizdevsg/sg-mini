import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getCdnAssetUrl } from "@/lib/env";

import { SectionContainer } from "@/components/atoms/SectionContainer";
import type { ProductCatalogItem, ProductPageCategory } from "@/lib/products";
import type { AppLocale, AppMessages } from "@/locales";

type ProductCatalogBrowserProps = {
  items: ProductCatalogItem[];
  locale: AppLocale;
  category: ProductPageCategory;
  copy: AppMessages["productPage"];
};

export function ProductCatalogBrowser({
  items,
  locale,
  category,
  copy,
}: ProductCatalogBrowserProps) {
  const categoryCopy = copy.categories[category];

  return (
    <main>
      <div
        className="bg-cover bg-bottom bg-no-repeat py-20 md:py-24"
        style={{
          backgroundImage: `url('${getCdnAssetUrl("bg-hero1.avif")}')`,
        }}
      >
        <SectionContainer className="relative z-10">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex flex-wrap items-center gap-2 text-xs text-gray-400 sm:text-sm"
          >
            <Link
              href={`/${locale}`}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-500 transition hover:bg-yellow-500/20"
            >
              <FontAwesomeIcon icon={["fas", "house"]} className="text-xs" />
            </Link>
            <span className="text-gray-500">{">"}</span>
            <span className="text-gray-400">{copy.breadcrumb}</span>
            <span className="text-gray-500">{">"}</span>
            <span className="font-medium text-white">{categoryCopy.title}</span>
          </nav>

          <div className="text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-yellow-500">
              {copy.productsLabel}
            </p>
            <h1 className="text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl md:text-5xl">
              {categoryCopy.title}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-300 sm:text-base">
              {categoryCopy.description}
            </p>
          </div>
        </SectionContainer>
      </div>

      <SectionContainer className="py-16 sm:py-20">
        {items.length ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/${locale}/produk/${category}/${item.slug}`}
                className="group block"
              >
                <article className="flex h-full flex-col overflow-hidden rounded-[22px] border border-white/8 bg-[linear-gradient(180deg,rgba(18,18,18,0.96)_0%,rgba(10,10,10,0.98)_100%)] transition-all duration-300 hover:-translate-y-1 hover:border-yellow-500/30 hover:shadow-[0_18px_45px_rgba(0,0,0,0.22)]">
                  <div className="relative aspect-[5/4] overflow-hidden border-b border-white/8 bg-white/[0.03]">
                    {item.imageSrc ? (
                      <img
                        src={item.imageSrc}
                        alt={item.name}
                        className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-5 text-center text-sm text-zinc-500">
                        {item.name}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/50">
                        {copy.sourceLabel}
                      </p>
                      <span className="rounded-full bg-white/6 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-foreground/65">
                        {item.sourceCategory}
                      </span>
                    </div>

                    <h3 className="mt-3 line-clamp-2 min-h-[2.75rem] text-base font-semibold leading-snug text-white transition-colors group-hover:text-yellow-400">
                      {item.name}
                    </h3>

                    <p className="mt-2 line-clamp-2 min-h-[3rem] text-sm leading-6 text-foreground/68">
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
