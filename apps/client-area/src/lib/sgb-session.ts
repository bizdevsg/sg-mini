import "server-only";

import { createHash, randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { EncryptJWT, jwtDecrypt } from "jose";

import { CLIENT_AREA_SESSION_SECRET } from "@/lib/env";
import {
  CLIENT_AREA_DEVICE_UUID_COOKIE,
  CLIENT_AREA_REMEMBER_ME_MAX_AGE,
} from "@/lib/client-area-session";

/**
 * Encrypted Client Area session for the real SGB API — holds the SSO bearer
 * token and the raw (shape-unverified) list-account response so later work
 * can resolve Demo/Real accounts without a second login. Never put this in a
 * cookie unencrypted: the token has full account access.
 */
export type SgbClientAreaSessionPayload = {
  token: string;
  email: string;
  accounts: unknown;
  issuedAtMs: number;
  /** Remembered so a rotated token can be re-saved with the same cookie lifetime. */
  rememberMe?: boolean;
};

function getSessionEncryptionKey(): Uint8Array {
  if (!CLIENT_AREA_SESSION_SECRET) {
    throw new Error(
      "CLIENT_AREA_SESSION_SECRET is not configured — cannot create or read a Client Area session.",
    );
  }

  // A256GCM (via jose's "dir" mode) requires exactly a 32-byte key; the
  // configured secret can be any length, so derive a fixed-size key from it.
  return createHash("sha256").update(CLIENT_AREA_SESSION_SECRET).digest();
}

export async function encryptSgbSession(
  payload: SgbClientAreaSessionPayload,
): Promise<string> {
  const key = getSessionEncryptionKey();

  return new EncryptJWT({ ...payload })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .encrypt(key);
}

export async function decryptSgbSession(
  jwe: string,
): Promise<SgbClientAreaSessionPayload | null> {
  try {
    const key = getSessionEncryptionKey();
    const { payload } = await jwtDecrypt(jwe, key);

    if (typeof payload.token !== "string" || typeof payload.email !== "string") {
      return null;
    }

    return {
      token: payload.token,
      email: payload.email,
      accounts: payload.accounts ?? null,
      issuedAtMs:
        typeof payload.issuedAtMs === "number" ? payload.issuedAtMs : 0,
      rememberMe: payload.rememberMe === true,
    };
  } catch {
    return null;
  }
}

/**
 * The `uuid` device header/body field must stay identical for the lifetime of
 * a login session (see docs/api/Dokumentasi_API_Postman.md, "KONSISTENSI
 * PERANGKAT") — persisted here in its own httpOnly cookie so it survives
 * across the pre-login (device fingerprint) and post-login (API calls)
 * phases without ever reaching client-side JavaScript.
 */
export async function getOrCreateSgbDeviceUuid(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(CLIENT_AREA_DEVICE_UUID_COOKIE)?.value;

  if (existing) {
    return existing;
  }

  const uuid = randomUUID();
  cookieStore.set({
    name: CLIENT_AREA_DEVICE_UUID_COOKIE,
    value: uuid,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: CLIENT_AREA_REMEMBER_ME_MAX_AGE,
  });

  return uuid;
}
