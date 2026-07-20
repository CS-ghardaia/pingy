import Link from "next/link";
import {
  Bell,
  BookOpenCheck,
  ChevronLeft,
  CircleHelp,
  Compass,
  Download,
  FileArchive,
  FileCheck2,
  FileText,
  FolderOpen,
  GraduationCap,
  LayoutDashboard,
  Megaphone,
  Plus,
  Search,
  Settings,
  Sparkles,
  TrendingUp,
  UploadCloud,
  UserRound,
} from "lucide-react";

import { UploadResourceDialog } from "@/components/dashboard/upload-resource-dialog";
import { Button } from "@/components/ui/button";
import { StudentMobileDrawer } from "@/components/dashboard/student-mobile-drawer";
import type {
  DashboardUser,
  ModuleSummary,
  ResourceSummary,
  ResourceType,
  UserPreferences,
} from "@/lib/home-types";
import { levelLabels, resourceTypeLabels } from "@/lib/home-types";
import { cn } from "@/lib/utils";

import { SearchBar } from "./home-search-bar";

export type DashboardStats = {
  readonly myFiles: number;
  readonly pending: number;
  readonly downloads: number;
  readonly views: number;
};

const sidebarLinks = [
  { href: "/home", label: "نظرة عامة", icon: LayoutDashboard },
  { href: "/modules", label: "المقرر السنوي", icon: BookOpenCheck },
  { href: "/explore", label: "استكشف", icon: Compass },
  { href: "/my-files", label: "ملفاتي", icon: FolderOpen },
  { href: "/profile", label: "ملفي الشخصي", icon: UserRound },
  { href: "/notifications", label: "الإشعارات", icon: Bell },
  { href: "/settings", label: "الإعدادات", icon: Settings },
] as const;

const quickActions = [
  {
    href: "#upload",
    label: "رفع ملف جديد",
    description: "شارك رابط Google Drive لمورد مفيد.",
    icon: UploadCloud,
  },
  {
    href: "/explore",
    label: "استكشف الملفات",
    description: "تصفح أحدث الموارد المقبولة.",
    icon: Compass,
  },
  {
    href: "/modules",
    label: "المقرر السنوي",
    description: "راجع المواد حسب المستوى والسداسي.",
    icon: BookOpenCheck,
  },
] as const;

function Card({
  children,
  className,
}: {
  readonly children: React.ReactNode;
  readonly className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-background shadow-[0_18px_60px_rgba(17,17,17,0.04)]",
        className,
      )}
    >
      {children}
    </section>
  );
}

function Avatar({ user }: { readonly user: DashboardUser }) {
  const initials = user.fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return (
    <div
      className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-border bg-muted bg-cover bg-center text-sm font-extrabold text-foreground"
      style={
        user.avatarUrl ? { backgroundImage: `url("${user.avatarUrl}")` } : undefined
      }
      role="img"
      aria-label={`صورة ${user.fullName}`}
    >
      {user.avatarUrl ? <span className="sr-only">{initials}</span> : initials || "P"}
    </div>
  );
}

function ResourceIcon({ type }: { readonly type: ResourceType }) {
  const Icon =
    type === "exam"
      ? FileCheck2
      : type === "summary"
        ? FileArchive
        : type === "project"
          ? Sparkles
          : FileText;

  return (
    <span className="flex size-10 items-center justify-center rounded-xl bg-muted text-foreground">
      <Icon className="size-4" aria-hidden="true" />
    </span>
  );
}

export function Sidebar({
  user,
  modules,
  canUpload,
  activeHref = "/home",
}: {
  readonly user: DashboardUser;
  readonly modules: readonly ModuleSummary[];
  readonly canUpload: boolean;
  readonly activeHref?: string;
}) {
  return (
    <aside className="fixed right-0 top-0 z-30 hidden h-screen w-72 border-l border-border bg-background p-5 lg:flex lg:flex-col">
      <Link
        href="/home"
        className="flex h-12 items-center gap-3 rounded-2xl border border-border px-3 text-lg font-extrabold"
      >
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <GraduationCap className="size-5" aria-hidden="true" />
        </span>
        Pingy
      </Link>

      <nav className="mt-7 space-y-1.5" aria-label="تنقل لوحة الطالب">
        {sidebarLinks.map((item) => (
          <Link
            key={`${item.href}-${item.label}`}
            href={item.href}
            aria-current={item.href === activeHref ? "page" : undefined}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-bold transition",
              item.href === activeHref
                ? "bg-[#111111] text-white"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <item.icon className="size-4" aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        ))}
        {canUpload ? (
          <UploadResourceDialog
            user={user}
            modules={modules}
            triggerLabel="رفع ملف"
            triggerClassName="mt-2 h-11 w-full justify-start gap-3 rounded-xl bg-primary px-3 font-bold text-[#111111]"
          />
        ) : (
          <Button asChild className="mt-2 h-11 w-full justify-start gap-3 rounded-xl px-3">
            <Link href="/profile">
              <Plus className="size-4" aria-hidden="true" />
              رفع ملف
            </Link>
          </Button>
        )}
      </nav>

      <div className="mt-auto rounded-2xl border border-border bg-[#fffaf0] p-4">
        <div className="mb-4 flex h-20 items-end justify-center rounded-2xl bg-background">
          <div className="flex items-end gap-1.5">
            <span className="h-7 w-5 rounded-t-lg bg-[#111111]" />
            <span className="h-12 w-5 rounded-t-lg bg-primary" />
            <span className="h-9 w-5 rounded-t-lg bg-[#111111]" />
          </div>
        </div>
        <h2 className="text-base font-extrabold text-foreground">
          مجتمع Pingy يعتمد عليك
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          شارك ملفاتك ليستفيد منها زملاؤك.
        </p>
        {canUpload ? (
          <UploadResourceDialog
            user={user}
            modules={modules}
            triggerLabel="رفع ملف"
            triggerClassName="mt-4 h-10 w-full rounded-xl font-bold"
          />
        ) : (
          <Button asChild className="mt-4 h-10 w-full rounded-xl font-bold">
            <Link href="/profile">رفع ملف</Link>
          </Button>
        )}
      </div>
    </aside>
  );
}

