"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { ClientAreaFallbackScreen } from "@/components/organisms/ClientAreaFallbackScreen";
import { resolveFallbackLocaleFromPathname } from "@/lib/route-fallback";

export default function ClientAreaError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const pathname = usePathname();
  const locale = resolveFallbackLocaleFromPathname(pathname);

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ClientAreaFallbackScreen
      errorDigest={error.digest}
      locale={locale}
      mode="error"
      onRetry={retry}
    />
  );
}
