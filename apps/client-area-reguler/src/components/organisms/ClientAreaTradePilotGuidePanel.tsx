"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Brain,
  CheckCircle2,
  Compass,
  FileText,
  Library,
  Lock,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  X,
  type LucideIcon,
} from "lucide-react";

import { ClientAreaTradePilotGuideCategoryButton } from "@/components/atoms/ClientAreaTradePilotGuideCategoryButton";
import { ClientAreaTradePilotGuideArticleCard } from "@/components/molecules/ClientAreaTradePilotGuideArticleCard";
import type {
  TradePilotGuideArticle,
  TradePilotGuideCategoryId,
  TradePilotGuidePageContent,
} from "@/locales/trade-pilot-guide-page";

type CategoryFilter = "all" | TradePilotGuideCategoryId;

type ClientAreaTradePilotGuidePanelProps = {
  copy: TradePilotGuidePageContent;
};

const CATEGORY_ICONS: Record<TradePilotGuideCategoryId, LucideIcon> = {
  "getting-started": Compass,
  "analysis-manual": Target,
  glossary: Library,
  "data-privacy": Lock,
  psychology: Brain,
};

function getArticleIcon(categoryId: TradePilotGuideCategoryId) {
  return CATEGORY_ICONS[categoryId] ?? BookOpen;
}

