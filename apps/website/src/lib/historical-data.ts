import "server-only";

import { GState, jsPDF } from "jspdf";
import { autoTable, type RowInput } from "jspdf-autotable";

import {
  HISTORICAL_DATA_API_TOKEN,
  HISTORICAL_DATA_API_URL,
} from "@/lib/env";
import { HISTORICAL_DATA_WATERMARK } from "@/lib/historical-data-watermark";
import { DEFAULT_LOCALE, getLocaleConfig, type AppLocale } from "@/locales/config";

const HISTORICAL_DATA_REVALIDATE_SECONDS = 300;

export type HistoricalDataRecord = {
  id: number;
  tanggal: string;
  open: string | null;
  high: string | null;
  low: string | null;
  close: string | null;
  chg: string | null;
  isBankHoliday: boolean;
  description: string | null;
  category: string;
  created_at: string;
  updated_at: string;
  volume: string | null;
  open_interest: string | null;
};

type HistoricalDataApiResponse = {
  Code: number;
  status: string;
  data: HistoricalDataRecord[];
};

function compareHistoricalRecords(
  left: HistoricalDataRecord,
  right: HistoricalDataRecord,
) {
  const dateDiff =
    new Date(right.tanggal).getTime() - new Date(left.tanggal).getTime();

  if (dateDiff !== 0) {
    return dateDiff;
  }

  const categoryDiff = left.category.localeCompare(right.category);

  if (categoryDiff !== 0) {
    return categoryDiff;
  }

  return right.id - left.id;
}

const CSV_COLUMNS: Array<{ key: keyof HistoricalDataRecord; header: string }> = [
  { key: "tanggal", header: "Date" },
  { key: "category", header: "Category" },
  { key: "open", header: "Open" },
  { key: "high", header: "High" },
  { key: "low", header: "Low" },
  { key: "close", header: "Close" },
  { key: "description", header: "Description" },
];

const CSV_SOURCE_NOTES: Record<AppLocale, string> = {
  id: "Sumber: PT Solid Gold Berjangka",
  en: "Source: PT Solid Gold Berjangka",
};

const PDF_WATERMARK_HEIGHT = 320;
const PDF_WATERMARK_OPACITY = 0.1;

// Digambar setelah tabel selesai supaya tidak tertutup warna latar baris tabel.
function addPdfWatermark(doc: jsPDF) {
  const { dataUrl, width, height } = HISTORICAL_DATA_WATERMARK;
  const drawHeight = PDF_WATERMARK_HEIGHT;
  const drawWidth = (width / height) * drawHeight;

  for (let page = 1; page <= doc.getNumberOfPages(); page += 1) {
    doc.setPage(page);
    doc.saveGraphicsState();
    doc.setGState(new GState({ opacity: PDF_WATERMARK_OPACITY }));
    doc.addImage(
      dataUrl,
      "PNG",
      (doc.internal.pageSize.getWidth() - drawWidth) / 2,
      (doc.internal.pageSize.getHeight() - drawHeight) / 2,
      drawWidth,
      drawHeight,
      // Alias yang sama membuat gambar disimpan sekali untuk semua halaman.
      "sgb-watermark",
    );
    doc.restoreGraphicsState();
  }
}

function escapeCsvValue(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}

function getMonthGroupLabel(tanggal: string, locale: AppLocale) {
  const date = new Date(tanggal);

  if (Number.isNaN(date.getTime())) {
    return tanggal;
  }

  return new Intl.DateTimeFormat(getLocaleConfig(locale).intl, {
    month: "long",
    year: "numeric",
    timeZone: getLocaleConfig(locale).timeZone,
  }).format(date);
}

function groupRecordsByMonth(
  records: HistoricalDataRecord[],
  locale: AppLocale,
) {
  const groups: Array<{ label: string; records: HistoricalDataRecord[] }> = [];

  for (const record of records) {
    const label = getMonthGroupLabel(record.tanggal, locale);
    const currentGroup = groups[groups.length - 1];

    if (currentGroup && currentGroup.label === label) {
      currentGroup.records.push(record);
    } else {
      groups.push({ label, records: [record] });
    }
  }

  return groups;
}

export function buildHistoricalDataCsv(
  records: HistoricalDataRecord[],
  locale: AppLocale = DEFAULT_LOCALE,
) {
  const header = CSV_COLUMNS.map((column) =>
    escapeCsvValue(column.header),
  ).join(",");

  const lines = [header];

  for (const group of groupRecordsByMonth(records, locale)) {
    lines.push(escapeCsvValue(group.label));

    for (const record of group.records) {
      lines.push(
        CSV_COLUMNS.map((column) =>
          escapeCsvValue(String(record[column.key] ?? "")),
        ).join(","),
      );
    }
  }

  // Keterangan sumber ditaruh di akhir supaya baris pertama tetap header kolom.
  lines.push("", escapeCsvValue(CSV_SOURCE_NOTES[locale]));

  return lines.join("\r\n");
}

const PDF_TABLE_HEAD = ["Date", "Category", "Open", "High", "Low", "Close", "Description"];

export function buildHistoricalDataPdf(
  records: HistoricalDataRecord[],
  categoryLabel: string,
  locale: AppLocale = DEFAULT_LOCALE,
) {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt" });

  doc.setFontSize(14);
  doc.text(`Historical Data - ${categoryLabel}`, 40, 40);
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(`Generated: ${new Date().toISOString()}`, 40, 56);

  const body: RowInput[] = [];

  for (const group of groupRecordsByMonth(records, locale)) {
    body.push([
      {
        content: group.label,
        colSpan: PDF_TABLE_HEAD.length,
        styles: {
          fillColor: [40, 40, 40],
          textColor: 255,
          fontStyle: "bold",
          halign: "left",
        },
      },
    ]);

    for (const record of group.records) {
      body.push([
        record.tanggal,
        record.category,
        record.open ?? "-",
        record.high ?? "-",
        record.low ?? "-",
        record.close ?? "-",
        record.isBankHoliday
          ? (record.description ?? "Bank Holiday")
          : (record.description ?? ""),
      ]);
    }
  }

  autoTable(doc, {
    startY: 70,
    head: [PDF_TABLE_HEAD],
    body,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [23, 23, 23] },
  });

  addPdfWatermark(doc);

  return Buffer.from(doc.output("arraybuffer"));
}

export async function getHistoricalData() {
  const response = await fetch(HISTORICAL_DATA_API_URL, {
    next: {
      revalidate: HISTORICAL_DATA_REVALIDATE_SECONDS,
    },
    headers: {
      Authorization: `Bearer ${HISTORICAL_DATA_API_TOKEN}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch historical data: ${response.status} ${response.statusText}`,
    );
  }

  const payload = (await response.json()) as HistoricalDataApiResponse;

  if (!payload?.data || !Array.isArray(payload.data)) {
    return [];
  }

  return payload.data.slice().sort(compareHistoricalRecords);
}
