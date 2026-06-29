import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ClientAreaArticleCard } from "@/components/molecules/ClientAreaArticleCard";
import type { DashboardCopy } from "@/components/organisms/client-area.types";

type ClientAreaNewsPanelProps = {
  copy: DashboardCopy;
};

export function ClientAreaNewsPanel({ copy }: ClientAreaNewsPanelProps) {
  return (
    <div className="space-y-6 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
      <h2 className="flex items-center gap-2 text-xl font-bold text-yellow-500">
        <FontAwesomeIcon icon={["fas", "newspaper"]} />
        {copy.newsTitle}
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        {copy.articles.map((article) => (
          <ClientAreaArticleCard key={article.title} article={article} />
        ))}
      </div>
    </div>
  );
}
