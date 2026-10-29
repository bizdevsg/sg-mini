/*
 * Gambar PNG "Grafik analisis" untuk tombol Bagikan grafik (client-side).
 * Candle diambil sampai waktu analisis (candle yang sudah close sebelum
 * analyzedAt), lalu digambar bersama level Entry/SL/TP dan kartu skenario.
 * Tata letak mengikuti versi bagikan grafik TradePilot.
 */
import type { TradePilotAnalysisResult, TradePilotCandle } from "./trade-pilot.types";

export type ChartShareSide = "buy" | "sell" | "both";

export type ChartShareCopy = {
  brand: string;
  title: string;
  analyzed: string;
  made: string;
  bias: string;
  suggested: string;
  bullish: string;
  bearish: string;
  neutral: string;
  buy: string;
  sell: string;
  both: string;
  entry: string;
  stop: string;
  tp1: string;
  tp2: string;
  sourceNote: string;
  noCandles: string;
  warning: string;
};

export type ChartShareInput = {
  analysis: Pick<
    TradePilotAnalysisResult,
    "analyzedAt" | "buyLevels" | "direction" | "instrumentLabel" | "sellLevels" | "timeframeLabel"
  >;
  candles: TradePilotCandle[];
  /** Granularitas candle dari snapshot (mis. "1h", "1W"). */
  candleTimeframe: string;
  copy: ChartShareCopy;
  locale: "id" | "en";
  now?: Date;
};

const FRAME_MS: Record<string, number> = {
  "1m": 60_000,
  "5m": 300_000,
  "15m": 900_000,
  "30m": 1_800_000,
  "1h": 3_600_000,
  "4h": 14_400_000,
  "1D": 86_400_000,
  "1W": 604_800_000,
};
const MAX_CANDLES = 56;
const MIN_CANDLES = 8;

/** Candle yang sudah selesai sebelum waktu analisis, unik per waktu, maksimal 56 terakhir. */
export function selectAnalysisCandles(
  candles: TradePilotCandle[],
  candleTimeframe: string,
  analyzedAt: string,
): TradePilotCandle[] {
  const duration = FRAME_MS[candleTimeframe];
  const cutoff = Date.parse(analyzedAt);
  if (!duration || !Number.isFinite(cutoff)) return [];
  const byTime = new Map<number, TradePilotCandle>();
  for (const candle of candles) {
    const time = Date.parse(candle.date);
    if (!Number.isFinite(time) || time + duration > cutoff) continue;
    if (![candle.open, candle.high, candle.low, candle.close].every(Number.isFinite)) continue;
    byTime.set(time, candle);
  }
  const result = [...byTime.entries()]
    .sort((a, b) => a[0] - b[0])
    .slice(-MAX_CANDLES)
    .map(([, candle]) => candle);
  return result.length >= MIN_CANDLES ? result : [];
}

export function chartShareSide(direction: string): ChartShareSide {
  return direction === "bearish" ? "sell" : direction === "bullish" ? "buy" : "both";
}

type Level = { color: string; dashed: boolean; price: number };

const COLORS = {
  background: "#101216",
  accent: "#e8ad2b",
  panel: "#171c24",
  grid: "#323b47",
  axis: "#aab1bc",
  text: "#f7f7f9",
  muted: "#aeb1ba",
  body: "#d1d5db",
  card: "#1d242d",
  buyEntry: "#06b6d4",
  sellEntry: "#f59e0b",
  stop: "#ef4444",
  takeProfit: "#10b981",
  up: "#25c991",
  down: "#f56868",
  buyCard: "#30ceab",
  sellCard: "#f5b441",
} as const;

export function chartShareLevels(input: Pick<ChartShareInput, "analysis">, side: ChartShareSide): Level[] {
  const levels: Level[] = [];
  const add = (kind: "buy" | "sell") => {
    const set = kind === "buy" ? input.analysis.buyLevels : input.analysis.sellLevels;
    const dashed = kind === "sell";
    const rows: Array<[string, string]> = [
      [set.entry, kind === "buy" ? COLORS.buyEntry : COLORS.sellEntry],
      [set.stopLoss, COLORS.stop],
      [set.takeProfitOne, COLORS.takeProfit],
      [set.takeProfitTwo, COLORS.takeProfit],
    ];
    for (const [value, color] of rows) {
      const price = Number(value);
      if (Number.isFinite(price) && price > 0) levels.push({ color, dashed, price });
    }
  };
  if (side !== "sell") add("buy");
  if (side !== "buy") add("sell");
  return levels;
}

const WIDTH = 1120;
const PAD = 48;
const CHART_Y = 172;
const CHART_H = 460;
const PLOT_RIGHT = WIDTH - PAD - 104;
const LINE = 29;

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const output: string[] = [];
  let current = "";
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const next = current ? `${current} ${word}` : word;
    if (ctx.measureText(next).width <= maxWidth) current = next;
    else {
      if (current) output.push(current);
      current = word;
    }
  }
  if (current) output.push(current);
  return output;
}

