import "server-only";

import { getDummyHistoricalData } from "@/lib/api-dummy-data";
import {
  HISTORICAL_DATA_API_TOKEN,
  HISTORICAL_DATA_API_URL,
  USE_DUMMY_API_DATA,
} from "@/lib/env";

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

export async function getHistoricalData() {
  if (USE_DUMMY_API_DATA) {
    return getDummyHistoricalData();
  }

  const response = await fetch(HISTORICAL_DATA_API_URL, {
    cache: "no-store",
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
