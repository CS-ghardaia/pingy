import Link from "next/link";
import {
  GraduationCap,
  LogOut,
  Plus,
} from "lucide-react";

import { logout } from "@/app/auth/actions";
import {
  DesktopDashboardNavigation,
  MobileDashboardNavigation,
} from "@/components/dashboard/home-navigation";
import { UploadResourceDialog } from "@/components/dashboard/upload-resource-dialog";
import type {
  DashboardUser,
  ModuleSummary,
  UserPreferences,
} from "@/lib/home-types";
import { levelLabels } from "@/lib/home-types";

type DashboardShellProps = {
  readonly children: React.ReactNode;
  readonly user: DashboardUser;
  readonly preferences: UserPreferences;
  readonly modules: readonly ModuleSummary[];
  readonly canUpload: boolean;
};

function Avatar({ user }: { readonly user: DashboardUser }) {
  const initials = user.fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className="flex size-11 items-center justify-center rounded-full border border-border bg-accent bg-cover bg-center text-sm font-extrabold text-foreground"
      style={
        user.avatarUrl
          ? { backgroundImage: `url("${user.avatarUrl}")` }
          : undefined
      }
      aria-label={`صورة ${user.fullName}`}
      role="img"
    >
      {user.avatarUrl ? (
        <span className="sr-only">{initials || "P"}</span>
      ) : (
        initials || "P"
      )}
    </div>
  );
}

export function DashboardShell({
  children,
  user,
  preferences,
  modules,
  canUpload,
}: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-muted/35">
      <aside className="fixed right-0 top-0 z-30 hidden h-screen w-72 border-l border-border bg-background p-5 lg:block">
        <Link
          href="/home"
          className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/50 px-3 py-3 text-xl font-extrabold text-foreground"
        >
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="size-5" aria-hidden="true" />
          </span>
          Pinggly
        </Link>

        <DesktopDashboardNavigation />

        {canUpload ? (
          <UploadResourceDialog
            user={user}
            modules={modules}
            triggerClassName="mt-6 h-11 w-full gap-2"
          />
        ) : (
          <Link
            href="/home/profile"
            className="mt-6 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-border bg-muted px-4 text-sm font-bold text-foreground transition hover:bg-accent"
          >
            <Plus className="size-4" aria-hidden="true" />
            أكمل الملف للرفع
          </Link>
        )}

        <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-border bg-muted/70 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Avatar user={user} />
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold text-foreground">
                {user.fullName}
              </p>
              <p className="truncate text-xs font-semibold text-muted-foreground">
                {preferences.academicLevel
                  ? levelLabels[preferences.academicLevel]
                  : "الملف غير مكتمل"}
              </p>
            </div>
          </div>
          <form action={logout} className="mt-4">
            <button
              type="submit"
              className="flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-bold text-foreground transition hover:bg-muted"
            >
              <LogOut className="size-4" aria-hidden="true" />
              تسجيل الخروج
            </button>
          </form>
        </div>
      </aside>

      <div className="lg:pr-72">
        <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
          <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <Avatar user={user} />
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold text-foreground">
                  {user.fullName}
                </p>
                <p className="truncate text-xs font-semibold text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </div>
            {canUpload ? (
              <UploadResourceDialog
                user={user}
                modules={modules}
                triggerLabel="رفع ملف"
                triggerClassName="hidden h-10 gap-2 px-4 sm:inline-flex"
              />
            ) : null}
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 pb-24 sm:px-6 lg:px-8">
          {children}
        </main>

        <MobileDashboardNavigation />
      </div>
    </div>
  );
}
