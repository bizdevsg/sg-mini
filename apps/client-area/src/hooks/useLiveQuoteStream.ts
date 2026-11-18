"use client";

import { useClientAreaAccountMode } from "@/components/providers/ClientAreaAccountModeProvider";
import { useSaiStream } from "@/hooks/useSaiStream";

export type LiveQuoteConnectionStatus = "connecting" | "live" | "reconnecting" | "error";

export function useLiveQuoteStream() {
  const { accountMode } = useClientAreaAccountMode();
  const { quotes, status, lastUpdated } = useSaiStream(accountMode);
  return { quotes, status, lastUpdated };
}
