import Link from "next/link";
import { Download, Eye, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { ResourceSummary } from "@/lib/student/types";
import { cn } from "@/lib/utils";

export function StatusChip({ status }: { readonly status: ResourceSummary["status"] }) {
  const classes = {
    approved:
      "bg-[color:var(--success-container)] text-[color:var(--on-success-container)]",
    pending:
      "bg-[color:var(--warning-container)] text-[color:var(--on-warning-container)]",
    rejected: "bg-[color:var(--error-container)] text-[color:var(--on-error-container)]",
    archived: "bg-[color:var(--surface-container-high)] text-[color:var(--neutral-400)]",
  } satisfies Record<ResourceSummary["status"], string>;

  const labels = {
    approved: "معتمد",
    pending: "قيد المراجعة",
    rejected: "مرفوض",
    archived: "مؤرشف",
  } satisfies Record<ResourceSummary["status"], string>;

  return (
    <span className={cn("rounded-full px-3 py-1 text-xs font-bold", classes[status])}>
      {labels[status]}
    </span>
  );
}

export function ResourceCard({
  resource,
  featured = false,
  showStatus = false,
}: {
  readonly resource: ResourceSummary;
  readonly featured?: boolean;
  readonly showStatus?: boolean;
}) {
  return (
    <article
      className={cn(
        "card-surface card-hover p-6",
        featured && "border-t-[3px] border-t-primary",
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        {featured ? <Badge>مثبت</Badge> : null}
        <Badge variant="outline">{resource.resourceTypeName}</Badge>
        {showStatus ? <StatusChip status={resource.status} /> : null}
      </div>
      <h2 className="mt-4 text-xl font-extrabold leading-snug">
        <Link href={`/resources/${resource.id}`} className="hover:underline">
          {resource.title}
        </Link>
      </h2>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
        {resource.description ?? "لا يوجد وصف لهذا المورد بعد."}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm font-bold text-muted-foreground">
        <span>{resource.moduleName}</span>
        <span className="flex items-center gap-1">
          <Eye className="size-4" aria-hidden="true" />
          {resource.views.toLocaleString("ar-DZ")}
        </span>
        <span className="flex items-center gap-1">
          <Download className="size-4" aria-hidden="true" />
          {resource.downloads.toLocaleString("ar-DZ")}
        </span>
        <span className="flex items-center gap-1">
          <Star className="size-4 fill-primary text-primary" aria-hidden="true" />
          {resource.averageRating.toLocaleString("ar-DZ")}
        </span>
      </div>
    </article>
  );
}
