import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getCurrentUserProfile } from "@/app/auth/actions";
import { CompleteProfileForm } from "@/app/auth/CompleteProfileForm";

export const metadata: Metadata = {
  title: "إكمال بيانات الحساب | Pingy",
};

export default async function CompleteProfilePage() {
  const { user, complete } = await getCurrentUserProfile();

  if (!user) {
    redirect("/auth/login");
  }

  if (complete) {
    redirect("/home");
  }

  const fullName =
    typeof user.user_metadata.full_name === "string"
      ? user.user_metadata.full_name
      : "";

  return (
    <main className="min-h-screen bg-muted/40">
      <div className="mx-auto grid min-h-screen w-full max-w-[1180px] items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-12">
        <section className="order-2 hidden lg:block">
          <div className="relative overflow-hidden rounded-xl border border-border bg-secondary p-8 text-secondary-foreground shadow-sm">
            <div className="absolute left-8 top-8 h-24 w-24 rounded-full border-[18px] border-primary/85" />
            <div className="relative z-10 flex min-h-130 flex-col justify-between">
              <Link
                href="/"
                className="font-latin w-fit text-2xl font-extrabold text-primary"
              >
                Pingy
              </Link>

              <div className="space-y-8">
                <div className="rounded-lg border border-white/10 bg-white/10 p-6 backdrop-blur">
                  <p className="text-sm font-bold text-primary">
                    خطوة أخيرة
                  </p>
                  <h2 className="mt-4 text-4xl font-extrabold leading-tight">
                    اختر جامعتك وسنتك الدراسية لتجهيز تجربتك.
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  {["جامعة غرداية", "السنة الدراسية"].map((item) => (
                    <div
                      key={item}
                      className="rounded-lg border border-white/10 bg-background px-3 py-4 text-sm font-bold text-foreground"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <p className="max-w-md text-base leading-7 text-secondary-foreground/75">
                يتم حفظ هذه البيانات في تفضيلات الطالب حتى نوجه المحتوى حسب مسارك الدراسي.
              </p>
            </div>
          </div>
        </section>

        <section className="order-1 mx-auto w-full max-w-[540px]">
          <Link
            href="/"
            className="mb-8 inline-flex min-h-11 items-center gap-2 rounded-lg px-1 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={18} aria-hidden="true" />
            العودة للرئيسية
          </Link>

          <div className="rounded-xl border border-border bg-background p-6 shadow-sm sm:p-8">
            <div className="mb-8">
              <p className="text-sm font-bold text-primary">خطوة أخيرة</p>
              <h1 className="mt-3 text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">
                إكمال بيانات الحساب
              </h1>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                اختر الجامعة والسنة الدراسية لحفظ تفضيلات الطالب.
              </p>
            </div>

            <CompleteProfileForm
              fullName={fullName}
              email={user.email ?? ""}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
