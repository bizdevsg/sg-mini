import { SectionContainer } from "@/components/atoms/SectionContainer";
import { PageHeroBanner } from "@/components/organisms/PageHeroBanner";
import type { ProductCatalogItem, ProductPageCategory } from "@/lib/products";
import type { AppLocale, AppMessages } from "@/locales";

type ProductDetailPageProps = {
  item: ProductCatalogItem;
  locale: AppLocale;
  homeLabel: string;
  category: ProductPageCategory;
  copy: AppMessages["productPage"];
};

export function ProductDetailPage({
  item,
  locale,
  homeLabel,
  category,
  copy,
}: ProductDetailPageProps) {
  const categoryCopy = copy.categories[category];
  const specificationContentClassName = [
    "overflow-x-auto text-[15px] leading-7 text-zinc-200 sm:text-base",
    "[scrollbar-color:rgba(234,179,8,0.55)_rgba(255,255,255,0.08)] [scrollbar-width:thin]",
    "[&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2",
    "[&::-webkit-scrollbar-track]:bg-white/[0.08]",
    "[&::-webkit-scrollbar-track]:rounded-full",
    "[&::-webkit-scrollbar-thumb]:rounded-full",
    "[&::-webkit-scrollbar-thumb]:bg-yellow-500/55",
    "[&_a]:font-medium [&_a]:text-yellow-400 [&_a]:underline [&_a]:underline-offset-4",
    "[&_center]:block",
    "[&_p]:mb-3 [&_p]:leading-7 [&_p:last-child]:mb-0",
    "[&_br]:leading-7",
    "[&_table]:mb-1 [&_table]:w-full [&_table]:min-w-[640px] [&_table]:border-collapse [&_table]:overflow-hidden",
    "[&_tbody]:align-top",
    "[&_tr]:border-b [&_tr]:border-white/10 [&_tr:last-child]:border-b-0",
    "[&_td]:border [&_td]:border-white/10 [&_td]:bg-white/[0.02] [&_td]:px-4 [&_td]:py-3 [&_td]:align-top",
    "[&_td:first-child]:w-[36%] [&_td:first-child]:min-w-[220px] [&_td:first-child]:bg-white/[0.04] [&_td:first-child]:font-semibold [&_td:first-child]:text-white",
    "[&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6",
    "[&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6",
    "[&_li]:mb-1.5 [&_li]:pl-1",
    "[&_strong]:font-semibold [&_strong]:text-white",
  ].join(" ");

  return (
    <main>
      <PageHeroBanner
        locale={locale}
        homeLabel={homeLabel}
        eyebrow={categoryCopy.eyebrow}
        title={item.name}
        description={item.description}
        breadcrumbs={[
          {
            label: copy.breadcrumb,
            href: `/${locale}/produk/${category}`,
            tone: "accent",
          },
          {
            label: categoryCopy.title,
            href: `/${locale}/produk/${category}`,
          },
          {
            label: item.name,
            tone: "current",
          },
        ]}
      />

      <div className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-105 bg-linear-to-b from-black via-black/70 to-transparent" />

        <SectionContainer className="py-16 sm:py-20">
          <div className="relative z-10 grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-8">
            <div className="h-fit rounded-[28px] border border-white/10 bg-[rgba(8,8,8,0.78)] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.22)] sm:p-6">
              {item.imageSrc ? (
                <img
                  src={item.imageSrc}
                  alt={item.name}
                  className="w-full rounded-2xl object-contain"
                />
              ) : (
                <div className="flex min-h-72 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/20 px-6 text-center text-sm text-zinc-500">
                  {item.name}
                </div>
              )}

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:mt-6 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-yellow-500/80">
                  {copy.descriptionTitle}
                </p>
                <p className="mt-3 text-sm leading-7 text-zinc-300">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[rgba(8,8,8,0.78)] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.22)] sm:p-8">
              <h2 className="text-2xl font-bold tracking-[-0.02em] text-white sm:text-3xl">
                {copy.specificationTitle}
              </h2>

              <div className="mt-10">
                {item.specsHtml ? (
                  <div
                    className={specificationContentClassName}
                    dangerouslySetInnerHTML={{ __html: item.specsHtml }}
                  />
                ) : (
                  <p className="mt-6 text-sm text-zinc-400">{copy.emptyBody}</p>
                )}
              </div>
            </div>
          </div>
        </SectionContainer>
      </div>
    </main>
  );
}
