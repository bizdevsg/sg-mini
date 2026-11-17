// Stand-in for the `server-only` package when running scripts outside Next.js.
// Next resolves `server-only` internally; plain Node/tsx does not, so the
// discovery scripts redirect the import here (see sgb-discovery-account-summary.ts).
module.exports = {};
