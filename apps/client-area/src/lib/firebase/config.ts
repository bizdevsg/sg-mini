import type { FirebaseOptions } from "firebase/app";

const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim() ?? "";
const firebaseAuthDomain =
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim() ?? "";
const firebaseProjectId =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() ?? "";
const firebaseStorageBucket =
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim() ?? "";
const firebaseMessagingSenderId =
  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim() ?? "";
const firebaseAppId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim() ?? "";
const firebaseMeasurementId =
  process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID?.trim() ?? "";

export const firebaseConfig: FirebaseOptions = {
  apiKey: firebaseApiKey,
  authDomain: firebaseAuthDomain,
  projectId: firebaseProjectId,
  storageBucket: firebaseStorageBucket,
  messagingSenderId: firebaseMessagingSenderId,
  appId: firebaseAppId,
  measurementId: firebaseMeasurementId || undefined,
};

export function isFirebaseConfigured() {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId,
  );
}

