"use client";

import { useMemo, useState } from "react";

import { ResourceCard, SectionCard } from "@/components/dashboard/student-common";
import type {
  AcademicLevel,
  ModuleSummary,
  ResourceType,
  SemesterType,
} from "@/lib/home-types";
import {
  levelLabels,
  resourceTypeLabels,
} from "@/lib/home-types";
import type { DemoResource } from "@/lib/mock-data";

const levels: readonly (AcademicLevel | "all")[] = [
  "all",
  "L1",
  "L2",
  "L3",
  "M1",
  "M2",
];
const semesters: readonly (SemesterType | "all")[] = ["all", "S1", "S2"];
const types: readonly (ResourceType | "all")[] = [
  "all",
  "course",
  "td",
  "tp",
  "exam",
  "summary",
  "solution",
  "project",
  "other",
];

export function ExploreClient({
  resources,
  modules,
}: {
  readonly resources: readonly DemoResource[];
  readonly modules: readonly ModuleSummary[];
}) {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<AcademicLevel | "all">("all");
  const [semester, setSemester] = useState<SemesterType | "all">("all");
  const [type, setType] = useState<ResourceType | "all">("all");
  const [moduleId, setModuleId] = useState("all");
  const [sort, setSort] = useState("newest");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return resources
      .filter((resource) => {
        const matchesQuery =
          !normalized ||
          resource.title.toLowerCase().includes(normalized) ||
          resource.moduleName.toLowerCase().includes(normalized) ||
          resource.authorName.toLowerCase().includes(normalized);
        const matchesLevel = level === "all" || resource.moduleLevel === level;
        const matchesSemester =
          semester === "all" || resource.moduleSemester === semester;
        const matchesType = type === "all" || resource.resourceType === type;
        const matchesModule =
          moduleId === "all" || resource.moduleId === moduleId;

        return (
          matchesQuery &&
          matchesLevel &&
          matchesSemester &&
          matchesType &&
          matchesModule
        );
      })
      .sort((a, b) => {
        if (sort === "downloads") {
          return b.downloads - a.downloads;
        }
        if (sort === "views") {
          return b.views - a.views;
        }

        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [level, moduleId, query, resources, semester, sort, type]);

  return (
    <div className="space-y-5">
      <SectionCard>
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1.5fr)_repeat(5,minmax(0,1fr))]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-11 rounded-xl border border-input bg-background px-4 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-[3px] focus:ring-primary/20"
            placeholder="ابحث في الملفات"
            type="search"
          />
          <Select
            label="المستوى"
            value={level}
            onChange={(value) => setLevel(value as AcademicLevel | "all")}
            options={levels.map((item) => ({
              value: item,
              label: item === "all" ? "كل المستويات" : levelLabels[item],
            }))}
          />
          <Select
            label="السداسي"
            value={semester}
            onChange={(value) => setSemester(value as SemesterType | "all")}
            options={semesters.map((item) => ({
              value: item,
              label: item === "all" ? "كل السداسيات" : item,
            }))}
          />
          <Select
            label="النوع"
            value={type}
            onChange={(value) => setType(value as ResourceType | "all")}
            options={types.map((item) => ({
              value: item,
              label: item === "all" ? "كل الأنواع" : resourceTypeLabels[item],
            }))}
          />
          <Select
            label="المقرر"
            value={moduleId}
            onChange={setModuleId}
            options={[
              { value: "all", label: "كل المقررات" },
              ...modules.map((module) => ({
                value: module.id,
                label: module.name,
              })),
            ]}
          />
          <Select
            label="الترتيب"
            value={sort}
            onChange={setSort}
            options={[
              { value: "newest", label: "الأحدث" },
              { value: "downloads", label: "الأكثر تحميلا" },
              { value: "views", label: "الأكثر مشاهدة" },
            ]}
          />
        </div>
      </SectionCard>

      <div className="flex items-center justify-between text-sm font-bold text-muted-foreground">
        <span>{filtered.length.toLocaleString("ar-DZ")} ملف</span>
        <span>نتائج جاهزة للتصفح</span>
      </div>

      <div className="grid gap-4">
        {filtered.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} detailed />
        ))}
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  readonly label: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly options: readonly { readonly value: string; readonly label: string }[];
}) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-bold text-foreground outline-none transition focus:border-primary focus:ring-[3px] focus:ring-primary/20"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
