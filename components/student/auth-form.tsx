"use client";

import { useActionState } from "react";
import { Loader2, LogIn, UserPlus } from "lucide-react";

import type { ActionState } from "@/lib/student/action-state";
import { initialActionState } from "@/lib/student/action-state";

export function AuthForm({
  mode,
  action,
}: {
  readonly mode: "login" | "signup";
  readonly action: (
    previousState: ActionState,
    formData: FormData,
  ) => Promise<ActionState>;
}) {
  const [state, formAction, pending] = useActionState(action, initialActionState);
  const isSignup = mode === "signup";

  return (
    <form action={formAction} className="card-surface w-full max-w-lg space-y-5 p-8">
      <div>
        <p className="text-sm font-bold text-primary">Pingy</p>
        <h1 className="mt-2 text-3xl font-extrabold">
          {isSignup ? "إنشاء حساب طالب" : "تسجيل الدخول"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {isSignup
            ? "أنشئ حسابك ثم أكمل الجامعة والمستوى في الإعداد الأولي."
            : "ادخل إلى مساحة الطالب لمتابعة مواردك وتمارينك."}
        </p>
      </div>
      {isSignup ? (
        <Field label="الاسم الكامل" name="fullName" autoComplete="name" />
      ) : null}
      <Field label="البريد الإلكتروني" name="email" type="email" dir="ltr" autoComplete="email" />
      <Field
        label="كلمة المرور"
        name="password"
        type="password"
        dir="ltr"
        autoComplete={isSignup ? "new-password" : "current-password"}
      />
      {state.message ? (
        <p role={state.status === "error" ? "alert" : "status"} className="text-sm font-bold">
          {state.message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-bold text-primary-foreground transition hover:bg-[#E5B312] active:bg-[#D4A010]"
      >
        {pending ? (
          <Loader2 className="size-5 animate-spin" aria-hidden="true" />
        ) : isSignup ? (
          <UserPlus className="size-5" aria-hidden="true" />
        ) : (
          <LogIn className="size-5" aria-hidden="true" />
        )}
        {isSignup ? "إنشاء الحساب" : "دخول"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  dir,
  autoComplete,
}: {
  readonly label: string;
  readonly name: string;
  readonly type?: string;
  readonly dir?: "ltr" | "rtl";
  readonly autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-xs font-bold uppercase text-muted-foreground">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        dir={dir}
        autoComplete={autoComplete}
        required
        className="h-12 w-full rounded-lg border border-input bg-background px-4 text-base focus:border-primary focus:ring-[3px] focus:ring-primary/20"
      />
    </div>
  );
}
