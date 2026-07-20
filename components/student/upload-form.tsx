"use client";

import { useActionState, useMemo, useState } from "react";

import { uploadResourceAction } from "@/lib/student/actions";
import { initialActionState } from "@/lib/student/action-state";
import type { ModuleSummary, ResourceTypeOption } from "@/lib/student/types";

export function UploadForm({
  modules,
  resourceTypes,
}: {
  readonly modules: readonly ModuleSummary[];
  readonly resourceTypes: readonly ResourceTypeOption[];
}) {
  const [state, formAction, pending] = useActionState(
    uploadResourceAction,
    initialActionState,
  );
  const [resourceType, setResourceType] = useState(resourceTypes[0]?.code ?? "");
  const isExercise = resourceType === "exercise";
  const sortedModules = useMemo(
    () => [...modules].sort((a, b) => a.semester.localeCompare(b.semester) || a.orderIndex - b.orderIndex),
    [modules],
  );

  return (
    <form action={formAction} className="card-surface space-y-5 p-6">
      <Field label="العنوان" name="title" required />
      <div>
        <label htmlFor="description" className="mb-2 block text-xs font-bold uppercase text-muted-foreground">
          الوصف
        </label>
        <textarea
          id="description"
          name="description"
          className="min-h-30 w-full rounded-lg border border-input bg-background px-4 py-3"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="moduleId" className="mb-2 block text-xs font-bold uppercase text-muted-foreground">
            الوحدة
          </label>
          <select id="moduleId" name="moduleId" required className="h-12 w-full rounded-lg border border-input bg-background px-4">
            <option value="">اختر الوحدة</option>
            {sortedModules.map((module) => (
              <option key={module.id} value={module.id}>
                {module.name} · {module.semester}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="resourceType" className="mb-2 block text-xs font-bold uppercase text-muted-foreground">
            نوع المورد
          </label>
          <select
            id="resourceType"
            name="resourceType"
            required
            value={resourceType}
            onChange={(event) => setResourceType(event.target.value)}
            className="h-12 w-full rounded-lg border border-input bg-background px-4"
          >
            {resourceTypes.map((type) => (
              <option key={type.code} value={type.code}>
                {type.nameAr}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="رابط الملف" name="fileUrl" type="url" required dir="ltr" />
        <Field label="معرّف الملف" name="fileId" dir="ltr" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="نوع MIME" name="mimeType" placeholder="application/pdf" dir="ltr" />
        <Field label="وسوم اختيارية" name="tags" placeholder="خوارزميات, امتحان" />
      </div>
      {isExercise ? (
        <div className="rounded-lg border border-border bg-muted p-4">
          <h2 className="font-extrabold">تفاصيل التمرين</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="difficulty" className="mb-2 block text-xs font-bold uppercase text-muted-foreground">
                الصعوبة
              </label>
              <select id="difficulty" name="difficulty" className="h-12 w-full rounded-lg border border-input bg-background px-4">
                <option value="easy">سهل</option>
                <option value="medium">متوسط</option>
                <option value="hard">صعب</option>
              </select>
            </div>
            <Field label="اللغة" name="language" defaultValue="python" dir="ltr" />
          </div>
          <div className="mt-4">
            <label htmlFor="starterCode" className="mb-2 block text-xs font-bold uppercase text-muted-foreground">
              كود البداية
            </label>
            <textarea id="starterCode" name="starterCode" dir="ltr" className="min-h-32 w-full rounded-lg border border-input bg-secondary p-4 font-mono text-secondary-foreground" />
          </div>
          <div className="mt-4">
            <label htmlFor="testCases" className="mb-2 block text-xs font-bold uppercase text-muted-foreground">
              حالات الاختبار JSON
            </label>
            <textarea id="testCases" name="testCases" dir="ltr" defaultValue="[]" className="min-h-28 w-full rounded-lg border border-input bg-secondary p-4 font-mono text-secondary-foreground" />
          </div>
        </div>
      ) : null}
      {state.message ? <p className="font-bold">{state.message}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="min-h-11 rounded-lg bg-primary px-6 py-3 font-bold text-primary-foreground"
      >
        رفع للمراجعة
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  dir,
  placeholder,
  defaultValue,
}: {
  readonly label: string;
  readonly name: string;
  readonly type?: string;
  readonly required?: boolean;
  readonly dir?: "ltr" | "rtl";
  readonly placeholder?: string;
  readonly defaultValue?: string;
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
        required={required}
        dir={dir}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="h-12 w-full rounded-lg border border-input bg-background px-4"
      />
    </div>
  );
}
