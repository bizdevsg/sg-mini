"use client";

import { useState } from "react";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type ContactSupportItemCardProps = {
  title: string;
  description: string;
  value: string;
  icon: IconProp;
  href?: string;
};

export function ContactSupportItemCard({
  title,
  description,
  value,
  icon,
  href,
}: ContactSupportItemCardProps) {
  const [copied, setCopied] = useState(false);
  const isExternal = href?.startsWith("http");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="group flex flex-col rounded-[20px] border border-line bg-linear-to-br from-white/5 to-white/2 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] transition-all duration-300 hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/10 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-yellow-500/20 bg-yellow-500/10 text-yellow-500 transition-colors duration-300 group-hover:border-yellow-500/40 group-hover:bg-yellow-500/15">
            <FontAwesomeIcon icon={icon} className="text-sm" />
          </div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
            {title}
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/8 bg-white/[0.03] text-zinc-500 transition hover:border-yellow-500/30 hover:text-yellow-500 focus:outline-none"
          title="Salin"
        >
          <FontAwesomeIcon
            icon={copied ? ["fas", "check"] : ["fas", "copy"]}
            className="text-xs"
          />
        </button>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-zinc-400">{description}</p>

      <div className="mt-3 border-t border-white/8 pt-3">
        {href ? (
          <a
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noreferrer" : undefined}
            className="inline-flex items-center gap-2 break-all text-sm font-semibold text-yellow-500 transition hover:text-yellow-400"
          >
            <span>{value}</span>
            <FontAwesomeIcon
              icon={isExternal ? ["fas", "arrow-up-right-from-square"] : ["fas", "chevron-right"]}
              className="text-[10px] opacity-60 transition-transform group-hover:translate-x-0.5"
            />
          </a>
        ) : (
          <p className="break-all text-sm font-semibold text-yellow-500">{value}</p>
        )}
      </div>
    </div>
  );
}
