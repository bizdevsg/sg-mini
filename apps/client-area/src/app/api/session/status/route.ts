import { NextResponse } from "next/server";

import { resolveTrustedBrowserOrigin, withApiProtectionHeaders } from "@/lib/api-protection";
import { getClientAreaSessionState } from "@/lib/client-area-auth";
import { PUBLIC_SITE_URL } from "@/lib/env";

export async function GET(request: Request) {
  const allowedOrigin = resolveTrustedBrowserOrigin(request);

  if (!allowedOrigin) {
    return withApiProtectionHeaders(
      NextResponse.json({ authenticated: false }, { status: 403 }),
      { cacheControl: "private, no-store, max-age=0" },
    );
  }

  const { isAuthenticated, profile } = await getClientAreaSessionState();
  const response = withApiProtectionHeaders(
    NextResponse.json(
      isAuthenticated && profile
        ? {
          authenticated: true,
          displayName: profile.displayName,
          avatarSrc: `${PUBLIC_SITE_URL}${profile.avatarSrc}`,
        }
        : { authenticated: false },
    ),
    { cacheControl: "private, no-store, max-age=0" },
  );

  response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Vary", "Origin");

  return response;
}
