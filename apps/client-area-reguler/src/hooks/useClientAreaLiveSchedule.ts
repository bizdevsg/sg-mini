"use client";

import { useEffect, useState } from "react";

import {
  getActiveClientAreaLiveSessions,
  type ClientAreaActiveLiveSession,
} from "@/lib/client-area-live-schedule.shared";

const LIVE_SCHEDULE_REFRESH_INTERVAL_MS = 30_000;

export function useClientAreaLiveSchedule() {
  const [activeSessions, setActiveSessions] = useState<
    ClientAreaActiveLiveSession[]
  >([]);

  useEffect(() => {
    function updateActiveSessions() {
      setActiveSessions(getActiveClientAreaLiveSessions());
    }

    updateActiveSessions();
    const intervalId = window.setInterval(
      updateActiveSessions,
      LIVE_SCHEDULE_REFRESH_INTERVAL_MS,
    );

    return () => window.clearInterval(intervalId);
  }, []);

  return activeSessions;
}
