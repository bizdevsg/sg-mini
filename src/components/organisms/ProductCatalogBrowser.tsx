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

function formatItemCount(count: number, label: string) {
  return `${count} ${label}`;
}

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
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/${locale}/produk/${category}/${item.slug}`}
                className="group block"
              >
                <article className="overflow-hidden rounded-3xl border border-white/10 bg-[#090909] transition-all duration-300 hover:-translate-y-1 hover:border-yellow-500/40">
                  {/* Image */}
                  <div className="relative overflow-hidden bg-white/[0.02]">
                    {item.imageSrc ? (
                      <img
                        src={item.imageSrc}
                        alt={item.name}
                        className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-zinc-500">
                        {item.name}
                      </div>
                    )}

                    <div className="absolute left-5 top-5">
                      <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-yellow-400">
                        {item.sourceCategory}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h2 className="line-clamp-2 text-xl font-semibold leading-tight text-white">
                      {item.name}
                    </h2>

                    <p className="mt-3 line-clamp-2 text-sm leading-7 text-zinc-400">
                      {item.description}
                    </p>

                    <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                      <span className="text-sm font-medium text-zinc-300">
                        {copy.viewDetailCta}
                      </span>

                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-400 transition-all duration-300 group-hover:bg-yellow-500 group-hover:text-black">
                        →
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
