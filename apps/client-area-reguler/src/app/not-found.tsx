"use client";

import { usePathname } from "next/navigation";

import { ButtonLink } from "@/components/atoms/ButtonLink";
import { FallbackPanel } from "@/components/organisms/FallbackPanel";
import {
  getRouteFallbackCopy,
  resolveFallbackLocaleFromPathname,
} from "@/lib/route-fallback";

export default function NotFound() {
  const pathname = usePathname();
  const locale = resolveFallbackLocaleFromPathname(pathname);
  const copy = getRouteFallbackCopy(locale).siteNotFound;

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-16 sm:px-8">
      <div className="w-full max-w-5xl">
        <FallbackPanel
          badge={copy.badge}
          code="404 Not Found"
          title={copy.title}
          description={copy.description}
          primaryAction={
            <ButtonLink href={`/${locale}`}>{copy.primaryLabel}</ButtonLink>
          }
        />
      </div>
    </main>
  );
}
