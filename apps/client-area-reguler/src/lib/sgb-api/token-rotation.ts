import "server-only";

/**
 * The Etrade/SSO collection rotates its bearer token through a response header
 * named `csrf`. Only JWT-shaped values are accepted so unrelated CSRF markers
 * can never replace the authenticated Client Area session.
 */
export function extractRotatedSgbToken(headers: Headers): string | undefined {
  const csrf = headers.get("csrf")?.trim();

  if (!csrf || csrf.split(".").length !== 3) {
    return undefined;
  }

  return csrf;
}
