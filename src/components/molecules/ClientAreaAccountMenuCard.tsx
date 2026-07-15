import Link from "next/link";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type ClientAreaAccountMenuCardProps = {
  helperText?: string;
  href?: string;
  icon: IconProp;
  label: string;
  onClick?: () => void;
};

export function ClientAreaAccountMenuCard({
  helperText,
  href,
  icon,
  label,
  onClick,
}: ClientAreaAccountMenuCardProps) {
  const className =
    "group flex min-h-[118px] w-full flex-col items-center justify-center rounded-[18px] border border-zinc-700 bg-zinc-900/85 px-4 py-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-yellow-500/60 hover:bg-zinc-800/90";

  const content = (
    <>
      <div className="flex h-12 w-12 items-center justify-center text-yellow-400 transition-transform duration-300 group-hover:scale-110">
        <FontAwesomeIcon icon={icon} className="text-4xl" />
      </div>
      <span className="mt-4 text-base font-semibold leading-tight text-white">
        {label}
      </span>
      {helperText ? (
        <span className="mt-2 text-xs font-medium text-zinc-500">
          {helperText}
        </span>
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} prefetch={false} className={className}>
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {content}
      </button>
    );
  }

  return (
    <div aria-disabled="true" className={className}>
      {content}
    </div>
  );
}
