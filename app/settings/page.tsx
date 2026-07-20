import type { Metadata } from "next";
import {
  Bell,
  Eye,
  Globe2,
  Lock,
  Monitor,
  Shield,
  Trash2,
  UserRound,
} from "lucide-react";

import { PageHeader, SectionCard } from "@/components/dashboard/student-common";
import { StudentShell } from "@/components/dashboard/student-shell";
import { Button } from "@/components/ui/button";
import { getDashboardContext, getModules } from "@/lib/home-data";

export const metadata: Metadata = {
  title: "الإعدادات | Pingy",
};

const sections = [
  {
    title: "الحساب",
    description: "الاسم، البريد، وربط الملف الشخصي.",
    icon: UserRound,
    items: ["تحديث الاسم من صفحة الملف الشخصي", "عرض البريد الحالي", "إدارة الصورة الشخصية"],
  },
  {
    title: "اللغة",
    description: "واجهة Pingy عربية أولا وRTL.",
    icon: Globe2,
    items: ["العربية مفعلة", "دعم الإنجليزية لاحقا", "تنسيق التاريخ محلي"],
  },
  {
    title: "المظهر",
    description: "إعدادات شكل الواجهة.",
    icon: Monitor,
    items: ["الوضع الفاتح", "الوضع الداكن لاحقا", "تقليل الحركة"],
  },
  {
    title: "الخصوصية",
    description: "تحكم في ظهور مساهماتك.",
    icon: Lock,
    items: ["إظهار الاسم للزملاء", "إخفاء البريد", "ملف عام لاحقا"],
  },
  {
    title: "الإشعارات",
    description: "اختر ما تريد متابعته.",
    icon: Bell,
    items: ["قبول الملفات", "تحديثات المقررات", "نشاط المجتمع"],
  },
  {
    title: "إمكانية الوصول",
    description: "خيارات قراءة أكثر راحة.",
    icon: Eye,
    items: ["تباين واضح", "أزرار كبيرة", "حركة بسيطة"],
  },
  {
    title: "الأمان",
    description: "حماية الحساب والجلسة.",
    icon: Shield,
    items: ["الجلسة الحالية نشطة", "تغيير كلمة المرور لاحقا", "تحقق البريد"],
  },
] as const;

export default async function SettingsPage() {
  const { user, preferences } = await getDashboardContext();
  const modules = await getModules();

  return (
    <StudentShell
      user={user}
      preferences={preferences}
      modules={modules}
      activeHref="/settings"
    >
      <PageHeader
        eyebrow="الإعدادات"
        title="تحكم هادئ وواضح بتجربتك"
        description="كل الأقسام جاهزة للربط لاحقا. ما لا يدعمه backend الآن يبقى UI-only بدون وعود مخفية."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => (
          <SettingsCard key={section.title} section={section} />
        ))}
      </div>
      <SectionCard className="border-red-200 bg-red-50">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-background text-red-700">
              <Trash2 className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-extrabold text-red-950">منطقة الخطر</h2>
              <p className="mt-2 text-sm leading-6 text-red-900/75">
                حذف الحساب وتعطيل البيانات غير مربوطين حاليا لحماية التجربة.
              </p>
            </div>
          </div>
          <Button variant="destructive" className="h-10 rounded-xl px-4" disabled>
            حذف الحساب
          </Button>
        </div>
      </SectionCard>
    </StudentShell>
  );
}

function SettingsCard({
  section,
}: {
  readonly section: (typeof sections)[number];
}) {
  return (
    <SectionCard>
      <div className="flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-muted text-foreground">
          <section.icon className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-lg font-extrabold">{section.title}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {section.description}
          </p>
        </div>
      </div>
      <div className="mt-5 space-y-3">
        {section.items.map((item) => (
          <label
            key={item}
            className="flex min-h-11 items-center justify-between gap-3 rounded-xl border border-border px-3 text-sm font-bold"
          >
            <span>{item}</span>
            <input type="checkbox" className="size-4 accent-primary" defaultChecked />
          </label>
        ))}
      </div>
    </SectionCard>
  );
}
