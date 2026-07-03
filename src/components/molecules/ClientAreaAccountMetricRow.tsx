import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type ClientAreaAccountMetricRowProps = {
  icon: IconProp;
  label: string;
  value: string;
  withDivider: boolean;
};

export function ClientAreaAccountMetricRow({
  icon,
  label,
  value,
  withDivider,
}: ClientAreaAccountMetricRowProps) {
  return (
    <div
      className={`flex flex-col items-center gap-3 ${
        withDivider ? "border-b border-black/10 pb-1.5" : ""
      }`}
    >
      <span className="flex items-center gap-1 text-sm text-neutral-800">
        <FontAwesomeIcon icon={icon} className="text-neutral-900/60" />
        {label}
      </span>
      <span className="text-xl font-bold text-black">{value}</span>
    </div>
  );
}
