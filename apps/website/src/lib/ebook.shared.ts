import type { AppLocale } from "@/locales";

export const EBOOK_REVALIDATE_SECONDS = 300;

export type EbookCategory = {
  id: number;
  name: string;
  slug: string;
  ebooksCount: number;
  createdAt: string | null;
  updatedAt: string | null;
};

export type EbookResource = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  description: string;
  categoryName: string;
  categorySlug: string;
  imageSrc: string | null;
  fileUrl: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type EbookCategoryDetail = {
  category: EbookCategory;
  items: EbookResource[];
};

export function formatEbookCount(count: number, locale: AppLocale) {
  const formattedCount = new Intl.NumberFormat(
    locale === "id" ? "id-ID" : "en-US",
  ).format(count);

  return locale === "id"
    ? `${formattedCount} ebook tersedia`
    : `${formattedCount} ebooks available`;
}

export function buildEbookCategoryCardDescription(
  categoryName: string,
  count: number,
  locale: AppLocale,
) {
  return locale === "id"
    ? `Jelajahi ${count} ebook dalam kategori ${categoryName} untuk materi yang lebih terarah.`
    : `Browse ${count} ebooks in the ${categoryName} category for a more focused learning path.`;
}

export function buildEbookCategoryPageDescription(
  categoryName: string,
  count: number,
  locale: AppLocale,
) {
  return locale === "id"
    ? `Kumpulan ${count} ebook dalam kategori ${categoryName}. Buka setiap file untuk membaca materi langsung dari library.`
    : `${count} ebooks in the ${categoryName} category. Open each file to read the material directly from the library.`;
}

export function getEbookEmptyState(locale: AppLocale) {
  return locale === "id"
    ? {
        title: "Data ebook belum tersedia",
        body: "Kategori atau file ebook dari API belum tersedia saat ini. Coba lagi beberapa saat lagi.",
      }
    : {
        title: "Ebook data is not available yet",
        body: "The ebook categories or files are not available from the API right now. Please try again shortly.",
      };
}
