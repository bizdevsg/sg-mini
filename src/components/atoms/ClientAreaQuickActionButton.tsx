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
      className="group flex flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3 transition-all duration-300 hover:border-yellow-500/40 hover:bg-zinc-800/80"
    >
      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-yellow-500 transition-transform group-hover:scale-110">
        <FontAwesomeIcon icon={icon} className="text-xl" />
      </div>
      <span className="text-[10px] font-semibold text-zinc-300 md:text-xs">
        {label}
      </span>
    </button>
  );
}
