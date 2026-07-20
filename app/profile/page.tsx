import { Award, Star } from "lucide-react";

import { StudentLayoutShell } from "@/components/layout/student-nav";
import { ResourceCard } from "@/components/resource/resource-card";
import { EmptyState, PageHeader } from "@/components/student/states";
import { getProfileData, getStudentContext } from "@/lib/student/queries";

export default async function ProfilePage() {
  const { user, preference } = await getStudentContext();
  const profile = await getProfileData(user.id);

  return (
    <StudentLayoutShell user={user} preference={preference} activePath="/profile">
      <PageHeader
        title="ملفي"
        description="مواردك، مفضلتك، شاراتك، وسجل السمعة الخاص بك."
        action={
          <div className="rounded-lg border border-border bg-secondary px-5 py-3 font-bold text-primary">
            <Star className="ml-1 inline size-4 fill-primary" aria-hidden="true" />
            {user.reputationScore.toLocaleString("ar-DZ")}
          </div>
        }
      />
      <Section title="المرفوعة">
        {profile.uploaded.length === 0 ? (
          <EmptyState title="لم ترفع موارد بعد" description="ارفع أول مورد وسيظهر هنا بحالته الحالية." />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {profile.uploaded.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} showStatus />
            ))}
          </div>
        )}
      </Section>
      <Section title="المفضلة">
        {profile.favorites.length === 0 ? (
          <EmptyState title="لا توجد مفضلة" description="أضف الموارد المهمة إلى مفضلتك للعودة إليها بسرعة." />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {profile.favorites.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}
      </Section>
      <Section title="الشارات">
        {profile.badges.length === 0 ? (
          <EmptyState title="لا توجد شارات بعد" description="ستظهر الشارات عند فتح إنجازات جديدة." />
        ) : (
          <div className="flex flex-wrap gap-3">
            {profile.badges.map((badge) => (
              <span key={badge.id} className="inline-flex size-16 items-center justify-center rounded-full bg-accent text-primary" title={badge.description ?? badge.nameAr}>
                <Award className="size-8" aria-hidden="true" />
              </span>
            ))}
          </div>
        )}
      </Section>
      <Section title="سجل السمعة">
        {profile.events.length === 0 ? (
          <EmptyState title="لا يوجد سجل" description="ستظهر تغييرات السمعة هنا." />
        ) : (
          <div className="card-surface divide-y divide-border">
            {profile.events.map((event) => (
              <div key={event.id} className="flex items-center justify-between gap-4 p-4">
                <span className="font-bold">{event.eventType}</span>
                <span className="font-extrabold text-primary">{event.points}</span>
              </div>
            ))}
          </div>
        )}
      </Section>
    </StudentLayoutShell>
  );
}

function Section({
  title,
  children,
}: {
  readonly title: string;
  readonly children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-extrabold">{title}</h2>
      {children}
    </section>
  );
}
