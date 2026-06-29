import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

type ClientAreaSidebarButtonProps = {
  href: string;
  icon: IconProp;
  label: string;
  isActive: boolean;
};

export function ClientAreaSidebarButton({
  href,
  icon,
  label,
  isActive,
}: ClientAreaSidebarButtonProps) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`flex h-12 w-12 flex-col items-center justify-center rounded-lg p-5 transition-all duration-300 cursor-pointer ${isActive
        ? "border border-yellow-500/30 bg-zinc-900/80 text-yellow-500"
        : "hover:border hover:border-yellow-500/30 text-zinc-500 hover:text-yellow-500/80"
        }`}
    >
      <FontAwesomeIcon icon={icon} className="text-lg" />
      <span className="mt-1 text-[9px] font-medium">{label}</span>
    </Link>
  );
}
