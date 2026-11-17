"use client";

import { usePathname } from "next/navigation";

import { SectionContainer } from "@/components/atoms/SectionContainer";

type ClientAreaViewOnlyDisclaimerProps = {
  body: string;
  hideOnTradePilot?: boolean;
  label: string;
};

export function ClientAreaViewOnlyDisclaimer({
  body,
  hideOnTradePilot = false,
  label,
}: ClientAreaViewOnlyDisclaimerProps) {
  const pathname = usePathname();

  if (hideOnTradePilot && pathname.includes("/client-area/trade-pilot")) {
    return null;
  }

  return (
    <aside
      aria-label={label}
      className="shrink-0 border-t border-amber-500/20 bg-zinc-950 py-5 text-white/60"
    >
      <SectionContainer>
        <p className="text-center text-xs leading-relaxed sm:text-sm">
          <span className="font-semibold text-amber-500">{label}</span>{" "}
          {body}
        </p>
      </SectionContainer>
    </aside>
  );
}
