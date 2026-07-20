import Link from "next/link";
import {
  Bell,
  BookOpen,
  Home,
  Search,
  Trophy,
  UploadCloud,
  UserRound,
} from "lucide-react";

import { logoutAction } from "@/lib/student/actions";
import type { StudentPreference, StudentUser } from "@/lib/student/types";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/home", label: "الرئيسية", icon: Home },
  { href: "/modules", label: "تصفح", icon: BookOpen },
  { href: "/search", label: "بحث", icon: Search },
  { href: "/notifications", label: "إشعارات", icon: Bell },
  { href: "/profile", label: "ملفي", icon: UserRound },
] as const;

export function StudentLayoutShell({
  children,
  user,
  preference,
  activePath,
}: {
  readonly children: React.ReactNode;
  readonly user: StudentUser;
  readonly preference: StudentPreference;
  readonly activePath: string;
}) {
  return (
    <div className="min-h-screen bg-(--surface-container-low)">
      <Sidebar activePath={activePath} />
      <div className="lg:pr-70">
        <TopNav user={user} preference={preference} />
        <main className="mx-auto max-w-7xl space-y-8 px-4 py-6 pb-24 sm:px-6 lg:px-12">
          {children}
        </main>
      </div>
      <BottomTabBar activePath={activePath} />
    </div>
  );
}

function Sidebar({ activePath }: { readonly activePath: string }) {
  return (
    <aside className="fixed inset-y-0 right-0 z-30 hidden w-[280px] border-l border-border bg-background p-6 lg:block">
      <Link href="/home" className="text-2xl font-extrabold text-foreground">
        Pingy
      </Link>
      <nav className="mt-8 space-y-2" aria-label="تنقل الطالب">
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} activePath={activePath} />
        ))}
      </nav>
      <div className="mt-8 border-t border-border pt-5">
        <Link
          href="/upload"
          className="flex min-h-11 items-center gap-3 rounded-lg bg-primary px-4 py-3 font-bold text-primary-foreground"
        >
          <UploadCloud className="size-5" aria-hidden="true" />
          رفع مورد
        </Link>
        <Link
          href="/leaderboard"
          className="mt-2 flex min-h-11 items-center gap-3 rounded-lg px-4 py-3 font-bold text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Trophy className="size-5" aria-hidden="true" />
          لوحة الصدارة
        </Link>
      </div>
    </aside>
  );
}

function NavLink({
  item,
  activePath,
}: {
  readonly item: (typeof navItems)[number];
  readonly activePath: string;
}) {
  const active =
    item.href === "/home" ? activePath === item.href : activePath.startsWith(item.href);

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex min-h-11 items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition",
        active
          ? "bg-accent text-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <item.icon className="size-5" aria-hidden="true" />
      {item.label}
      {active ? <span className="absolute left-0 h-7 w-[3px] rounded-full bg-primary" /> : null}
    </Link>
  );
}

function TopNav({
  user,
  preference,
}: {
  readonly user: StudentUser;
  readonly preference: StudentPreference;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background px-4 sm:px-6 lg:px-12">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-4">
        <Link href="/home" className="text-xl font-extrabold lg:hidden">
          Pingy
        </Link>
        <form action="/search" className="relative mr-auto hidden w-80 md:block">
          <Search className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <label htmlFor="top-search" className="sr-only">
            بحث
          </label>
          <input
            id="top-search"
            name="q"
            className="h-11 w-full rounded-lg border border-input bg-muted pr-11 text-sm focus:border-primary focus:bg-background focus:ring-[3px] focus:ring-primary/20"
            placeholder="ابحث عن مورد..."
          />
        </form>
        <div className="mr-auto flex items-center gap-3">
          <div className="hidden text-left text-sm sm:block">
            <p className="font-extrabold">{user.fullName}</p>
            <p className="text-muted-foreground">
              {preference.universityName ?? "طالب"} · {preference.academicLevel ?? ""}
            </p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="min-h-11 rounded-lg px-3 py-2 text-sm font-bold hover:bg-muted"
            >
              خروج
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}

function BottomTabBar({ activePath }: { readonly activePath: string }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid h-16 grid-cols-5 border-t border-border bg-background pb-[env(safe-area-inset-bottom)] lg:hidden">
      {navItems.map((item) => {
        const active =
          item.href === "/home" ? activePath === item.href : activePath.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-11 flex-col items-center justify-center gap-1 text-[11px] font-bold",
              active ? "text-primary" : "text-muted-foreground",
            )}
          >
            <item.icon className="size-5" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
