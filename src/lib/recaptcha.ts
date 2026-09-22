import {
  APP_ENV,
  PUBLIC_RECAPTCHA_SITE_KEY,
  RECAPTCHA_MIN_SCORE,
  RECAPTCHA_SECRET_KEY,
} from "@/lib/env";

type RecaptchaVerifyResponse = {
  action?: string;
  hostname?: string;
  score?: number;
  success?: boolean;
};

type VerifyRecaptchaTokenOptions = {
  expectedAction: string;
  expectedHostname?: string | null;
};

const LOCAL_RECAPTCHA_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

function normalizeHostHeader(value: string | null | undefined) {
  const normalizedValue = value?.split(",")[0]?.trim().toLowerCase();

  if (!normalizedValue) {
    return "";
  }

  if (normalizedValue.startsWith("[")) {
    const closingBracketIndex = normalizedValue.indexOf("]");

    if (closingBracketIndex > 0) {
      return normalizedValue.slice(1, closingBracketIndex);
    }
  }

  const colonIndex = normalizedValue.indexOf(":");

  if (colonIndex > -1) {
    return normalizedValue.slice(0, colonIndex);
  }

  return normalizedValue;
}

export function resolveRequestHostname(
  headersList: Pick<Headers, "get">,
) {
  return normalizeHostHeader(
    headersList.get("x-forwarded-host") ?? headersList.get("host"),
  );
}

export function isRecaptchaUnsupportedHostname(hostname: string) {
  return LOCAL_RECAPTCHA_HOSTS.has(hostname);
}

export function isRecaptchaEnabled(hostname?: string | null) {
  if (APP_ENV !== "prod") {
    return false;
  }

  const normalizedHostname = normalizeHostHeader(hostname);

  if (
    normalizedHostname &&
    isRecaptchaUnsupportedHostname(normalizedHostname)
  ) {
    return false;
  }

  return Boolean(PUBLIC_RECAPTCHA_SITE_KEY && RECAPTCHA_SECRET_KEY);
}

export async function verifyRecaptchaToken(
  token: string,
  { expectedAction, expectedHostname }: VerifyRecaptchaTokenOptions,
) {
  if (!isRecaptchaEnabled()) {
    return true;
  }

  if (!token.trim()) {
    return false;
  }

  try {
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: RECAPTCHA_SECRET_KEY,
          response: token,
        }),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return false;
    }

    const payload = (await response.json()) as RecaptchaVerifyResponse;
    const normalizedExpectedHostname = normalizeHostHeader(expectedHostname);
    const normalizedVerifiedHostname = normalizeHostHeader(payload.hostname);

    return (
      payload.success === true &&
      typeof payload.score === "number" &&
      payload.score >= RECAPTCHA_MIN_SCORE &&
      payload.action === expectedAction &&
      (!normalizedExpectedHostname ||
        normalizedVerifiedHostname === normalizedExpectedHostname)
    );
  } catch {
    return false;
  }
}
