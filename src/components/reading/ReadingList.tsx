"use client";

import CollapsibleSection from "./CollapsibleSection";
import ArticleCard from "./ArticleCard";
import type { ArticleSummary } from "@/types";

type Group = { source: string; articles: ArticleSummary[] };

export default function ReadingList({ groups }: { groups: Group[] }) {
  if (groups.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400">暂无文章</p>
      </div>
    );
  }

  return (
    <>
      {groups.map((group) => (
        <CollapsibleSection
          key={group.source}
          defaultOpen={true}
          title={
            group.source === "Cambridge IELTS 14" ? (
              <span className="flex items-center gap-2 text-lg font-bold text-mint-700">
                <span className="bg-mint-100 text-mint-700 text-xs font-medium px-2 py-0.5 rounded">
                  CAMBRIDGE 14
                </span>
                剑桥雅思真题 14
              </span>
            ) : (
              <span className="text-base font-semibold text-gray-600">
                预置练习文章
              </span>
            )
          }
        >
          {group.source === "Cambridge IELTS 14" ? (
            (() => {
              const testGroups = new Map<string, ArticleSummary[]>();
              for (const a of group.articles) {
                const s = a.section || "Other";
                const list = testGroups.get(s) || [];
                list.push(a);
                testGroups.set(s, list);
              }
              return Array.from(testGroups.entries()).map(([testName, testArticles]) => (
                <div key={testName} className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-600 mb-3 border-l-2 border-mint-400 pl-3">
                    {testName}
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {testArticles.map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                </div>
              ));
            })()
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {group.articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </CollapsibleSection>
      ))}
    </>
  );
}
