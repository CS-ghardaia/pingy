import Link from "next/link";
import { Star } from "lucide-react";

import { StudentLayoutShell } from "@/components/layout/student-nav";
import { ResourceCard } from "@/components/resource/resource-card";
import { EmptyState, PageHeader } from "@/components/student/states";
import {
  getApprovedResources,
  getModulesForLevel,
  getStudentContext,
} from "@/lib/student/queries";

export default async function HomePage() {
  const { user, preference } = await getStudentContext();
  const [modules, featured, latest] = await Promise.all([
    getModulesForLevel(preference.academicLevel),
    getApprovedResources({ featured: true, limit: 3 }),
    getApprovedResources({ limit: 6 }),
  ]);

  return (
    <StudentLayoutShell user={user} preference={preference} activePath="/home">
      <PageHeader
        title={`مرحباً ${user.fullName}`}
        description="مساحتك السريعة للوحدات المناسبة لمستواك، الموارد المميزة، وآخر ما أضافه المجتمع."
        action={
          <div className="rounded-full bg-secondary px-4 py-2 text-sm font-bold text-primary">
            <Star className="ml-1 inline size-4 fill-primary" aria-hidden="true" />
            {user.reputationScore.toLocaleString("ar-DZ")} نقطة
          </div>
        }
      />
      <section>
        <h2 className="mb-4 text-2xl font-extrabold">الوحدات الخاصة بمستواي</h2>
        {modules.length === 0 ? (
          <EmptyState title="لا توجد وحدات" description="لم يتم نشر وحدات لهذا المستوى بعد." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {modules.map((module) => (
              <Link key={module.id} href={`/modules/${module.id}`} className="card-surface card-hover p-6">
                <p className="text-sm font-bold text-primary">{module.semester}</p>
                <h3 className="mt-2 text-xl font-extrabold">{module.name}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                  {module.description ?? "وحدة دراسية جاهزة للموارد."}
                </p>
                <p className="mt-4 text-sm font-bold text-muted-foreground">
                  {module.resourceCount.toLocaleString("ar-DZ")} مورد
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
      <section>
        <h2 className="mb-4 text-2xl font-extrabold">موارد مميزة</h2>
        {featured.length === 0 ? (
          <EmptyState title="لا توجد موارد مميزة" description="ستظهر هنا الموارد المثبتة بعد اعتمادها." />
        ) : (
          <div className="grid gap-4 lg:grid-cols-3">
            {featured.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} featured />
            ))}
          </div>
        )}
      </section>
      <section>
        <h2 className="mb-4 text-2xl font-extrabold">الأحدث</h2>
        {latest.length === 0 ? (
          <EmptyState title="لا توجد موارد" description="لم تُنشر موارد معتمدة بعد." />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {latest.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}
      </section>
    </StudentLayoutShell>
  );
}
