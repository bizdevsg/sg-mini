type FooterLinkColumnProps = {
  title: string;
  items: string[];
};

export function FooterLinkColumn({ title, items }: FooterLinkColumnProps) {
  return (
    <div className="rounded-[28px] border border-[rgba(205,161,58,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 backdrop-blur-sm shadow-[0_18px_40px_rgba(0,0,0,0.26)]">
      <p className="text-center font-mono text-lg font-bold text-yellow-500 sm:text-left">
        {title}
      </p>
      <div className="mt-4 space-y-3 text-center text-sm text-foreground/72 sm:text-left">
        {items.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </div>
  );
}
