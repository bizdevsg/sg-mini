"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ContactMetaLabel } from "@/components/atoms/ContactMetaLabel";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";
import type { AppMessages } from "@/locales";

type ContactMapSectionProps = {
  copy: AppMessages["contactPage"]["map"];
  overviewCopy: AppMessages["contactPage"]["overview"];
  mapEmbedUrl: string;
  address?: string;
  companyName: string;
};

export function ContactMapSection({
  copy,
  overviewCopy,
  mapEmbedUrl,
  address,
  companyName,
}: ContactMapSectionProps) {
  const [copied, setCopied] = useState(false);
  const directMapsUrl = address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    : mapEmbedUrl.replace("&output=embed", "").replace("&z=15", "");

  const handleCopyAddress = async () => {
    if (!address) {
      return;
    }

    try {
      await navigator.clipboard.writeText(`${companyName}\n${address}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <ScrollReveal
      effect="fade-left"
      className="overflow-hidden rounded-2xl border border-line bg-[#0f0f0f] shadow-lg"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 px-6 py-5 sm:px-8">
        <div>
          <h3 className="text-lg font-bold text-white sm:text-xl">
            {copy.title}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-zinc-400">
            {copy.description}
          </p>

          {address ? (
            <div className="mt-4 rounded-xl border border-white/8 bg-white/[0.03] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <ContactMetaLabel>{overviewCopy.addressLabel}</ContactMetaLabel>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">{address}</p>
                </div>

                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2 text-xs font-medium text-zinc-300 transition hover:border-yellow-500/30 hover:text-yellow-500 focus:outline-none"
                  title="Salin alamat"
                >
                  <FontAwesomeIcon
                    icon={copied ? ["fas", "check"] : ["fas", "copy"]}
                    className="text-xs"
                  />
                  <span>{copied ? "Tersalin!" : "Salin"}</span>
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <a
          href={directMapsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-line bg-white/5 px-3.5 py-2 text-xs font-semibold text-zinc-300 transition hover:border-yellow-500/30 hover:text-yellow-500 focus:outline-none"
        >
          <FontAwesomeIcon icon={["fas", "arrow-up-right-from-square"]} className="text-xs" />
          <span>Buka Google Maps</span>
        </a>
      </div>

      <iframe
        title={copy.iframeTitle}
        src={mapEmbedUrl}
        className="h-full min-h-125 w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </ScrollReveal>
  );
}
