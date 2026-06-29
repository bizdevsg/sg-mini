import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

import { resolveLocalizedHref } from "@/components/organisms/client-area.shared";
import type {
  ActionId,
  DashboardCopy,
} from "@/components/organisms/client-area.types";
import type { AppLocale } from "@/locales";

type ClientAreaActionModalProps = {
  actionId: ActionId;
  copy: DashboardCopy;
  locale: AppLocale;
  onClose: () => void;
};

function renderActionModalContent(
  actionId: ActionId,
  copy: DashboardCopy,
  locale: AppLocale,
) {
  const productHref = resolveLocalizedHref(locale, "/produk/multilateral");
  const educationHref = resolveLocalizedHref(locale, "/education/cara-memulai");
  const contactHref = resolveLocalizedHref(locale, "/contact-us");

  if (actionId === "products") {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10 text-3xl text-yellow-500">
            <FontAwesomeIcon icon={["fas", "box-open"]} />
          </div>
          <h3 className="text-lg font-bold text-zinc-100">
            {copy.modalTitles[actionId]}
          </h3>
          <p className="mt-2 text-xs text-zinc-400">
            {copy.modalDescriptions[actionId]}
          </p>
        </div>

        <div className="grid gap-3">
          <Link
            href={productHref}
            className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-3 text-sm text-zinc-200 transition hover:border-yellow-500/30"
          >
            <p className="font-bold text-yellow-500">Loco London Gold</p>
            <p className="mt-1 text-xs text-zinc-400">
              Kontrak emas gulir harian dengan likuiditas tinggi dan update market cepat.
            </p>
          </Link>
          <Link
            href={productHref}
            className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-3 text-sm text-zinc-200 transition hover:border-yellow-500/30"
          >
            <p className="font-bold text-amber-500">Crude Olein</p>
            <p className="mt-1 text-xs text-zinc-400">
              Trading komoditas unggulan dengan struktur margin yang kompetitif.
            </p>
          </Link>
        </div>
      </div>
    );
  }

  if (actionId === "education") {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10 text-3xl text-yellow-500">
            <FontAwesomeIcon icon={["fas", "graduation-cap"]} />
          </div>
          <h3 className="text-lg font-bold text-zinc-100">
            {copy.modalTitles[actionId]}
          </h3>
          <p className="mt-2 text-xs text-zinc-400">
            {copy.modalDescriptions[actionId]}
          </p>
        </div>

        <div className="grid gap-3">
          <Link
            href={educationHref}
            className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-3 text-sm text-zinc-200 transition hover:border-yellow-500/30"
          >
            <p className="font-bold">1. Pengenalan Pasar Berjangka</p>
            <p className="mt-1 text-xs text-zinc-500">Estimasi 12 menit baca</p>
          </Link>
          <Link
            href={educationHref}
            className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-3 text-sm text-zinc-200 transition hover:border-yellow-500/30"
          >
            <p className="font-bold">2. Membaca Grafik Candlestick</p>
            <p className="mt-1 text-xs text-zinc-500">Estimasi 18 menit baca</p>
          </Link>
        </div>
      </div>
    );
  }

  if (actionId === "temporary") {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800 text-3xl text-zinc-400">
          <FontAwesomeIcon icon={["fas", "hourglass-half"]} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-zinc-100">
            {copy.modalTitles[actionId]}
          </h3>
          <p className="mt-2 text-xs text-zinc-400">
            {copy.modalDescriptions[actionId]}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-700 bg-zinc-800/60 p-4 text-left">
          <span className="block text-[10px] uppercase text-zinc-500">
            Status dokumen
          </span>
          <span className="mt-1 block text-sm font-bold text-zinc-200">
            Verifikasi Rekening Terpisah
          </span>
          <span className="mt-2 inline-block rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2 py-0.5 text-[10px] font-bold text-yellow-500">
            Menunggu persetujuan
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div
          className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-3xl ${
            actionId === "deposit"
              ? "bg-emerald-500/10 text-emerald-500"
              : "bg-rose-500/10 text-rose-500"
          }`}
        >
          <FontAwesomeIcon
            icon={
              actionId === "deposit"
                ? ["fas", "circle-down"]
                : ["fas", "arrow-up-from-bracket"]
            }
          />
        </div>
        <h3 className="text-lg font-bold text-zinc-100">
          {copy.modalTitles[actionId]}
        </h3>
        <p className="mt-2 text-xs text-zinc-400">
          {copy.modalDescriptions[actionId]}
        </p>
      </div>

      <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-4 text-sm text-zinc-200">
        <p className="font-semibold">
          {actionId === "deposit"
            ? "Gunakan rekening segregated account resmi untuk top-up dana."
            : "Permintaan withdrawal diproses ke rekening bank yang sudah terdaftar."}
        </p>
        <p className="mt-2 text-xs text-zinc-400">
          Untuk proses aktual, lanjutkan melalui tim support atau halaman transaksi resmi.
        </p>
      </div>

      <Link
        href={contactHref}
        className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 px-4 py-3 text-sm font-bold text-black transition hover:from-yellow-400 hover:to-amber-500"
      >
        Hubungi support
      </Link>
    </div>
  );
}

export function ClientAreaActionModal({
  actionId,
  copy,
  locale,
  onClose,
}: ClientAreaActionModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 transition hover:text-white"
        >
          <FontAwesomeIcon icon={["fas", "xmark"]} className="text-lg" />
        </button>
        {renderActionModalContent(actionId, copy, locale)}
      </div>
    </div>
  );
}
