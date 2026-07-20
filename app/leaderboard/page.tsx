import { Trophy } from "lucide-react";

import { StudentLayoutShell } from "@/components/layout/student-nav";
import { EmptyState, PageHeader } from "@/components/student/states";
import { getLeaderboard, getStudentContext } from "@/lib/student/queries";
import { cn } from "@/lib/utils";

export default async function LeaderboardPage() {
  const { user, preference } = await getStudentContext();
  const leaders = await getLeaderboard();

  return (
    <StudentLayoutShell user={user} preference={preference} activePath="/leaderboard">
      <PageHeader title="لوحة الصدارة" description="ترتيب الطلاب حسب نقاط السمعة." />
      {leaders.length === 0 ? (
        <EmptyState title="لا يوجد ترتيب" description="سيظهر الطلاب هنا عند توفر نقاط السمعة." />
      ) : (
        <section className="card-surface divide-y divide-border p-2">
          {leaders.map((leader, index) => (
            <div
              key={leader.id}
              className={cn(
                "flex items-center gap-4 rounded-lg p-4",
                index < 3 && "bg-accent",
              )}
            >
              <span className={cn("text-2xl font-extrabold", index < 3 && "text-primary")}>
                {index + 1}
              </span>
              <span className="flex size-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                <Trophy className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{leader.full_name}</p>
                <p className="text-sm text-muted-foreground">@{leader.username ?? "student"}</p>
              </div>
              <span className="font-extrabold text-primary">
                {leader.reputation_score.toLocaleString("ar-DZ")}
              </span>
            </div>
          ))}
        </section>
      )}
    </StudentLayoutShell>
  );
}
