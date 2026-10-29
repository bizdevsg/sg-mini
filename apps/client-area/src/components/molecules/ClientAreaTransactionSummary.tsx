import { ClientAreaTransactionStatCard } from "@/components/atoms/ClientAreaTransactionStatCard";
import { formatSignedUsd } from "@/components/organisms/client-area.shared";
import type { PositionItem } from "@/components/organisms/client-area.types";

type ClientAreaTransactionSummaryProps = {
  buySellLabel: string;
  positions: PositionItem[];
  status: "loading" | "ready" | "unavailable" | "error";
  totalFloatingLabel: string;
  totalPositionsLabel: string;
};

export function ClientAreaTransactionSummary({
  buySellLabel,
  positions,
  status,
  totalFloatingLabel,
  totalPositionsLabel,
}: ClientAreaTransactionSummaryProps) {
  const isReady = status === "ready";
  const buyCount = positions.filter((item) => item.side === "buy").length;
  const sellCount = positions.length - buyCount;
  const floatingValues = positions
    .map((item) => item.floatingValue)
    .filter((value): value is number => typeof value === "number");
  const totalFloating =
    floatingValues.length > 0
      ? floatingValues.reduce((sum, value) => sum + value, 0)
      : null;
  const totalFloatingClassName =
    totalFloating === null || totalFloating === 0
      ? "text-white"
      : totalFloating > 0
        ? "text-emerald-400"
        : "text-rose-400";

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <ClientAreaTransactionStatCard
        label={totalPositionsLabel}
        value={isReady ? positions.length : "-"}
      />
      <ClientAreaTransactionStatCard
        label={buySellLabel}
        value={
          isReady ? (
            <>
              <span className="text-emerald-400">{buyCount}</span>
              <span className="text-zinc-600"> / </span>
              <span className="text-red-400">{sellCount}</span>
            </>
          ) : (
            "-"
          )
        }
      />

      <ClientAreaTransactionStatCard
        label={totalFloatingLabel}
        value={
          isReady && totalFloating !== null
            ? formatSignedUsd(totalFloating)
            : "-"
        }
        valueClassName={totalFloatingClassName}
      />
    </div>
  );
}
