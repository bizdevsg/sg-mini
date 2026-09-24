type EmptyStatePanelProps = {
  body: string;
  title?: string;
  variant?: "default" | "warning";
  className?: string;
};

const variantClassNames = {
  default: "border-line bg-white/5 text-foreground/58",
  warning: "border-rose-500/30 bg-rose-500/10 text-rose-200",
};

export function EmptyStatePanel({
  body,
  title,
  variant = "default",
  className = "",
}: EmptyStatePanelProps) {
  return (
    <div
      className={`rounded-2xl border px-5 py-8 ${variantClassNames[variant]} ${className}`}
    >
      {title ? <h2 className="text-xl font-bold text-white">{title}</h2> : null}
      <p className={title ? "mt-2 text-sm" : "text-sm"}>{body}</p>
    </div>
  );
}
