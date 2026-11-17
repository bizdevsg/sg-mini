"use client";

import { useState } from "react";

import { EbookDetailModal } from "@/components/molecules/EbookDetailModal";
import { EbookResourceCard } from "@/components/molecules/EbookResourceCard";
import type { EbookResource } from "@/lib/ebook.shared";
import { ScrollReveal } from "../molecules/ScrollReveal";

type EbookResourceLibraryProps = {
  closeLabel: string;
  downloadCtaLabel: string;
  items: EbookResource[];
  previewCtaLabel: string;
};

export function EbookResourceLibrary({
  closeLabel,
  downloadCtaLabel,
  items,
  previewCtaLabel,
}: EbookResourceLibraryProps) {
  const [activeItem, setActiveItem] = useState<EbookResource | null>(null);

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item, index) => (
          <ScrollReveal key={item.slug} delay={index * 200} >
            <EbookResourceCard
              categoryLabel={item.categoryName}
              ctaLabel={downloadCtaLabel}
              description={item.excerpt || item.description || item.title}
              fileUrl={item.fileUrl}
              imageSrc={item.imageSrc}
              onPreviewClick={() => setActiveItem(item)}
              previewLabel={previewCtaLabel}
              title={item.title}
            />
          </ScrollReveal>
        ))}
      </div>

      <EbookDetailModal
        closeLabel={closeLabel}
        ctaLabel={downloadCtaLabel}
        isOpen={Boolean(activeItem)}
        item={activeItem}
        onClose={() => setActiveItem(null)}
      />
    </>
  );
}
