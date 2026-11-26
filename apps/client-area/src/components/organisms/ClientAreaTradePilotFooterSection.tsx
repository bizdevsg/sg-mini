import {
  ArrowLeftRight,
  Bot,
  Handshake,
  Info,
  Scale,
  ToggleRight,
  TriangleAlert,
  Wallet,
} from "lucide-react";
import Image from "next/image";

import type { ClientAreaTradePilotFooterCopy } from "@/lib/client-area-trade-pilot.shared";

// Urutan mengikuti supportParagraphs di locale: mitra, hasil AI, tanpa eksekusi,
// opsional, pembelian kredit, ketidakakuratan. Ubah keduanya bersamaan.
const POINT_ICONS = [Handshake, Bot, ArrowLeftRight, ToggleRight, Wallet, TriangleAlert];

type ClientAreaTradePilotFooterSectionProps = {
  copy: ClientAreaTradePilotFooterCopy;
};

export function ClientAreaTradePilotFooterSection({
  copy,
}: ClientAreaTradePilotFooterSectionProps) {
  // Paragraf terakhir (klausul tanggung jawab) tampil sebagai penutup selebar kartu.
  const points = copy.supportParagraphs.slice(0, -1);
  const closing = copy.supportParagraphs.at(-1);

  return (
    <footer className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-zinc-950/85 p-5 backdrop-blur-lg sm:p-6">
      {/* Aksen dekoratif: garis emas di tepi atas dan pendar di sudut. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-amber-400/80 to-transparent"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-amber-500/15 blur-3xl"
      />

      <div className="relative flex items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-amber-500/40 bg-linear-to-br from-amber-500/25 to-amber-500/5 shadow-lg shadow-amber-500/10">
          <Image
            alt={copy.logoAlt}
            className="h-10 w-10 object-contain"
            height={40}
            src="/assets/logo-tp.webp"
            width={40}
          />
        </span>
        <h3 className="text-base font-bold tracking-wide text-amber-400 sm:text-lg">
          {copy.supportTitle}
        </h3>
        <span
          aria-hidden="true"
          className="h-px flex-1 bg-linear-to-r from-amber-500/40 to-transparent"
        />
      </div>

      <ul className="relative mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {points.map((point, index) => {
          const Icon = POINT_ICONS[index] ?? Info;

          return (
            <li
              key={point}
              className="flex items-start gap-3 rounded-2xl border border-white/5 bg-white/3 p-4"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                <Icon aria-hidden="true" className="h-4.5 w-4.5" />
              </span>
              <p className="text-xs leading-5 text-zinc-300 sm:text-[13px] sm:leading-5.5">
                {point}
              </p>
            </li>
          );
        })}
      </ul>

      {closing ? (
        <div className="relative mt-3 flex items-center gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4">
          <Scale aria-hidden="true" className="h-5 w-5 shrink-0 text-amber-400" />
          <p className="text-xs leading-5 text-zinc-200 sm:text-[13px]">{closing}</p>
        </div>
      ) : null}
    </footer>
  );
}
