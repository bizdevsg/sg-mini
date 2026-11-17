import { ChevronUp } from "lucide-react";
import type { ReactNode } from "react";

type ClientAreaTradePilotPlanAccordionProps = {
  children: ReactNode;
  defaultOpen?: boolean;
  icon: ReactNode;
  subtitle?: string;
  title: string;
};

export function ClientAreaTradePilotPlanAccordion({
  children,
  defaultOpen = true,
  icon,
  subtitle,
  title,
}: ClientAreaTradePilotPlanAccordionProps) {
  return (
    <details
      className="group rounded-2xl border border-zinc-700 bg-zinc-900/90 p-5"
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-start gap-3 text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 [&::-webkit-details-marker]:hidden">
        {icon}
        <span>
          {title}
          {subtitle ? (
            <small className="mt-1 block text-xs font-normal leading-5 text-zinc-500">
              {subtitle}
            </small>
          ) : null}
        </span>
        <ChevronUp className="ml-auto h-5 w-5 shrink-0 rotate-180 text-zinc-500 transition-transform group-open:rotate-0" />
      </summary>
      {children}
    </details>
  );
}
