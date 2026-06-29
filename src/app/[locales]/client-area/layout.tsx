import type { ReactNode } from "react";

import { SectionContainer } from "@/components/atoms/SectionContainer";

type ClientAreaLayoutProps = {
  children: ReactNode;
};

export default function ClientAreaLayout({
  children,
}: ClientAreaLayoutProps) {
  return (
    <SectionContainer className="relative pb-16 pt-24 sm:pb-20 sm:pt-28">
      <div className="pointer-events-none absolute inset-x-6 top-12 h-36 rounded-full bg-yellow-500/10 blur-3xl sm:inset-x-16 sm:h-44" />
      <div className="relative">{children}</div>
    </SectionContainer>
  );
}
