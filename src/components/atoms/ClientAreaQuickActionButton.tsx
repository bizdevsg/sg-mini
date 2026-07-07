import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type ClientAreaQuickActionButtonProps = {
  icon: IconProp;
  label: string;
  onClick: () => void;
};

export function ClientAreaQuickActionButton({
  icon,
  label,
  onClick,
}: ClientAreaQuickActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-28 flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/50 p-3 text-center transition-all duration-300 backdrop-blur-sm hover:border-yellow-500/40 hover:bg-zinc-800/60 sm:min-h-32"
    >
      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-yellow-500 transition-transform group-hover:scale-110">
        <FontAwesomeIcon icon={icon} className="text-xl" />
      </div>
      <span className="line-clamp-2 text-[11px] font-semibold leading-snug text-zinc-300 md:text-xs">
        {label}
      </span>
    </button>
  );
}