export function DashboardHeader({
  user,
  preferences,
}: {
  readonly user: DashboardUser;
  readonly preferences: UserPreferences;
}) {
  const level = preferences.academicLevel
    ? levelLabels[preferences.academicLevel]
    : "مستوى غير مكتمل";

  return (
    <header className="flex flex-col gap-6 border-b border-border bg-background px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-4">
          <Avatar user={user} />
          <div className="min-w-0">
            <p className="text-sm font-bold text-muted-foreground">
              {level} · {preferences.university ?? "جامعة غرداية"}
            </p>
            <h1 className="mt-1 text-2xl font-extrabold leading-tight text-foreground sm:text-3xl">
              صباح الخير، {user.fullName}
            </h1>
          </div>
        </div>
        <SearchBar />
      </div>
    </header>
  );
}

export function ProfileCompletionCard({
  complete,
}: {
  readonly complete: boolean;
}) {
  if (complete) {
    return null;
  }

  return (
    <Card className="border-primary bg-[#fff7d6] p-5 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-[#111111]">
            <GraduationCap className="size-6" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-xl font-extrabold text-foreground">
              أكمل ملفك الأكاديمي
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              أخبرنا عن مستواك ومقرراتك لتحصل على تجربة أفضل.
            </p>
          </div>
        </div>
        <Button asChild className="h-11 rounded-xl px-5 font-bold">
          <Link href="/profile">أكمل الآن</Link>
        </Button>
      </div>
    </Card>
  );
}

export function StatsCards({ stats }: { readonly stats: DashboardStats }) {
  const items = [
    { label: "ملفاتي", value: stats.myFiles, icon: FolderOpen },
    { label: "قيد المراجعة", value: stats.pending, icon: CircleHelp },
    { label: "مرات التحميل", value: stats.downloads, icon: Download },
    { label: "مرات المشاهدة", value: stats.views, icon: Search },
  ] as const;

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className="p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-muted-foreground">{item.label}</p>
              <p className="mt-3 text-3xl font-extrabold text-foreground">
                {item.value.toLocaleString("ar-DZ")}
              </p>
            </div>
            <span className="flex size-11 items-center justify-center rounded-2xl bg-muted text-foreground">
              <item.icon className="size-5" aria-hidden="true" />
            </span>
          </div>
        </Card>
      ))}
    </section>
  );
}

export function QuickActions({
  user,
  modules,
  canUpload,
}: {
  readonly user: DashboardUser;
  readonly modules: readonly ModuleSummary[];
  readonly canUpload: boolean;
}) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {quickActions.map((action) => {
        const content = (
          <>
            <span className="flex size-11 items-center justify-center rounded-2xl bg-[#111111] text-white">
              <action.icon className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h2 className="text-base font-extrabold text-foreground">
                {action.label}
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {action.description}
              </p>
            </div>
            <ChevronLeft className="mr-auto size-4 text-muted-foreground" aria-hidden="true" />
          </>
        );

        if (action.href === "#upload") {
          return canUpload ? (
            <UploadResourceDialog
              key={action.label}
              user={user}
              modules={modules}
              triggerLabel={action.label}
              triggerChildren={content}
              triggerClassName="h-auto min-h-24 w-full justify-start rounded-2xl border border-border bg-background p-5 text-right text-foreground shadow-[0_18px_60px_rgba(17,17,17,0.04)] hover:bg-muted"
            />
          ) : (
            <Link
              key={action.label}
              href="/profile"
              className="flex min-h-24 items-center gap-4 rounded-2xl border border-border bg-background p-5 shadow-[0_18px_60px_rgba(17,17,17,0.04)] transition hover:bg-muted"
            >
              {content}
            </Link>
          );
        }

        return (
          <Link
            key={action.label}
            href={action.href}
            className="flex min-h-24 items-center gap-4 rounded-2xl border border-border bg-background p-5 shadow-[0_18px_60px_rgba(17,17,17,0.04)] transition hover:bg-muted"
          >
            {content}
          </Link>
        );
      })}
    </section>
  );
}

