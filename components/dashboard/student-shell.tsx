import { DashboardHeader, Sidebar } from "@/components/dashboard/home-dashboard";
import { StudentMobileDrawer } from "@/components/dashboard/student-mobile-drawer";
import type {
  DashboardUser,
  ModuleSummary,
  UserPreferences,
} from "@/lib/home-types";

export function StudentShell({
  children,
  user,
  preferences,
  modules,
  activeHref,
}: {
  readonly children: React.ReactNode;
  readonly user: DashboardUser;
  readonly preferences: UserPreferences;
  readonly modules: readonly ModuleSummary[];
  readonly activeHref: string;
}) {
  const canUpload = Boolean(preferences.university && preferences.academicLevel);

  return (
    <div className="min-h-screen bg-[#fbfbfb] text-foreground" dir="rtl">
      <Sidebar
        user={user}
        modules={modules}
        canUpload={canUpload}
        activeHref={activeHref}
      />
      <div className="lg:pr-72">
        <DashboardHeader user={user} preferences={preferences} />
        <main className="mx-auto max-w-[1440px] space-y-6 px-4 py-6 pb-12 sm:px-6 lg:px-8">
          <StudentMobileDrawer activeHref={activeHref} />
          {children}
        </main>
      </div>
    </div>
  );
}
