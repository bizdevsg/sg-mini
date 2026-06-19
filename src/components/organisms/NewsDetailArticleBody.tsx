type NewsDetailArticleBodyProps = {
  bodyHtml: string;
};

export function NewsDetailArticleBody({ bodyHtml }: NewsDetailArticleBodyProps) {
  return (
    <article
      className={[
        "text-base leading-8 text-zinc-200",
        "[&_h1]:mb-5 [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:leading-tight [&_h1]:text-white",
        "[&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:leading-tight [&_h2]:text-white",
        "[&_h3]:mb-4 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:leading-tight [&_h3]:text-white",
        "[&_p]:mb-5 [&_p]:leading-8 [&_p]:text-zinc-200",
        "[&_ul]:mb-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6",
        "[&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6",
        "[&_li]:leading-8 [&_li]:text-zinc-200",
        "[&_blockquote]:mb-5 [&_blockquote]:border-l-2 [&_blockquote]:border-yellow-500/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-zinc-100",
        "[&_a]:text-yellow-400 [&_a]:underline [&_a]:underline-offset-4",
        "[&_strong]:font-semibold [&_strong]:text-white",
        "[&_em]:italic",
        "[&_div]:text-zinc-200 [&_span]:text-inherit",
        "[&_img]:my-6 [&_img]:rounded-2xl",
        "[&_table]:mb-5 [&_table]:w-full [&_table]:border-collapse",
        "[&_td]:border [&_td]:border-line [&_td]:px-3 [&_td]:py-2 [&_td]:align-top [&_td]:text-zinc-200",
        "[&_th]:border [&_th]:border-line [&_th]:bg-white/5 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:text-white",
      ].join(" ")}
      dangerouslySetInnerHTML={{ __html: bodyHtml }}
    />
  );
}