export function LatestResources({
  resources,
}: {
  readonly resources: readonly ResourceSummary[];
}) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-primary">آخر الملفات</p>
          <h2 className="mt-1 text-xl font-extrabold text-foreground">
            موارد مقبولة حديثا
          </h2>
        </div>
        <Button asChild variant="outline" className="h-10 rounded-xl px-4">
          <Link href="/explore">عرض الكل</Link>
        </Button>
      </div>

      <div className="divide-y divide-border">
        {resources.length > 0 ? (
          resources.map((resource) => (
            <article
              key={resource.id}
              className="grid gap-4 py-4 first:pt-0 last:pb-0 md:grid-cols-[1fr_auto]"
            >
              <div className="flex min-w-0 items-start gap-3">
                <ResourceIcon type={resource.resourceType} />
                <div className="min-w-0">
                  <h3 className="truncate text-base font-extrabold text-foreground">
                    {resource.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {resource.moduleName} · {levelLabels[resource.moduleLevel]} ·{" "}
                    {resource.moduleSemester} · {resourceTypeLabels[resource.resourceType]}
                  </p>
                </div>
              </div>
              <Button asChild variant="outline" className="h-10 rounded-xl px-4">
                <Link href={resource.driveUrl} target="_blank" rel="noreferrer">
                  تحميل
                  <Download className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </article>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center">
            <FileText className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
            <h3 className="mt-4 text-base font-extrabold text-foreground">
              لا توجد ملفات مقبولة بعد
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              ستظهر هنا أحدث الموارد بعد مراجعتها.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

export function TrendingResources({
  resources,
}: {
  readonly resources: readonly ResourceSummary[];
}) {
  const trending = resources.slice(0, 3);

  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-2xl bg-muted text-foreground">
          <TrendingUp className="size-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-bold text-primary">الأكثر تداولا</p>
          <h2 className="text-xl font-extrabold text-foreground">هذا الأسبوع</h2>
        </div>
      </div>
      {/* TODO: Replace mock download counts with resources.downloads when tracking is wired. */}
      <div className="space-y-3">
        {trending.length > 0 ? (
          trending.map((resource, index) => (
            <Link
              key={resource.id}
              href={resource.driveUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-border p-3 transition hover:bg-muted"
            >
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-sm font-extrabold text-[#111111]">
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold text-foreground">
                  {resource.title}
                </p>
                <p className="text-xs font-semibold text-muted-foreground">
                  {18 - index * 4} تحميل
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p className="rounded-2xl border border-dashed border-border p-5 text-sm leading-6 text-muted-foreground">
            ستظهر الموارد الرائجة هنا بعد توفر بيانات التحميل.
          </p>
        )}
      </div>
    </Card>
  );
}

export function AnnouncementCard() {
  return (
    <Card className="border-primary bg-[#fff8dd] p-5 sm:p-6">
      <div className="flex gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-[#111111]">
          <Megaphone className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-lg font-extrabold text-foreground">تنبيه مهم</h2>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            يرجى التأكد من أن جميع الملفات المرفوعة عبارة عن روابط Google Drive فقط.
          </p>
        </div>
      </div>
    </Card>
  );
}

export function StudentDashboard({
  user,
  preferences,
  complete,
  modules,
  latestResources,
  stats,
}: {
  readonly user: DashboardUser;
  readonly preferences: UserPreferences;
  readonly complete: boolean;
  readonly modules: readonly ModuleSummary[];
  readonly latestResources: readonly ResourceSummary[];
  readonly stats: DashboardStats;
}) {
  return (
    <div className="min-h-screen bg-[#fbfbfb] text-foreground" dir="rtl">
      <Sidebar
        user={user}
        modules={modules}
        canUpload={complete}
        activeHref="/home"
      />
      <div className="lg:pr-72">
        <DashboardHeader user={user} preferences={preferences} />
        <main className="mx-auto max-w-[1440px] space-y-6 px-4 py-6 pb-12 sm:px-6 lg:px-8">
          <div className="lg:hidden">
            <StudentMobileDrawer activeHref="/home" />
          </div>
          <ProfileCompletionCard complete={complete} />
          <StatsCards stats={stats} />
          <QuickActions user={user} modules={modules} canUpload={complete} />
          <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <LatestResources resources={latestResources} />
            <TrendingResources resources={latestResources} />
          </section>
          <AnnouncementCard />
        </main>
      </div>
    </div>
  );
}
