// Cek apakah server API pihak ketiga aktif.
// Jalankan: node check-servers.mjs
// Butuh Node 18+ (sudah ada fetch bawaan).
//
// Cara baca hasil:
//   AKTIF          -> server menjawab (401/403/404 pun tetap berarti server hidup;
//                     401 = normal karena request ini sengaja tanpa token)
//   ERROR SERVER   -> server hidup tapi sedang bermasalah (5xx)
//   TIDAK TERJANGKAU -> domain tidak ditemukan, koneksi ditolak, atau timeout
//                     (bisa server mati, butuh VPN, atau IP kita belum di-whitelist)

const TIMEOUT_MS = 10000;

// Request GET tanpa token ke endpoint read-only -> aman, tidak mengubah data apa pun.
const TARGETS = [
  // dev
  { env: "dev",  host: "SSO",                url: "https://mmssoapilab.sgberjangka.id/sso/list-account/v1" },
  { env: "dev",  host: "Trading (Real)",     url: "https://mmapiuat.sgberjangka.id/etrade/accountsummary" },
  { env: "dev",  host: "Trading (Demo)",     url: "https://mmapilab.sgberjangka.id/etrade/accountsummary" },
  { env: "dev",  host: "Registrasi",         url: "https://mmapi-lab.solidgold.co.id/api/getcountrycodes" },
  // uat
  { env: "uat",  host: "SSO",                url: "https://mmssoapiuat.sgberjangka.id/sso/list-account/v1" },
  { env: "uat",  host: "Trading (Real)",     url: "https://demominiapi.sgberjangka.com/etrade/accountsummary" },
  { env: "uat",  host: "Trading (Demo)",     url: "https://mmapiuat.sgberjangka.id/etrade/accountsummary" },
  { env: "uat",  host: "Registrasi",         url: "https://mmapi-uat.solidgold.co.id/api/getcountrycodes" },
  // prod
  { env: "prod", host: "SSO",                url: "https://minissoapi.sgberjangka.com/sso/list-account/v1" },
  { env: "prod", host: "Trading (Real)",     url: "https://miniapi.sgberjangka.com/etrade/accountsummary" },
  { env: "prod", host: "Trading (Demo)",     url: "https://demominiapi.sgberjangka.com/etrade/accountsummary" },
  { env: "prod", host: "Registrasi (Real)",  url: "https://mmapi.solidgold.co.id/api/getcountrycodes" },
  { env: "prod", host: "Registrasi (Demo)",  url: "https://mmapi-demo.solidgold.co.id/api/getcountrycodes" },
];

async function check({ env, host, url }) {
  const started = Date.now();
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": "Android / 13" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const ms = Date.now() - started;
    const status = res.status >= 500 ? "ERROR SERVER" : "AKTIF";
    return { env, host, status, detail: `HTTP ${res.status}`, ms };
  } catch (err) {
    const ms = Date.now() - started;
    const code = err?.cause?.code || err?.name || "ERROR";
    const reason =
      code === "TimeoutError" ? "timeout" :
      code === "ENOTFOUND" ? "domain tidak ditemukan" :
      code === "ECONNREFUSED" ? "koneksi ditolak" :
      code === "ECONNRESET" ? "koneksi diputus" :
      code;
    return { env, host, status: "TIDAK TERJANGKAU", detail: reason, ms };
  }
}

const results = await Promise.all(TARGETS.map(check));
console.table(
  results.map((r) => ({
    Env: r.env,
    Host: r.host,
    Status: r.status,
    Detail: r.detail,
    Waktu: `${r.ms} ms`,
  }))
);
