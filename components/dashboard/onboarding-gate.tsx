import Link from "next/link";
import { GraduationCap } from "lucide-react";

import { Button } from "@/components/ui/button";

export function OnboardingGate() {
  return (
    <section className="rounded-xl border border-border bg-background p-6 shadow-sm sm:p-8">
      <div className="flex size-12 items-center justify-center rounded-lg bg-accent text-foreground">
        <GraduationCap className="size-6" aria-hidden="true" />
      </div>
      <p className="mt-6 text-sm font-bold text-primary">الملف الشخصي مطلوب</p>
      <h1 className="mt-3 text-3xl font-extrabold leading-tight text-foreground">
        أكمل ملفك الأكاديمي أولًا.
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
        تحتاج Pinggly إلى جامعتك والمستوى الأكاديمي قبل فتح بقية لوحة الطالب.
      </p>
      <Button asChild className="mt-6 h-11 px-5">
        <Link href="/home/profile">إكمال الملف الشخصي</Link>
      </Button>
    </section>
  );
}
