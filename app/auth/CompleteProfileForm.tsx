"use client";

import { AlertCircle, CheckCircle2, GraduationCap, Loader2 } from "lucide-react";
import { useActionState } from "react";

import type { AuthFormState } from "@/app/auth/actions";
import { completeProfile } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CompleteProfileFormProps = {
  readonly fullName: string;
  readonly email: string;
};

const initialState: AuthFormState = {
  status: "idle",
  message: "",
};

const academicYears = [
  "الأولى ليسانس",
  "الثانية ليسانس",
  "الثالثة ليسانس",
  "ماستر 1",
  "ماستر 2",
];

const selectClasses =
  "h-12 w-full rounded-lg border border-input bg-background px-4 text-base font-semibold text-foreground transition focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/20";
const errorInputClasses =
  "border-destructive focus:border-destructive focus:ring-destructive/20";

function FieldError({ message }: { readonly message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-destructive">
      <AlertCircle size={16} aria-hidden="true" />
      {message}
    </p>
  );
}

export function CompleteProfileForm({
  fullName,
  email,
}: CompleteProfileFormProps) {
  const [state, formAction, pending] = useActionState(
    completeProfile,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <div className="rounded-lg border border-border bg-muted/50 p-4">
        <p className="text-sm font-bold text-foreground">
          {fullName || "حسابك"}
        </p>
        {email ? (
          <p className="mt-1 text-sm text-muted-foreground" dir="ltr">
            {email}
          </p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="university"
          className="mb-2 block text-sm font-bold text-muted-foreground"
        >
          الجامعة
        </label>
        <select
          id="university"
          name="university"
          required
          defaultValue="جامعة غرداية"
          className={cn(
            selectClasses,
            state.fieldErrors?.university && errorInputClasses,
          )}
          aria-invalid={Boolean(state.fieldErrors?.university)}
        >
          <option value="جامعة غرداية">جامعة غرداية</option>
        </select>
        <FieldError message={state.fieldErrors?.university} />
      </div>

      <div>
        <label
          htmlFor="academicYear"
          className="mb-2 block text-sm font-bold text-muted-foreground"
        >
          السنة الدراسية
        </label>
        <select
          id="academicYear"
          name="academicYear"
          required
          defaultValue=""
          className={cn(
            selectClasses,
            state.fieldErrors?.academicYear && errorInputClasses,
          )}
          aria-invalid={Boolean(state.fieldErrors?.academicYear)}
        >
          <option value="" disabled>
            اختر السنة الدراسية
          </option>
          {academicYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <FieldError message={state.fieldErrors?.academicYear} />
      </div>

      {state.message ? (
        <div
          role={state.status === "error" ? "alert" : "status"}
          className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold leading-6 text-red-900"
        >
          {state.status === "error" ? (
            <AlertCircle size={18} aria-hidden="true" />
          ) : (
            <CheckCircle2 size={18} aria-hidden="true" />
          )}
          <span>{state.message}</span>
        </div>
      ) : null}

      <Button type="submit" disabled={pending} className="h-12 w-full gap-2">
        {pending ? (
          <Loader2 className="size-5 animate-spin" aria-hidden="true" />
        ) : (
          <GraduationCap className="size-5" aria-hidden="true" />
        )}
        {pending ? "جار حفظ البيانات..." : "إكمال التسجيل"}
      </Button>
    </form>
  );
}