function paragraph(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, width: number, color: string) {
  ctx.fillStyle = color;
  ctx.font = "20px system-ui, sans-serif";
  for (const line of wrap(ctx, text, width)) {
    ctx.fillText(line, x, y);
    y += LINE;
  }
  return y;
}

function formatDate(value: string | Date, locale: "id" | "en", withTime = true) {
  const formatted = new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "id-ID", {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "short",
    year: withTime ? "numeric" : undefined,
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
  return withTime ? `${formatted} WIB` : formatted;
}

function priceText(value: number, locale: "id" | "en") {
  return new Intl.NumberFormat(locale === "en" ? "en-US" : "id-ID", { maximumFractionDigits: 2 }).format(value);
}

function drawChart(
  ctx: CanvasRenderingContext2D,
  candles: TradePilotCandle[],
  levels: Level[],
  copy: ChartShareCopy,
  locale: "id" | "en",
) {
  ctx.fillStyle = COLORS.panel;
  ctx.fillRect(PAD, CHART_Y, WIDTH - PAD * 2, CHART_H);
  if (!candles.length) {
    ctx.fillStyle = COLORS.muted;
    ctx.font = "20px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(copy.noCandles, WIDTH / 2, CHART_Y + CHART_H / 2, WIDTH - PAD * 4);
    ctx.textAlign = "left";
    return;
  }

  const left = PAD + 12;
  const top = CHART_Y + 24;
  const bottom = CHART_Y + CHART_H - 40;
  const values = candles.flatMap((c) => [c.high, c.low]).concat(levels.map((level) => level.price));
  let min = Math.min(...values);
  let max = Math.max(...values);
  const padding = Math.max((max - min) * 0.08, Math.abs(max) * 0.0002, 0.00001);
  min -= padding;
  max += padding;
  const yFor = (value: number) => bottom - ((value - min) / (max - min)) * (bottom - top);

  ctx.strokeStyle = COLORS.grid;
  ctx.lineWidth = 1;
  ctx.font = "15px system-ui, sans-serif";
  for (let i = 0; i <= 4; i++) {
    const y = top + ((bottom - top) * i) / 4;
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(PLOT_RIGHT, y);
    ctx.stroke();
    ctx.fillStyle = COLORS.axis;
    ctx.fillText(priceText(max - ((max - min) * i) / 4, locale), PLOT_RIGHT + 9, y + 5, 88);
  }

  for (const level of levels) {
    ctx.strokeStyle = level.color;
    ctx.lineWidth = 2;
    ctx.setLineDash(level.dashed ? [8, 5] : []);
    ctx.beginPath();
    ctx.moveTo(left, yFor(level.price));
    ctx.lineTo(PLOT_RIGHT, yFor(level.price));
    ctx.stroke();
  }
  ctx.setLineDash([]);

  const step = (PLOT_RIGHT - left) / candles.length;
  const bodyWidth = Math.max(3, Math.min(10, step * 0.58));
  candles.forEach((candle, index) => {
    const x = left + step * (index + 0.5);
    const color = candle.close >= candle.open ? COLORS.up : COLORS.down;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, yFor(candle.high));
    ctx.lineTo(x, yFor(candle.low));
    ctx.stroke();
    const bodyTop = Math.min(yFor(candle.open), yFor(candle.close));
    ctx.fillRect(x - bodyWidth / 2, bodyTop, bodyWidth, Math.max(2, Math.abs(yFor(candle.open) - yFor(candle.close))));
  });

  ctx.font = "16px system-ui, sans-serif";
  ctx.fillStyle = COLORS.axis;
  const marks = [0, Math.floor((candles.length - 1) / 2), candles.length - 1];
  marks.forEach((index, i) => {
    const text = formatDate(candles[index].date, locale, false);
    const x = left + step * (index + 0.5);
    ctx.textAlign = i === 0 ? "left" : i === marks.length - 1 ? "right" : "center";
    ctx.fillText(text, i === 0 ? left : i === marks.length - 1 ? PLOT_RIGHT : x, CHART_Y + CHART_H - 12, 180);
  });
  ctx.textAlign = "left";
}

function scenarioRows(input: ChartShareInput, kind: "buy" | "sell") {
  const set = kind === "buy" ? input.analysis.buyLevels : input.analysis.sellLevels;
  return [
    `${input.copy.entry}: ${set.entry || "—"}`,
    `${input.copy.stop}: ${set.stopLoss || "—"}`,
    `${input.copy.tp1}: ${set.takeProfitOne || "—"}`,
    `${input.copy.tp2}: ${set.takeProfitTwo || "—"}`,
  ];
}

