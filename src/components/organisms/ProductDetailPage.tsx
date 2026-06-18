import { SectionContainer } from "@/components/atoms/SectionContainer";
import { BreadcrumbTrail } from "@/components/molecules/BreadcrumbTrail";
import { SectionIntro } from "@/components/molecules/SectionIntro";
import type { ProductCatalogItem, ProductPageCategory } from "@/lib/products";
import { getMessages, type AppLocale, type AppMessages } from "@/locales";

type ProductDetailPageProps = {
  item: ProductCatalogItem;
  locale: AppLocale;
  category: ProductPageCategory;
  copy: AppMessages["productPage"];
};

export function ProductDetailPage({
  item,
  locale,
  category,
  copy,
}: ProductDetailPageProps) {
  const categoryCopy = copy.categories[category];
  const homeLabel = getMessages(locale).app.homeLabel;

  return (
    <main>
      <div
        className="bg-cover bg-bottom bg-no-repeat py-20 md:py-24"
        style={{
          backgroundImage: "url('/assets/bg-hero1.png')",
        }}
      >
        <SectionContainer className="relative z-10">
          <BreadcrumbTrail
            locale={locale}
            homeLabel={homeLabel}
            className="mb-6"
            items={[
              {
                label: copy.breadcrumb,
                tone: "default",
              },
              {
                label: categoryCopy.title,
                href:
                  item.sourceCategory === "JFX"
                    ? `/${locale}/produk/multilateral`
                    : `/${locale}/produk/bilateral`,
              },
              {
                label: item.name,
                tone: "current",
              },
            ]}
          />

          <SectionIntro
            align="center"
            titleAs="h1"
            eyebrow={item.sourceCategory === "JFX" ? "Multilateral" : "Bilateral"}
            title={item.name}
            description={item.description}
            eyebrowClassName="uppercase tracking-[0.24em] text-yellow-500"
            titleClassName="tracking-[-0.02em] sm:text-4xl md:text-5xl"
            descriptionClassName="mx-auto max-w-2xl leading-relaxed text-gray-300"
          />
        </SectionContainer>
      </div>

      <SectionContainer className="py-16 sm:py-20">
        <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-8">
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

            {item.specsHtml ? (
              <div
                className={[
                  "mt-6 overflow-x-auto text-sm leading-7 text-zinc-200",
                  "[&_a]:text-yellow-400 [&_a]:underline",
                  "[&_center]:block",
                  "[&_p]:mb-3 [&_p]:leading-7",
                  "[&_table]:mb-4 [&_table]:min-w-[640px] [&_table]:border-collapse md:[&_table]:min-w-full",
                  "[&_tbody]:align-top",
                  "[&_td]:border [&_td]:border-line [&_td]:px-3 [&_td]:py-2 [&_td]:align-top",
                  "[&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5",
                  "[&_li]:mb-1",
                  "[&_strong]:text-white",
                ].join(" ")}
                dangerouslySetInnerHTML={{ __html: item.specsHtml }}
              />
            ) : (
              <p className="mt-6 text-sm text-zinc-400">{copy.emptyBody}</p>
            )}
          </div>
        </div>
      </SectionContainer>
    </main>
  );
}
