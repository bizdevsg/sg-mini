import "server-only";

import type { SgbFlavor } from "../env";

/**
 * Host map for the third-party SSO/Trading/Registrasi API, mirrored 1:1 from
 * the pre-request script in docs/api/minimicro-api.postman_collection.json
 * (collection-level "prerequest" event). If this ever disagrees with the
 * collection JSON, the collection wins — see docs/api/Dokumentasi_API_Postman.md.
 */
export type SgbHostKind = "trading" | "register" | "sso";
export type SgbApiMode = "demo" | "normal";

type HostsByMode = Partial<Record<SgbApiMode, string>>;
type HostsByFlavor = Record<SgbFlavor, HostsByMode>;

const HOST_MAP: Record<SgbHostKind, HostsByFlavor> = {
  trading: {
    dev: {
      normal: "https://mmapiuat.sgberjangka.id",
      demo: "https://mmapilab.sgberjangka.id",
    },
    uat: {
      normal: "https://demominiapi.sgberjangka.com",
      demo: "https://mmapiuat.sgberjangka.id",
    },
    prod: {
      normal: "https://miniapi.sgberjangka.com",
      demo: "https://demominiapi.sgberjangka.com",
    },
  },
  register: {
    dev: { normal: "https://mmapi-lab.solidgold.co.id" },
    uat: { normal: "https://mmapi-uat.solidgold.co.id" },
    prod: {
      normal: "https://mmapi.solidgold.co.id",
      demo: "https://mmapi-demo.solidgold.co.id",
    },
  },
  sso: {
    dev: { normal: "https://mmssoapilab.sgberjangka.id" },
    uat: { normal: "https://mmssoapiuat.sgberjangka.id" },
    prod: { normal: "https://minissoapi.sgberjangka.com" },
  },
};

/**
 * Resolves the base URL exactly like the collection's `pick(baseKey)` helper:
 * fall back to the `dev` flavor row, then to the `normal` mode column, if the
 * requested flavor/mode combination has no explicit entry (e.g. Registrasi and
 * SSO only define a "normal" host — demo mode reuses it, matching A3 in the docs).
 */
export function resolveSgbHost(
  kind: SgbHostKind,
  flavor: SgbFlavor,
  mode: SgbApiMode,
): string {
  const byFlavor = HOST_MAP[kind][flavor] ?? HOST_MAP[kind].dev;
  const resolved = byFlavor[mode] ?? byFlavor.normal;

  if (!resolved) {
    throw new Error(
      `No SGB host configured for kind="${kind}" flavor="${flavor}" mode="${mode}".`,
    );
  }

  return resolved;
}

/** Maps the UI's AccountMode ("demo" | "real") to the API's HOST_MAP mode key. */
export function toSgbApiMode(accountMode: "demo" | "real"): SgbApiMode {
  return accountMode === "real" ? "normal" : "demo";
}