function measurePlan(ctx: CanvasRenderingContext2D, input: ChartShareInput, side: ChartShareSide) {
  const sides = side === "both" ? (["buy", "sell"] as const) : [side];
  const width = sides.length === 2 ? (WIDTH - PAD * 2 - 18) / 2 : WIDTH - PAD * 2;
  ctx.font = "20px system-ui, sans-serif";
  const height = Math.max(
    ...sides.map(
      (kind) => 64 + scenarioRows(input, kind).reduce((sum, text) => sum + Math.max(1, wrap(ctx, text, width - 44).length) * LINE + 5, 0),
    ),
  );
  return { height, sides, width };
}

function drawPlan(ctx: CanvasRenderingContext2D, input: ChartShareInput, side: ChartShareSide, y: number) {
  const { height, sides, width } = measurePlan(ctx, input, side);
  sides.forEach((kind, i) => {
    const x = PAD + i * (width + 18);
    ctx.fillStyle = COLORS.card;
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = kind === "buy" ? COLORS.buyCard : COLORS.sellCard;
    ctx.fillRect(x, y, 4, height);
    ctx.font = "700 22px system-ui, sans-serif";
    ctx.fillText(kind === "buy" ? input.copy.buy : input.copy.sell, x + 22, y + 36);
    let row = y + 68;
    for (const text of scenarioRows(input, kind)) row = paragraph(ctx, text, x + 22, row, width - 44, COLORS.body) + 5;
  });
  return y + height + 22;
}

/** Gambar PNG analisis. Melempar error bila canvas tidak tersedia. */
export async function renderTradePilotChartPng(input: ChartShareInput): Promise<Blob> {
  const side = chartShareSide(input.analysis.direction);
  const candles = selectAnalysisCandles(input.candles, input.candleTimeframe, input.analysis.analyzedAt);
  const levels = chartShareLevels(input, side);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas_unavailable");
  canvas.width = WIDTH;
  canvas.height = 1600;

  ctx.font = "20px system-ui, sans-serif";
  const planHeight = measurePlan(ctx, input, side).height + 22;
  const sourceLines = wrap(ctx, input.copy.sourceNote, WIDTH - PAD * 2).length;
  const warningLines = wrap(ctx, input.copy.warning, WIDTH - PAD * 2).length;
  canvas.height = CHART_Y + CHART_H + 30 + planHeight + 28 + sourceLines * LINE + 76 + warningLines * LINE + 48;

  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, WIDTH, canvas.height);
  ctx.fillStyle = COLORS.accent;
  ctx.fillRect(0, 0, WIDTH, 7);
  ctx.font = "700 21px system-ui, sans-serif";
  ctx.fillText(input.copy.brand, PAD, 56, WIDTH - PAD * 2);

  ctx.fillStyle = COLORS.text;
  ctx.font = "700 32px system-ui, sans-serif";
  ctx.fillText(
    `${input.copy.title} · ${input.analysis.instrumentLabel} · ${input.analysis.timeframeLabel}`,
    PAD,
    100,
    WIDTH - PAD * 2,
  );
  ctx.font = "19px system-ui, sans-serif";
  ctx.fillStyle = COLORS.muted;
  ctx.fillText(`${input.copy.analyzed}: ${formatDate(input.analysis.analyzedAt, input.locale)}`, PAD, 132, WIDTH - PAD * 2);

  const bias =
    input.analysis.direction === "bullish"
      ? input.copy.bullish
      : input.analysis.direction === "bearish"
        ? input.copy.bearish
        : input.copy.neutral;
  const suggested = side === "both" ? input.copy.both : side === "sell" ? input.copy.sell : input.copy.buy;
  ctx.font = "700 20px system-ui, sans-serif";
  ctx.fillStyle = side === "both" ? COLORS.sellCard : COLORS.text;
  ctx.fillText(`${input.copy.bias}: ${bias}  ·  ${input.copy.suggested}: ${suggested}`, PAD, 160, WIDTH - PAD * 2);

  drawChart(ctx, candles, levels, input.copy, input.locale);
  let y = drawPlan(ctx, input, side, CHART_Y + CHART_H + 30) + 28;
  y = paragraph(ctx, input.copy.sourceNote, PAD, y, WIDTH - PAD * 2, COLORS.body);
  ctx.fillStyle = COLORS.muted;
  ctx.font = "17px system-ui, sans-serif";
  ctx.fillText(`${input.copy.made}: ${formatDate(input.now ?? new Date(), input.locale)}`, PAD, y + 8, WIDTH - PAD * 2);
  ctx.fillStyle = "#333a43";
  ctx.fillRect(PAD, y + 24, WIDTH - PAD * 2, 1);
  paragraph(ctx, input.copy.warning, PAD, y + 63, WIDTH - PAD * 2, COLORS.sellCard);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("png_export_failed"))), "image/png");
  });
}
