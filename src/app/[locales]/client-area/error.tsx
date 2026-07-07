"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { ClientAreaFallbackScreen } from "@/components/organisms/ClientAreaFallbackScreen";
import { resolveFallbackLocaleFromPathname } from "@/lib/route-fallback";

export default function ClientAreaError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
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
      onRetry={() => unstable_retry()}
    />
  );
}
