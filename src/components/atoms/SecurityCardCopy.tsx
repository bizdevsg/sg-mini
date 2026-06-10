type SecurityCardCopyProps = {
  title: string;
  body: string;
  className?: string;
};

export function SecurityCardCopy({
  title,
  body,
  className = "",
}: SecurityCardCopyProps) {
  return (
    <div className={`relative z-10 ${className}`}>
      <h3 className="font-bold leading-[1.08] tracking-[-0.045em] text-[1.5rem] text-yellow-500 sm:text-2xl">
        {title}
      </h3>
      <p className="mt-5 text-xs leading-[1.45] text-foreground/72 sm:text-sm">
        {body}
      </p>
    </div>
  );
}
