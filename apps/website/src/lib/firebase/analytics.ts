import { getFirebaseApp } from "./client";
import { isFirebaseConfigured } from "./config";

let analyticsPromise: Promise<unknown | null> | null = null;

export async function getFirebaseAnalytics() {
  if (typeof window === "undefined" || !isFirebaseConfigured()) {
    return null;
  }

  analyticsPromise ??= (async () => {
    const app = getFirebaseApp();

    if (!app) {
      return null;
    }

    const { getAnalytics, isSupported } = await import("firebase/analytics");

    return (await isSupported()) ? getAnalytics(app) : null;
  })();

  return analyticsPromise;
}

