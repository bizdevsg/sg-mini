type ContactMetaLabelProps = {
  children: React.ReactNode;
};

export function ContactMetaLabel({ children }: ContactMetaLabelProps) {
  return (
    <dt className="text-xs font-medium uppercase text-zinc-500">{children}</dt>
  );
}
