type ClientAreaTradePilotPlanMetricProps = {
  description?: string;
  descriptionTone?: "default" | "success";
  label: string;
  tone?: "default" | "danger" | "success";
  value: string;
  variant?: "default" | "compact";
};

const VALUE_CLASS_NAMES = {
  default: "text-white",
  danger: "text-red-400",
  success: "text-emerald-400",
} as const;

export function ClientAreaTradePilotPlanMetric({
  description,
  descriptionTone = "default",
  label,
  tone = "default",
  value,
  variant = "default",
}: ClientAreaTradePilotPlanMetricProps) {
  return (
    <div
      className={`${variant === "compact" ? "rounded-xl bg-[#1a1d29]" : "rounded-2xl bg-[#171924]/95"} border border-zinc-700/80 p-4`}
    >
      <p
        className={`${variant === "compact" ? "text-xs" : "text-xs sm:text-sm"} font-medium text-zinc-400`}
      >
        {label}
      </p>
      <strong
        className={`${variant === "compact" ? "mt-1 text-sm" : "mt-3 text-base"} block font-black ${VALUE_CLASS_NAMES[tone]}`}
      >
        {value}
      </strong>
      {description ? (
        <p
          className={`${variant === "compact" ? "mt-1" : "mt-2"} text-[11px] leading-4 sm:text-xs sm:leading-5 ${descriptionTone === "success" ? "font-bold text-emerald-400" : "text-zinc-500"}`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
