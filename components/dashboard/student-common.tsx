import Link from "next/link";
import {
  AlertTriangle,
  Archive,
  Award,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Copy,
  Download,
  Edit3,
  Eye,
  FileText,
  MoreHorizontal,
  RefreshCw,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type {
  AcademicLevel,
  ResourceStatus,
  ResourceSummary,
  SemesterType,
} from "@/lib/home-types";
import {
  levelLabels,
  resourceTypeLabels,
  statusLabels,
} from "@/lib/home-types";
import type { DemoResource } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly action?: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-bold text-primary">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-extrabold leading-tight text-foreground">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
          {description}
        </p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </section>
  );
}

export function SectionCard({
  children,
  className,
}: {
  readonly children: React.ReactNode;
  readonly className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-background p-5 shadow-[0_18px_60px_rgba(17,17,17,0.04)] sm:p-6",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function DashboardStatCard({
  label,
  value,
  detail,
  icon,
}: {
  readonly label: string;
  readonly value: string | number;
  readonly detail: string;
  readonly icon: React.ReactNode;
}) {
  return (
    <SectionCard className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-muted-foreground">{label}</p>
          <p className="mt-3 text-3xl font-extrabold text-foreground">
            {typeof value === "number" ? value.toLocaleString("ar-DZ") : value}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p>
        </div>
        <span className="flex size-11 items-center justify-center rounded-2xl bg-muted text-foreground">
          {icon}
        </span>
      </div>
    </SectionCard>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  readonly title: string;
  readonly description: string;
  readonly action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-background p-10 text-center">
      <div className="mx-auto flex h-20 w-24 items-end justify-center rounded-2xl bg-[#fff8dd]">
        <span className="mb-4 h-8 w-5 rounded-t-lg bg-[#111111]" />
        <span className="mb-4 h-12 w-5 rounded-t-lg bg-primary" />
        <span className="mb-4 h-6 w-5 rounded-t-lg bg-[#111111]" />
      </div>
      <h2 className="mt-5 text-xl font-extrabold text-foreground">{title}</h2>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border bg-background p-5 shadow-[0_18px_60px_rgba(17,17,17,0.04)]">
      <div className="h-4 w-24 rounded-full bg-muted" />
      <div className="mt-4 h-7 w-2/3 rounded-full bg-muted" />
      <div className="mt-3 h-4 w-full rounded-full bg-muted" />
      <div className="mt-2 h-4 w-4/5 rounded-full bg-muted" />
    </div>
  );
}

export function FriendlyError({
  title = "حدث خطأ غير متوقع",
  description = "لم نتمكن من تحميل هذه الصفحة الآن. حاول مرة أخرى بعد لحظات.",
  reset,
}: {
  readonly title?: string;
  readonly description?: string;
  readonly reset?: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#fbfbfb] p-6 text-foreground" dir="rtl">
      <div className="mx-auto flex min-h-[70vh] max-w-xl items-center">
        <SectionCard className="w-full text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-red-50 text-red-700">
            <AlertTriangle className="size-6" aria-hidden="true" />
          </span>
          <h1 className="mt-5 text-2xl font-extrabold">{title}</h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            {description}
          </p>
          {reset ? (
            <Button onClick={reset} className="mt-6 h-11 gap-2 rounded-xl px-5">
              <RefreshCw className="size-4" aria-hidden="true" />
              إعادة المحاولة
            </Button>
          ) : null}
        </SectionCard>
      </div>
    </div>
  );
}

