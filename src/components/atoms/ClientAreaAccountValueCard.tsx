type ClientAreaAccountValueCardProps = {
  label: string;
  surfaceClassName: string;
  value: string;
  valueClassName: string;
};

export function ClientAreaAccountValueCard({
  label,
  surfaceClassName,
  value,
  valueClassName,
}: ClientAreaAccountValueCardProps) {
  return (
    <div className={`min-w-0 rounded-xl px-3 py-2 text-center ${surfaceClassName}`}>
      <span className="block text-xs font-bold uppercase tracking-tight text-neutral-800">
        {label}
      </span>
      <span
        className={`mt-1 block break-words text-xl font-black leading-tight ${valueClassName}`}
      >
        {value}
      </span>
    </div>
  );
}
