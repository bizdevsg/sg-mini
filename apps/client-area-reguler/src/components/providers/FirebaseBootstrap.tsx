"use client";

import { useEffect } from "react";

import { getFirebaseAnalytics } from "@/lib/firebase/analytics";
import { initializeFirebaseClient } from "@/lib/firebase/client";
import { isFirebaseConfigured } from "@/lib/firebase/config";

export function FirebaseBootstrap() {
  useEffect(() => {
    if (!isFirebaseConfigured()) {
      return;
    }

    initializeFirebaseClient();
    void getFirebaseAnalytics();
  }, []);

  return null;
}

