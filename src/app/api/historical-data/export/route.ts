import { NextResponse } from "next/server";

import {
  protectSameOriginBrowserApiRoute,
  withApiProtectionHeaders,
} from "@/lib/api-protection";
import {
  buildHistoricalDataCsv,
  buildHistoricalDataPdf,
  getHistoricalData,
} from "@/lib/historical-data";
import { DEFAULT_LOCALE, isSupportedLocale } from "@/locales/config";

export const runtime = "nodejs";

const EXPORT_FORMATS = ["csv", "pdf"] as const;
type ExportFormat = (typeof EXPORT_FORMATS)[number];

function isExportFormat(value: string | null): value is ExportFormat {
  return EXPORT_FORMATS.includes(value as ExportFormat);
}

function slugifyFilenamePart(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "all";
}

export async function GET(request: Request) {
  const blockedResponse = protectSameOriginBrowserApiRoute(request);

  if (blockedResponse) {
    return blockedResponse;
  }

  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format");
  const category = searchParams.get("category");
  const localeParam = searchParams.get("locale");
  const locale = localeParam && isSupportedLocale(localeParam)
    ? localeParam
    : DEFAULT_LOCALE;

  if (!isExportFormat(format)) {
    return withApiProtectionHeaders(
      NextResponse.json({ error: "Unsupported format." }, { status: 400 }),
      {
        cacheControl: "private, no-store, max-age=0",
      },
    );
  }

  const allRecords = await getHistoricalData();
  const records = category
    ? allRecords.filter((record) => record.category === category)
    : allRecords;

  const datePart = new Date().toISOString().slice(0, 10);
  const filename = `historical-data-${slugifyFilenamePart(category ?? "all")}-${datePart}.${format}`;

  if (format === "csv") {
    return withApiProtectionHeaders(
      new NextResponse(buildHistoricalDataCsv(records, locale), {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      }),
      {
        cacheControl: "private, no-store, max-age=0",
      },
    );
  }

  const pdfBuffer = buildHistoricalDataPdf(
    records,
    category ?? "All Categories",
    locale,
  );

  return withApiProtectionHeaders(
    new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    }),
    {
      cacheControl: "private, no-store, max-age=0",
    },
  );
}
