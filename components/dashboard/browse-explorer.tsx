"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState, ResourceCard } from "@/components/dashboard/home-cards";
import type {
  AcademicLevel,
  ModuleSummary,
  ResourceSummary,
  ResourceType,
} from "@/lib/home-types";
import { levelLabels, resourceTypeLabels } from "@/lib/home-types";

type BrowseExplorerProps = {
  readonly modules: readonly ModuleSummary[];
  readonly resources: readonly ResourceSummary[];
};

type SortMode = "newest" | "oldest" | "title";

const resourceTypes: readonly ResourceType[] = [
  "course",
  "td",
  "tp",
  "exam",
  "summary",
  "solution",
  "project",
  "other",
];
const levels: readonly AcademicLevel[] = ["L1", "L2", "L3", "M1", "M2"];
const inputClasses =
  "h-11 w-full rounded-lg border border-input bg-background px-4 text-sm font-semibold text-foreground transition placeholder:text-muted-foreground/65 focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/20";

export function BrowseExplorer({ modules, resources }: BrowseExplorerProps) {
  const [query, setQuery] = useState("");
  const [moduleId, setModuleId] = useState("all");
  const [level, setLevel] = useState<AcademicLevel | "all">("all");
  const [type, setType] = useState<ResourceType | "all">("all");
  const [sort, setSort] = useState<SortMode>("newest");

  const filteredResources = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return resources
      .filter((resource) => {
        const matchesQuery =
          !normalizedQuery ||
          resource.title.toLowerCase().includes(normalizedQuery) ||
          (resource.description ?? "").toLowerCase().includes(normalizedQuery) ||
          resource.moduleName.toLowerCase().includes(normalizedQuery);
        const matchesModule = moduleId === "all" || resource.moduleId === moduleId;
        const matchesLevel = level === "all" || resource.moduleLevel === level;
        const matchesType = type === "all" || resource.resourceType === type;

        return matchesQuery && matchesModule && matchesLevel && matchesType;
      })
      .toSorted((first, second) => {
        if (sort === "title") {
          return first.title.localeCompare(second.title);
        }

        const firstTime = new Date(first.createdAt).getTime();
        const secondTime = new Date(second.createdAt).getTime();
        return sort === "newest" ? secondTime - firstTime : firstTime - secondTime;
      });
  }, [level, moduleId, query, resources, sort, type]);

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-border bg-background p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1.4fr_repeat(4,minmax(0,1fr))]">
          <label className="relative block">
            <span className="sr-only">ابحث عن الموارد</span>
            <Search
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className={`${inputClasses} pr-10`}
              placeholder="ابحث عن الموارد"
            />
          </label>

          <select
            value={moduleId}
            onChange={(event) => setModuleId(event.target.value)}
            className={inputClasses}
            aria-label="تصفية حسب المقرر"
          >
            <option value="all">كل المقررات</option>
            {modules.map((module) => (
              <option key={module.id} value={module.id}>
                {module.name}
              </option>
            ))}
          </select>

          <select
            value={level}
            onChange={(event) => setLevel(event.target.value as AcademicLevel | "all")}
            className={inputClasses}
            aria-label="تصفية حسب المستوى"
          >
            <option value="all">كل المستويات</option>
            {levels.map((item) => (
              <option key={item} value={item}>
                {levelLabels[item]}
              </option>
            ))}
          </select>

          <select
            value={type}
            onChange={(event) => setType(event.target.value as ResourceType | "all")}
            className={inputClasses}
            aria-label="تصفية حسب نوع المورد"
          >
            <option value="all">كل الأنواع</option>
            {resourceTypes.map((item) => (
              <option key={item} value={item}>
                {resourceTypeLabels[item]}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortMode)}
            className={inputClasses}
            aria-label="ترتيب الموارد"
          >
            <option value="newest">الأحدث أولًا</option>
            <option value="oldest">الأقدم أولًا</option>
            <option value="title">العنوان أ-ي</option>
          </select>
        </div>

        <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <SlidersHorizontal className="size-4" aria-hidden="true" />
          {filteredResources.length} مورد
          {filteredResources.length === 1 ? "" : ""} تم العثور عليه
        </p>
      </section>

      {filteredResources.length > 0 ? (
        <div className="grid gap-4">
          {filteredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="لا توجد موارد مطابقة"
          description="غيّر كلمات البحث أو المرشحات أو الترتيب للعثور على الموارد المقبولة المتاحة."
        />
      )}
    </div>
  );
}
