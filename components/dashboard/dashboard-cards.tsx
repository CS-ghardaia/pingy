import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  ShieldAlert,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
  ResourceStatus,
  ResourceSummary,
  ResourceType,
} from "@/lib/home-types";
import { resourceTypeLabels, statusLabels } from "@/lib/home-types";
import { cn } from "@/lib/utils";

export function DashboardCard({
  children,
  className,
}: {
  readonly children: React.ReactNode;
  readonly className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border border-border bg-background p-5 shadow-sm",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function StatCard({
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
    <DashboardCard>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-muted-foreground">{label}</p>
          <p className="mt-3 text-3xl font-extrabold text-foreground">
            {value}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {detail}
          </p>
        </div>
        <div className="flex size-11 items-center justify-center rounded-lg bg-accent text-foreground">
          {icon}
        </div>
      </div>
    </DashboardCard>
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
    <div className="rounded-xl border border-dashed border-border bg-muted/40 p-8 text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-background text-muted-foreground">
        <BookOpen className="size-6" aria-hidden="true" />
      </div>
      <h2 className="mt-5 text-xl font-extrabold text-foreground">{title}</h2>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function StatusBadge({ status }: { readonly status: ResourceStatus }) {
  const classes: Record<ResourceStatus, string> = {
    approved: "border-emerald-200 bg-emerald-50 text-emerald-900",
    pending: "border-amber-200 bg-amber-50 text-amber-900",
    rejected: "border-red-200 bg-red-50 text-red-900",
    archived: "border-border bg-muted text-muted-foreground",
  };

  const Icon =
    status === "approved"
      ? CheckCircle2
      : status === "pending"
        ? Clock3
        : ShieldAlert;

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold",
        classes[status],
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {statusLabels[status]}
    </span>
  );
}

export function TypeBadge({ type }: { readonly type: ResourceType }) {
  return <Badge>{resourceTypeLabels[type]}</Badge>;
}

export function ResourceCard({
  resource,
  showStatus = false,
}: {
  readonly resource: ResourceSummary;
  readonly showStatus?: boolean;
}) {
  return (
    <article className="rounded-xl border border-border bg-background p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <TypeBadge type={resource.resourceType} />
            {showStatus ? <StatusBadge status={resource.status} /> : null}
          </div>
          <h2 className="mt-4 text-xl font-extrabold leading-snug text-foreground">
            {resource.title}
          </h2>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
            {resource.description || "لا يوجد وصف لهذا الملف بعد."}
          </p>
          <dl className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <FileText className="size-4" aria-hidden="true" />
              <dt className="sr-only">المقرر</dt>
              <dd>{resource.moduleName}</dd>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="size-4" aria-hidden="true" />
              <dt className="sr-only">التاريخ</dt>
              <dd>{new Date(resource.createdAt).toLocaleDateString("ar-DZ")}</dd>
            </div>
          </dl>
        </div>
        <Button asChild variant="outline" className="h-10 gap-2 px-4">
          <Link href={`/home/resources/${resource.id}`}>
            التفاصيل
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </article>
  );
}
