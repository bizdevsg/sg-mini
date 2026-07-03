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
      className={`flex w-full pl-5 pr-10 py-5 items-center gap-2 text-center transition-all duration-300 cursor-pointer ${isActive
        ? "border-l-2 border-yellow-500 bg-linear-to-r from-yellow-500/20 to-transparent text-yellow-500"
        : "hover:border-l-2 hover:border-yellow-500 text-zinc-500 hover:bg-linear-to-r hover:from-yellow-500/20 hover:to-transparent hover:text-yellow-500"
        }`}
    >
      <FontAwesomeIcon icon={icon} className="text-lg" />
      <span className="mt-1 text-xs font-medium leading-tight">{label}</span>
    </Link>
  );
}
