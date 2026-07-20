import type { Metadata } from "next";

import {
  EmptyState,
  MyFileActions,
  PageHeader,
  ResourceCard,
  SectionCard,
} from "@/components/dashboard/student-common";
import { StudentShell } from "@/components/dashboard/student-shell";
import { Button } from "@/components/ui/button";
import { getDashboardContext, getModules, getMyResources } from "@/lib/dashboard-data";
import { demoResources } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "ملفاتي | Pingy",
};

export default async function MyFilesPage() {
  const { user, preferences } = await getDashboardContext();
  const [modules, resources] = await Promise.all([
    getModules(),
    getMyResources(user.id),
  ]);
  const files =
    resources.length > 0
      ? resources.map((resource, index) => ({
          ...resource,
          downloads: 60 - index * 4,
          views: 240 - index * 10,
        }))
      : demoResources.slice(0, 8);

  return (
    <StudentShell
      user={user}
      preferences={preferences}
      modules={modules}
      activeHref="/my-files"
    >
      <PageHeader
        eyebrow="ملفاتي"
        title="إدارة مساهماتك من مكان واحد"
        description="تابع حالة القبول والمشاهدات والتحميلات، وجهز التعديلات المستقبلية دون تغيير منطق الرفع الحالي."
      />
      {files.length > 0 ? (
        <div className="grid gap-4">
          {files.map((resource) => (
            <SectionCard key={resource.id}>
              <ResourceCard resource={resource} detailed />
              <div className="mt-4 border-t border-border pt-4">
                <MyFileActions />
              </div>
            </SectionCard>
          ))}
        </div>
      ) : (
        <EmptyState
          title="لا توجد ملفات بعد"
          description="ابدأ بمشاركة أول ملف مع زملائك في جامعة غرداية."
          action={<Button className="h-10 rounded-xl px-4">رفع ملف</Button>}
        />
      )}
    </StudentShell>
  );
}