export function ModuleCard({
  module,
}: {
  readonly module: {
    readonly id: string;
    readonly name: string;
    readonly description: string | null;
    readonly level: AcademicLevel;
    readonly semester: SemesterType;
    readonly resources: number;
    readonly lastUpdated: string;
    readonly teacher: string;
    readonly progress: number;
  };
}) {
  return (
    <Link
      href={`/modules/${module.id}`}
      className="block rounded-2xl border border-border bg-background p-5 shadow-[0_18px_60px_rgba(17,17,17,0.04)] transition hover:-translate-y-0.5 hover:border-input"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-muted text-foreground">
          <Archive className="size-5" aria-hidden="true" />
        </span>
        <span className="rounded-full bg-[#fff8dd] px-3 py-1 text-xs font-extrabold text-foreground">
          {levelLabels[module.level]} · {module.semester}
        </span>
      </div>
      <h2 className="mt-5 text-lg font-extrabold text-foreground">{module.name}</h2>
      <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-muted-foreground">
        {module.description ?? "وصف المقرر قيد الإعداد."}
      </p>
      <dl className="mt-5 grid gap-3 text-sm text-muted-foreground">
        <div className="flex items-center justify-between gap-3">
          <dt>عدد الموارد</dt>
          <dd className="font-extrabold text-foreground">{module.resources}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt>الأستاذ</dt>
          <dd className="truncate font-bold text-foreground">{module.teacher}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt>آخر تحديث</dt>
          <dd>{new Date(module.lastUpdated).toLocaleDateString("ar-DZ")}</dd>
        </div>
      </dl>
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs font-bold text-muted-foreground">
          <span>التقدم</span>
          <span>{module.progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${module.progress}%` }}
          />
        </div>
      </div>
    </Link>
  );
}

export function ResourceCard({
  resource,
  detailed = false,
}: {
  readonly resource: ResourceSummary | DemoResource;
  readonly detailed?: boolean;
}) {
  const downloads = "downloads" in resource ? resource.downloads : 24;
  const views = "views" in resource ? resource.views : 128;

  return (
    <article className="rounded-2xl border border-border bg-background p-5 shadow-[0_18px_60px_rgba(17,17,17,0.04)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill status={resource.status} />
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-extrabold">
              {resourceTypeLabels[resource.resourceType]}
            </span>
          </div>
          <h2 className="mt-4 text-lg font-extrabold text-foreground">
            {resource.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {resource.moduleName} · {levelLabels[resource.moduleLevel]} ·{" "}
            {resource.moduleSemester}
          </p>
          {detailed ? (
            <div className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-4">
              <Metric icon={<Download className="size-4" />} label={`${downloads} تحميل`} />
              <Metric icon={<Eye className="size-4" />} label={`${views} مشاهدة`} />
              <Metric icon={<CalendarDays className="size-4" />} label={new Date(resource.createdAt).toLocaleDateString("ar-DZ")} />
              <Metric icon={<FileText className="size-4" />} label={resource.authorName} />
            </div>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="h-10 rounded-xl px-4">
            <Link href={resource.driveUrl} target="_blank" rel="noreferrer">
              عرض
            </Link>
          </Button>
          <Button variant="ghost" className="h-10 rounded-xl px-3">
            <MoreHorizontal className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </article>
  );
}

export function MyFileActions() {
  const actions = [
    { label: "عرض", icon: Eye },
    { label: "تعديل", icon: Edit3 },
    { label: "حذف", icon: Trash2 },
    { label: "نسخ", icon: Copy },
  ] as const;

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <Button
          key={action.label}
          variant="outline"
          className="h-9 gap-2 rounded-xl px-3"
        >
          <action.icon className="size-4" aria-hidden="true" />
          {action.label}
        </Button>
      ))}
    </div>
  );
}

export function AchievementBadge({ label }: { readonly label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm font-extrabold shadow-[0_18px_60px_rgba(17,17,17,0.04)]">
      <Award className="size-4 text-primary" aria-hidden="true" />
      {label}
    </span>
  );
}

export function ContributionChart() {
  return (
    <div className="grid grid-cols-[repeat(14,minmax(0,1fr))] gap-1">
      {Array.from({ length: 98 }, (_, index) => (
        <span
          key={index}
          className={cn(
            "aspect-square rounded-[4px]",
            index % 7 === 0
              ? "bg-primary"
              : index % 5 === 0
                ? "bg-[#111111]"
                : index % 3 === 0
                  ? "bg-[#ffe89a]"
                  : "bg-muted",
          )}
        />
      ))}
    </div>
  );
}

function StatusPill({ status }: { readonly status: ResourceStatus }) {
  const classes: Record<ResourceStatus, string> = {
    approved: "bg-emerald-50 text-emerald-900",
    pending: "bg-amber-50 text-amber-900",
    rejected: "bg-red-50 text-red-900",
    archived: "bg-muted text-muted-foreground",
  };
  const Icon = status === "approved" ? CheckCircle2 : Clock3;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold",
        classes[status],
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {statusLabels[status]}
    </span>
  );
}

function Metric({
  icon,
  label,
}: {
  readonly icon: React.ReactNode;
  readonly label: string;
}) {
  return (
    <span className="inline-flex min-w-0 items-center gap-2 rounded-xl bg-muted px-3 py-2 font-semibold">
      {icon}
      <span className="truncate">{label}</span>
    </span>
  );
}
