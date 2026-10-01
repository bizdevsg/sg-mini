import "server-only";

import CryptoJS from "crypto-js";

import { SGB_PASSWORD_PASSPHRASE } from "../env";

/**
 * Encrypts a plaintext password the same way the mobile app / Postman
 * collection does: `CryptoJS.AES.encrypt(plain, passphrase).toString()`
 * (CryptoJS passphrase mode → OpenSSL "Salted__" base64 output). See
 * docs/api/Dokumentasi_API_Postman.md, B2.5 "Enkripsi Password".
 *
 * Fails closed (throws) instead of silently sending an unencrypted or
 * wrongly-encrypted password if the passphrase isn't configured.
 */
export function encryptSgbPassword(plainPassword: string): string {
  if (!SGB_PASSWORD_PASSPHRASE) {
    throw new Error(
      "SGB_PASSWORD_PASSPHRASE is not configured. Set it in .env.local before " +
        "calling any SGB endpoint that sends a password.",
    );
  }

  return CryptoJS.AES.encrypt(plainPassword, SGB_PASSWORD_PASSPHRASE).toString();
}