export function ClientAreaTradePilotGuidePanel({
  copy,
}: ClientAreaTradePilotGuidePanelProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [query, setQuery] = useState("");
  const [selectedArticle, setSelectedArticle] =
    useState<TradePilotGuideArticle | null>(null);

  const categoryLabels = useMemo(
    () =>
      Object.fromEntries(
        copy.categories.map((category) => [category.id, category.label]),
      ) as Record<TradePilotGuideCategoryId, string>,
    [copy.categories],
  );

  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return copy.articles.filter((article) => {
      const matchesCategory =
        activeCategory === "all" || article.categoryId === activeCategory;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${article.title} ${article.summary}`
          .toLocaleLowerCase()
          .includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, copy.articles, query]);

  const quickStartArticles = copy.quickStartArticleIds
    .map((articleId) => copy.articles.find(({ id }) => id === articleId))
    .filter((article): article is TradePilotGuideArticle => Boolean(article));

  if (selectedArticle) {
    return (
      <div className="min-w-0 space-y-3 text-sm">
        <article className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/10">
          <div className="border-b border-zinc-800 p-5 sm:p-6">
            <button
              type="button"
              onClick={() => setSelectedArticle(null)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 transition hover:text-yellow-400"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {copy.backLabel}
            </button>

            <div className="mt-5 flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-yellow-500/30 bg-yellow-500/10 text-yellow-400">
                {(() => {
                  const Icon = getArticleIcon(selectedArticle.categoryId);
                  return <Icon className="h-5 w-5" aria-hidden="true" />;
                })()}
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-yellow-400">
                  {categoryLabels[selectedArticle.categoryId]}
                </p>
                <h1 className="mt-1.5 max-w-3xl text-lg font-bold leading-tight text-white sm:text-xl">
                  {selectedArticle.title}
                </h1>
                <p className="mt-2 text-xs text-zinc-500">
                  {selectedArticle.readingTime}
                </p>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-3xl space-y-4 p-5 text-sm leading-6 text-zinc-300 sm:p-6">
            <p className="font-semibold leading-6 text-zinc-100">
              {selectedArticle.summary}
            </p>
            {selectedArticle.content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}

            <div className="flex gap-3 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4 text-xs leading-5 text-zinc-300">
              <ShieldCheck
                className="mt-0.5 h-5 w-5 shrink-0 text-yellow-400"
                aria-hidden="true"
              />
              <p>{copy.learningNote}</p>
            </div>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-3 text-sm">
      <section className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.45fr)] lg:items-end">
        <div className="min-w-0">
          <h1 className="mt-1.5 text-lg font-bold text-white sm:text-xl">
            {copy.title}
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-zinc-400">
            {copy.description}
          </p>

          <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold text-zinc-400">
            <span className="rounded-lg border border-zinc-800 bg-zinc-900/70 backdrop-blur-sm px-2.5 py-1">
              {copy.articles.length} {copy.articleCountLabel}
            </span>
            <span className="rounded-lg border border-zinc-800 bg-zinc-900/70 backdrop-blur-sm px-2.5 py-1">
              {copy.categories.length} {copy.categoryCountLabel}
            </span>
          </div>
        </div>

        <label className="block min-w-0">
          <span className="sr-only">{copy.searchLabel}</span>
          <span className="flex h-11 items-center gap-3 rounded-xl border border-zinc-800 px-4 transition focus-within:border-yellow-500/70">
            <Search className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.searchPlaceholder}
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label={copy.clearSearchLabel}
                className="rounded-md p-1 text-zinc-500 transition hover:bg-zinc-800 hover:text-white"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : null}
          </span>
        </label>
      </section>

      {!query && activeCategory === "all" ? (
        <section className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <span className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-2 text-yellow-400">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-base font-bold text-white">
                {copy.featuredLabel}
              </h2>
              <p className="mt-1 text-xs leading-5 text-zinc-500">
                {copy.featuredDescription}
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {quickStartArticles.map((article, index) => (
              <ClientAreaTradePilotGuideArticleCard
                key={article.id}
                article={article}
                categoryLabel={categoryLabels[article.categoryId]}
                featured
                icon={getArticleIcon(article.categoryId)}
                index={index}
                onSelect={() => setSelectedArticle(article)}
                readLabel={copy.readLabel}
              />
            ))}
          </div>
        </section>
      ) : null}

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <ClientAreaTradePilotGuideCategoryButton
          active={activeCategory === "all"}
          icon={FileText}
          label={copy.allCategoriesLabel}
          onClick={() => setActiveCategory("all")}
        />
        {copy.categories.map((category) => (
          <ClientAreaTradePilotGuideCategoryButton
            key={category.id}
            active={activeCategory === category.id}
            icon={CATEGORY_ICONS[category.id]}
            label={category.label}
            onClick={() => setActiveCategory(category.id)}
          />
        ))}
      </div>

      {filteredArticles.length ? (
        <div className="space-y-5">
          {copy.categories.map((category) => {
            const categoryArticles = filteredArticles.filter(
              (article) => article.categoryId === category.id,
            );

            if (!categoryArticles.length) {
              return null;
            }

            const CategoryIcon = CATEGORY_ICONS[category.id];

            return (
              <section
                key={category.id}
                className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/50"
              >
                <div className="flex items-start gap-3 border-b border-zinc-800 px-4 py-4 sm:px-5">
                  <span className="rounded-lg border border-zinc-800 bg-zinc-900/70 backdrop-blur-sm p-2 text-yellow-400">
                    <CategoryIcon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-sm font-bold text-white sm:text-base">
                        {category.label}
                      </h2>
                      <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-bold text-zinc-400">
                        {categoryArticles.length}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-zinc-500">
                      {category.description}
                    </p>
                  </div>
                </div>

                <div className="grid gap-2 p-2 sm:grid-cols-2 sm:p-3 xl:grid-cols-3">
                  {categoryArticles.map((article) => (
                    <ClientAreaTradePilotGuideArticleCard
                      key={article.id}
                      article={article}
                      categoryLabel={category.label}
                      icon={getArticleIcon(article.categoryId)}
                      onSelect={() => setSelectedArticle(article)}
                      readLabel={copy.readLabel}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="flex min-h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/70 backdrop-blur-sm p-6 text-center">
          <Search className="h-7 w-7 text-zinc-700" aria-hidden="true" />
          <h2 className="mt-3 text-sm font-bold text-white">{copy.emptyTitle}</h2>
          <p className="mt-1 text-xs text-zinc-500">{copy.emptyDescription}</p>
        </div>
      )}

      <section className="grid gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:p-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-yellow-500/30 bg-yellow-500/10 text-yellow-400">
          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-sm font-bold text-white sm:text-base">
            {copy.learningTitle}
          </h2>
          <p className="mt-1 text-xs leading-5 text-zinc-400">
            {copy.learningNote}
          </p>
        </div>
      </section>
    </div>
  );
}
