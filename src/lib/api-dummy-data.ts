import "server-only";

import type { ContactMessageState } from "@/app/actions/contactMessage";
import type { BannerApiRecord } from "@/lib/banner";
import type { HistoricalDataRecord } from "@/lib/historical-data";
import type { PengumumanResult } from "@/lib/pengumuman";
import type { ProductCatalogItem, ProductPageCategory } from "@/lib/products";

const PLACEHOLDER_BACKGROUND = "#101217";
const PLACEHOLDER_PANEL = "#171A21";
const PLACEHOLDER_ACCENT = "#D5A246";
const PLACEHOLDER_TEXT = "#F5F1E8";

function escapeSvgText(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function createSvgPlaceholder(
  title: string,
  subtitle: string,
  width: number,
  height: number,
) {
  const safeTitle = escapeSvgText(title);
  const safeSubtitle = escapeSvgText(subtitle);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
    <rect width="${width}" height="${height}" fill="${PLACEHOLDER_BACKGROUND}" />
    <rect x="24" y="24" width="${width - 48}" height="${height - 48}" rx="28" fill="${PLACEHOLDER_PANEL}" stroke="${PLACEHOLDER_ACCENT}" stroke-width="4" />
    <circle cx="${Math.round(width * 0.14)}" cy="${Math.round(height * 0.26)}" r="18" fill="${PLACEHOLDER_ACCENT}" fill-opacity="0.9" />
    <text x="${Math.round(width * 0.12)}" y="${Math.round(height * 0.5)}" fill="${PLACEHOLDER_TEXT}" font-family="Arial, sans-serif" font-size="${Math.max(28, Math.round(width * 0.05))}" font-weight="700">${safeTitle}</text>
    <text x="${Math.round(width * 0.12)}" y="${Math.round(height * 0.66)}" fill="${PLACEHOLDER_ACCENT}" font-family="Arial, sans-serif" font-size="${Math.max(16, Math.round(width * 0.024))}" font-weight="500">${safeSubtitle}</text>
  </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function addDays(baseDate: Date, dayOffset: number) {
  const date = new Date(baseDate);
  date.setUTCDate(date.getUTCDate() + dayOffset);
  return date;
}

function getIsoDate(dayOffset: number) {
  return addDays(new Date(), dayOffset).toISOString().slice(0, 10);
}

function createBannerImage(label: string) {
  return createSvgPlaceholder(label, "Dummy Banner", 1440, 720);
}

function createProductImage(label: string) {
  return createSvgPlaceholder(label, "Dummy Product", 1200, 900);
}

function createAnnouncementImage(label: string) {
  return createSvgPlaceholder(label, "Dummy Announcement", 1200, 720);
}

function createHistoricalValue(
  baseValue: number,
  dayOffset: number,
  decimals: number,
) {
  return (baseValue + dayOffset).toFixed(decimals);
}

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

function createDummyHistoricalDataRecords() {
  let id = 1;
  const records: HistoricalDataRecord[] = [];
  const categories = [
    { category: "LGD Daily", base: 3345, step: 4.2, decimals: 2 },
    { category: "Gold Spot", base: 3338, step: 3.4, decimals: 2 },
    { category: "EUR/USD", base: 1.086, step: 0.0025, decimals: 4 },
  ];

  for (const entry of categories) {
    for (let index = 0; index < 12; index += 1) {
      const dayOffset = -index;
      const tanggal = getIsoDate(dayOffset);
      const createdAt = `${tanggal}T08:00:00.000Z`;
      const updatedAt = `${tanggal}T16:00:00.000Z`;
      const isBankHoliday = entry.category === "LGD Daily" && index === 4;

      records.push({
        id,
        tanggal,
        open: isBankHoliday
          ? null
          : createHistoricalValue(entry.base, index * 0.7, entry.decimals),
        high: isBankHoliday
          ? null
          : createHistoricalValue(
              entry.base + entry.step,
              index * 0.65,
              entry.decimals,
            ),
        low: isBankHoliday
          ? null
          : createHistoricalValue(
              entry.base - entry.step,
              index * 0.75,
              entry.decimals,
            ),
        close: isBankHoliday
          ? null
          : createHistoricalValue(
              entry.base + entry.step / 2,
              index * 0.68,
              entry.decimals,
            ),
        chg: isBankHoliday ? null : (entry.step * 0.18).toFixed(entry.decimals),
        isBankHoliday,
        description: isBankHoliday ? "US market holiday" : null,
        category: entry.category,
        created_at: createdAt,
        updated_at: updatedAt,
        volume: isBankHoliday ? null : String(1200 - index * 24),
        open_interest: isBankHoliday ? null : String(820 - index * 11),
      });

      id += 1;
    }
  }

  return records.sort(compareHistoricalRecords);
}

const DUMMY_BANNER_RECORDS: BannerApiRecord[] = [
  {
    id: 1,
    image: "Banner SG Solid Web New-1.jpg.jpeg",
    image_url: "/assets/banner/Banner%20SG%20Solid%20Web%20New-1.jpg.jpeg",
    is_active: true,
    sort_order: 1,
    created_at: `${getIsoDate(-3)}T03:00:00.000Z`,
    updated_at: `${getIsoDate(-1)}T06:00:00.000Z`,
  },
  {
    id: 2,
    image: "Banner SG Solid Web New-2.jpg.jpeg",
    image_url: "/assets/banner/Banner%20SG%20Solid%20Web%20New-2.jpg.jpeg",
    is_active: true,
    sort_order: 2,
    created_at: `${getIsoDate(-4)}T03:00:00.000Z`,
    updated_at: `${getIsoDate(-1)}T06:00:00.000Z`,
  },
  {
    id: 3,
    image: "Banner SG Solid Web New-3.jpg.jpeg",
    image_url: "/assets/banner/Banner%20SG%20Solid%20Web%20New-3.jpg.jpeg",
    is_active: true,
    sort_order: 3,
    created_at: `${getIsoDate(-5)}T03:00:00.000Z`,
    updated_at: `${getIsoDate(-1)}T06:00:00.000Z`,
  },
  {
    id: 4,
    image: "Banner SG Solid Web New-4.jpg.jpeg",
    image_url: "/assets/banner/Banner%20SG%20Solid%20Web%20New-4.jpg.jpeg",
    is_active: true,
    sort_order: 4,
    created_at: `${getIsoDate(-6)}T03:00:00.000Z`,
    updated_at: `${getIsoDate(-1)}T06:00:00.000Z`,
  },
  {
    id: 5,
    image: "Banner SG Solid Web New-5.jpg.jpeg",
    image_url: "/assets/banner/Banner%20SG%20Solid%20Web%20New-5.jpg.jpeg",
    is_active: true,
    sort_order: 5,
    created_at: `${getIsoDate(-7)}T03:00:00.000Z`,
    updated_at: `${getIsoDate(-1)}T06:00:00.000Z`,
  },
];

const DUMMY_PRODUCT_CATALOG: Record<ProductPageCategory, ProductCatalogItem[]> = {
  multilateral: [
    {
      id: 101,
      slug: "gold-loco-london",
      name: "Gold Loco London",
      description:
        "Dummy contract for precious metal trading with flexible intraday execution.",
      specsHtml:
        "<ul><li>Contract Size: 100 troy ounce</li><li>Tick Size: 0.01</li><li>Trading Session: Mon-Fri</li></ul>",
      imageSrc: createProductImage("Gold Loco London"),
      sourceCategory: "JFX",
    },
    {
      id: 102,
      slug: "olein-futures",
      name: "Olein Futures",
      description:
        "Dummy multilateral product to validate catalog and detail rendering.",
      specsHtml:
        "<ul><li>Contract Size: 20 metric tons</li><li>Settlement: Cash</li><li>Margin: Dynamic</li></ul>",
      imageSrc: createProductImage("Olein Futures"),
      sourceCategory: "JFX",
    },
    {
      id: 103,
      slug: "silver-loco-london",
      name: "Silver Loco London",
      description:
        "Dummy silver instrument with placeholder specification blocks.",
      specsHtml:
        "<ul><li>Contract Size: 5000 troy ounce</li><li>Tick Size: 0.001</li><li>Execution: Market / Pending</li></ul>",
      imageSrc: createProductImage("Silver Loco London"),
      sourceCategory: "JFX",
    },
  ],
  bilateral: [
    {
      id: 201,
      slug: "xauusd-bilateral",
      name: "XAU/USD Bilateral",
      description:
        "Dummy bilateral gold pair for testing layouts without depending on the admin API.",
      specsHtml:
        "<ul><li>Spread Target: Competitive</li><li>Leverage: Flexible</li><li>Execution: Real-time</li></ul>",
      imageSrc: createProductImage("XAU/USD Bilateral"),
      sourceCategory: "SPA",
    },
    {
      id: 202,
      slug: "eurusd-bilateral",
      name: "EUR/USD Bilateral",
      description:
        "Dummy major FX product for validating slug-based detail pages.",
      specsHtml:
        "<ul><li>Session: 24 Hours</li><li>Contract Type: Bilateral</li><li>Quote Precision: 5 digits</li></ul>",
      imageSrc: createProductImage("EUR/USD Bilateral"),
      sourceCategory: "SPA",
    },
    {
      id: 203,
      slug: "usdjpy-bilateral",
      name: "USD/JPY Bilateral",
      description:
        "Dummy yen pair with sample HTML specs to exercise the content area.",
      specsHtml:
        "<ul><li>Minimum Order: 0.01 lot</li><li>Swap: Configurable</li><li>Session Break: Minimal</li></ul>",
      imageSrc: createProductImage("USD/JPY Bilateral"),
      sourceCategory: "SPA",
    },
  ],
};

const DUMMY_PENGUMUMAN_ITEMS = [
  {
    id: 1,
    judul: "Maintenance Schedule for Trading Infrastructure",
    konten:
      "<p>This is a dummy announcement used in dev-deploy mode.</p><p>All content on this card is local placeholder data so the page can still be reviewed without the backend API.</p>",
    image: "dummy-announcement-1",
    image_url: createAnnouncementImage("Infrastructure Maintenance"),
    created_at: `${getIsoDate(-5)}T08:00:00.000Z`,
    updated_at: `${getIsoDate(-2)}T09:30:00.000Z`,
  },
  {
    id: 2,
    judul: "Temporary Update to Office Service Hours",
    konten:
      "<p>Customer support hours have been adjusted in this dummy dataset.</p><p>Please replace this content with real API data when APP_ENV is set to dev or prod.</p>",
    image: "dummy-announcement-2",
    image_url: createAnnouncementImage("Service Hour Update"),
    created_at: `${getIsoDate(-10)}T08:00:00.000Z`,
    updated_at: `${getIsoDate(-6)}T09:30:00.000Z`,
  },
  {
    id: 3,
    judul: "Dummy Compliance Notice",
    konten:
      "<p>This placeholder entry verifies the announcement modal and rich text area.</p><p>No external request is made while dummy mode is active.</p>",
    image: "dummy-announcement-3",
    image_url: null,
    created_at: `${getIsoDate(-14)}T08:00:00.000Z`,
    updated_at: `${getIsoDate(-11)}T09:30:00.000Z`,
  },
];

const DUMMY_HISTORICAL_DATA = createDummyHistoricalDataRecords();

export function getDummyBannerRecords() {
  return DUMMY_BANNER_RECORDS.slice();
}

export function getDummyHistoricalData() {
  return DUMMY_HISTORICAL_DATA.slice();
}

export function getDummyProductCatalog(category: ProductPageCategory) {
  return DUMMY_PRODUCT_CATALOG[category].slice();
}

export function getDummyPengumuman(page = 1): PengumumanResult {
  const items = page === 1 ? DUMMY_PENGUMUMAN_ITEMS.slice() : [];

  return {
    items,
    meta: {
      current_page: page,
      per_page: DUMMY_PENGUMUMAN_ITEMS.length,
      total: DUMMY_PENGUMUMAN_ITEMS.length,
      last_page: 1,
      from: items.length > 0 ? 1 : null,
      to: items.length > 0 ? items.length : null,
    },
    source: "api",
  };
}

export function createDummyContactMessageState(
  name: string,
  subject: string,
): ContactMessageState {
  const dateStamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");

  return {
    status: "success",
    message: `Dummy mode active. Message from ${name} for "${subject}" was stored locally and not sent to the API.`,
    reportId: `DMY-${dateStamp}-001`,
  };
}
