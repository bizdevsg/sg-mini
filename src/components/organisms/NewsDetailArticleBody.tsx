type NewsDetailArticleBodyProps = {
  paragraphs: string[];
  slug: string;
};

export function NewsDetailArticleBody({
  paragraphs,
  slug,
}: NewsDetailArticleBodyProps) {
  return (
    <article className="space-y-5">
      {paragraphs.map((paragraph, index) => (
        <p
          key={`${slug}-${index}`}
          className="text-base leading-8 text-gray-200"
        >
          {paragraph}
        </p>
      ))}
    </article>
  );
}
