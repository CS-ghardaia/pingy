import { notFound } from "next/navigation";
import { Award } from "lucide-react";

import { StudentLayoutShell } from "@/components/layout/student-nav";
import { ResourceCard } from "@/components/resource/resource-card";
import { EmptyState, PageHeader } from "@/components/student/states";
import { getPublicProfile, getStudentContext } from "@/lib/student/queries";

export default async function PublicProfilePage({
  params,
}: {
  readonly params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const { user, preference } = await getStudentContext();
  const profile = await getPublicProfile(username);

  if (!profile) {
    notFound();
  }

  return (
    <StudentLayoutShell user={user} preference={preference} activePath="/profile">
      <PageHeader
        title={profile.user.fullName}
        description={`سمعة: ${profile.user.reputationScore.toLocaleString("ar-DZ")} نقطة`}
      />
      <section className="card-surface p-6">
        <h2 className="text-xl font-extrabold">الشارات</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {profile.badges.map((badge) => (
            <span key={badge.id} className="inline-flex size-16 items-center justify-center rounded-full bg-accent text-primary">
              <Award className="size-8" aria-hidden="true" />
            </span>
          ))}
        </div>
      </section>
      <section>
        <h2 className="mb-4 text-2xl font-extrabold">الموارد المعتمدة</h2>
        {profile.resources.length === 0 ? (
          <EmptyState title="لا توجد موارد عامة" description="لا توجد موارد معتمدة لهذا الطالب بعد." />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {profile.resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}
      </section>
    </StudentLayoutShell>
  );
}
