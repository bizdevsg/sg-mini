import {
  getCachedHistoricalDataRecords,
  type HistoricalDataRecord,
} from "@/app/api/_data/historical-data";

export async function getHistoricalData() {
  return getCachedHistoricalDataRecords();
}
