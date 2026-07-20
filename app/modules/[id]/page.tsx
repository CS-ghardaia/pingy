import { notFound } from "next/navigation";

import { StudentLayoutShell } from "@/components/layout/student-nav";
import { ResourceCard } from "@/components/resource/resource-card";
import { EmptyState, PageHeader } from "@/components/student/states";
import {
  getModuleById,
  getModuleResources,
  getResourceTypes,
  getStudentContext,
} from "@/lib/student/queries";

export default async function ModuleDetailPage({
  params,
  searchParams,
}: {
  readonly params: Promise<{ id: string }>;
  readonly searchParams: Promise<{ type?: string }>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const { user, preference } = await getStudentContext();
  const [module, resources, resourceTypes] = await Promise.all([
    getModuleById(id),
    getModuleResources(id, user.id),
    getResourceTypes(),
  ]);

  if (!module) {
    notFound();
  }

  const activeType = query.type ?? resourceTypes[0]?.code;
  const visibleResources = activeType
    ? resources.filter((resource) => resource.resourceType === activeType)
    : resources;

  return (
    <StudentLayoutShell user={user} preference={preference} activePath="/modules">
      <PageHeader title={module.name} description={module.description ?? "موارد الوحدة حسب النوع."} />
      <nav className="flex gap-2 overflow-x-auto pb-2" aria-label="أنواع الموارد">
        {resourceTypes.map((type) => (
          <a
            key={type.code}
            href={`/modules/${module.id}?type=${type.code}`}
            className={
              activeType === type.code
                ? "min-h-11 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
                : "min-h-11 rounded-full bg-muted px-5 py-3 text-sm font-bold text-muted-foreground"
            }
          >
            {type.nameAr}
          </a>
        ))}
      </nav>
      {visibleResources.length === 0 ? (
        <EmptyState title="لا توجد موارد" description="لا توجد موارد من هذا النوع في الوحدة حالياً." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {visibleResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              showStatus={resource.uploadedBy === user.id && resource.status === "pending"}
            />
          ))}
        </div>
      )}
    </StudentLayoutShell>
  );
}
