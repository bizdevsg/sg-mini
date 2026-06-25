import { NextResponse } from "next/server";

import { getCompanyProfile } from "@/lib/company-profile";

export const runtime = "nodejs";

export async function GET() {
  const data = await getCompanyProfile();

  return NextResponse.json({
    data,
  });
}
