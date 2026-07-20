"use client";

import { useActionState } from "react";

import { saveOnboardingAction } from "@/lib/student/actions";
import { initialActionState } from "@/lib/student/action-state";
import type { LookupOption, UniversityOption } from "@/lib/student/types";

export function OnboardingForm({
  universities,
  levels,
}: {
  readonly universities: readonly UniversityOption[];
  readonly levels: readonly LookupOption[];
}) {
  const [state, formAction, pending] = useActionState(
    saveOnboardingAction,
    initialActionState,
  );

  return (
    <form action={formAction} className="card-surface w-full max-w-2xl space-y-5 p-8">
      <div>
        <p className="text-sm font-bold text-primary">إعداد أولي</p>
        <h1 className="mt-2 text-3xl font-extrabold">اختر جامعتك ومستواك</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          هذه الخطوة تظهر مرة واحدة فقط، وتساعدنا على عرض الوحدات المناسبة لك.
        </p>
      </div>
      <div>
        <label htmlFor="universityId" className="mb-2 block text-xs font-bold uppercase text-muted-foreground">
          الجامعة
        </label>
        <select
          id="universityId"
          name="universityId"
          required
          className="h-12 w-full rounded-lg border border-input bg-background px-4"
        >
          <option value="">اختر الجامعة</option>
          {universities.map((university) => (
            <option key={university.id} value={university.id}>
              {university.nameAr ?? university.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="academicLevel" className="mb-2 block text-xs font-bold uppercase text-muted-foreground">
          المستوى
        </label>
        <select
          id="academicLevel"
          name="academicLevel"
          required
          className="h-12 w-full rounded-lg border border-input bg-background px-4"
        >
          <option value="">اختر المستوى</option>
          {levels.map((level) => (
            <option key={level.code} value={level.code}>
              {level.nameAr}
            </option>
          ))}
        </select>
      </div>
      {state.message ? <p className="text-sm font-bold">{state.message}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="min-h-11 rounded-lg bg-primary px-6 py-3 font-bold text-primary-foreground"
      >
        حفظ ومتابعة
      </button>
    </form>
  );
}
