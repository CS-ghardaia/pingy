import Link from "next/link";

import { StudentLayoutShell } from "@/components/layout/student-nav";
import { EmptyState, PageHeader } from "@/components/student/states";
import { getModulesForLevel, getStudentContext } from "@/lib/student/queries";

export default async function ModulesPage() {
  const { user, preference } = await getStudentContext();
  const modules = await getModulesForLevel(preference.academicLevel);
  const semesters = Array.from(new Set(modules.map((module) => module.semester)));

  return (
    <StudentLayoutShell user={user} preference={preference} activePath="/modules">
      <PageHeader
        title="تصفح الوحدات"
        description="الوحدات مرتبة حسب السداسي ومفلترة تلقائياً حسب مستواك الدراسي."
      />
      {modules.length === 0 ? (
        <EmptyState title="لا توجد وحدات" description="أكمل الإعداد الأولي أو انتظر إضافة وحدات لهذا المستوى." />
      ) : (
        <div className="space-y-8">
          {semesters.map((semester) => (
            <section key={semester}>
              <h2 className="mb-4 text-2xl font-extrabold">{semester}</h2>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {modules
                  .filter((module) => module.semester === semester)
                  .map((module) => (
                    <Link key={module.id} href={`/modules/${module.id}`} className="card-surface card-hover p-6">
                      <h3 className="text-xl font-extrabold">{module.name}</h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                        {module.description ?? "لا يوجد وصف لهذه الوحدة بعد."}
                      </p>
                      <p className="mt-4 text-sm font-bold text-muted-foreground">
                        {module.resourceCount.toLocaleString("ar-DZ")} مورد
                      </p>
                    </Link>
                  ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </StudentLayoutShell>
  );
}
