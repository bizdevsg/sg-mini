"use client";

import { usePathname } from "next/navigation";

import { ClientAreaFallbackScreen } from "@/components/organisms/ClientAreaFallbackScreen";
import { resolveFallbackLocaleFromPathname } from "@/lib/route-fallback";

export default function ClientAreaNotFound() {
  const pathname = usePathname();
  const locale = resolveFallbackLocaleFromPathname(pathname);

  return <ClientAreaFallbackScreen locale={locale} mode="not-found" />;
}
