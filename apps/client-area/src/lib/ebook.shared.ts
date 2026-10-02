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

/**
 * Turns the API's HTML description into plain text, keeping paragraph breaks.
 * The API may send the HTML entity-escaped, so decode first and strip tags after.
 * Safe on server and client (no DOM needed) and cannot inject markup.
 */
export function htmlToPlainText(value: string) {
  let text = value;

  for (let pass = 0; pass < 3; pass += 1) {
    const next = text
      .replace(/&nbsp;/gi, " ")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;|&apos;/gi, "'")
      .replace(/&amp;/gi, "&")
      .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, " ")
      .replace(/<br\s*\/?>|<\/(p|div|li|h[1-6])>/gi, "\n\n")
      .replace(/<[^>]*>?/g, "");

    if (next === text) {
      break;
    }

    text = next;
  }

  return text
    .replace(/[ \t]+/g, " ")
    .replace(/ ?\n ?/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
