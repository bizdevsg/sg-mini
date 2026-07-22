"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ContactMetaLabel } from "@/components/atoms/ContactMetaLabel";
import type { AppMessages } from "@/locales";

type ContactOverviewDetailsProps = {
  copy: AppMessages["contactPage"]["overview"];
  companyName: string;
  address: string;
  updatedAtLabel: string | null;
};

export function ContactOverviewDetails({
  copy,
  companyName,
  address,
  updatedAtLabel,
}: ContactOverviewDetailsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(`${companyName}\n${address}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(242,207,120,0.08),rgba(255,255,255,0.02))] p-5">
      <dl className="space-y-5">
        <div>
          <ContactMetaLabel>{copy.companyLabel}</ContactMetaLabel>
          <dd className="mt-2 text-sm font-semibold text-white">
            {companyName}
          </dd>
        </div>

        <div className="border-t border-white/8 pt-4">
          <div className="flex items-center justify-between gap-2">
            <ContactMetaLabel>{copy.addressLabel}</ContactMetaLabel>
            <button
              type="button"
              onClick={handleCopyAddress}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-yellow-500/80 transition hover:text-yellow-400 focus:outline-none"
              title="Salin Alamat"
            >
              <FontAwesomeIcon
                icon={copied ? ["fas", "check"] : ["fas", "copy"]}
                className="text-xs"
              />
              <span>{copied ? "Tersalin!" : "Salin"}</span>
            </button>
          </div>
          <dd className="mt-2 text-sm leading-6 text-zinc-300">{address}</dd>
        </div>

        {updatedAtLabel ? (
          <div className="border-t border-white/8 pt-4">
            <ContactMetaLabel>{copy.updatedLabel}</ContactMetaLabel>
            <dd className="mt-2 text-sm text-zinc-300">{updatedAtLabel}</dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
}
