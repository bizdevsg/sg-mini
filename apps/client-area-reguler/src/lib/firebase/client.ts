import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import { firebaseConfig, isFirebaseConfigured } from "./config";

let firebaseInitializationErrorLogged = false;

function logMissingFirebaseConfigWarning() {
  if (firebaseInitializationErrorLogged || typeof window === "undefined") {
    return;
  }

  firebaseInitializationErrorLogged = true;

  console.warn(
    "Firebase belum dikonfigurasi. Isi NEXT_PUBLIC_FIREBASE_* di environment agar koneksi aktif.",
  );
}

export function getFirebaseApp() {
  if (!isFirebaseConfigured()) {
    logMissingFirebaseConfigWarning();
    return null;
  }

  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export function getFirebaseAuth() {
  const app = getFirebaseApp();

  return app ? getAuth(app) : null;
}

export function getFirebaseFirestore() {
  const app = getFirebaseApp();

  return app ? getFirestore(app) : null;
}

export function getFirebaseStorage() {
  const app = getFirebaseApp();

  return app ? getStorage(app) : null;
}

export function initializeFirebaseClient() {
  return {
    app: getFirebaseApp(),
    auth: getFirebaseAuth(),
    firestore: getFirebaseFirestore(),
    storage: getFirebaseStorage(),
  };
}

