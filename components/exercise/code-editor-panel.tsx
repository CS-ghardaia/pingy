"use client";

import { useActionState } from "react";
import { Play } from "lucide-react";

import { submitExerciseAction } from "@/lib/student/actions";
import { initialActionState } from "@/lib/student/action-state";
import type { ExerciseDetail, SubmissionSummary } from "@/lib/student/types";

export function CodeEditorPanel({
  exercise,
  submissions,
}: {
  readonly exercise: ExerciseDetail;
  readonly submissions: readonly SubmissionSummary[];
}) {
  const [state, formAction, pending] = useActionState(
    submitExerciseAction,
    initialActionState,
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)]">
      <section className="card-surface order-2 p-6 lg:order-1">
        <h2 className="text-xl font-extrabold">المسألة</h2>
        <p className="mt-4 whitespace-pre-wrap leading-8 text-muted-foreground">
          {exercise.description ?? exercise.title}
        </p>
        <div className="mt-5 rounded-lg bg-secondary p-5 text-secondary-foreground">
          <p className="font-mono text-sm">time_limit_ms = {exercise.timeLimitMs}</p>
          <pre className="mt-3 overflow-auto text-sm">{exercise.testCases}</pre>
        </div>
      </section>
      <section className="card-surface order-1 overflow-hidden lg:order-2">
        <form action={formAction}>
          <input type="hidden" name="resourceId" value={exercise.id} />
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <p className="font-extrabold">{exercise.language}</p>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-5 py-3 font-bold text-primary-foreground"
            >
              <Play className="size-5" aria-hidden="true" />
              تشغيل
            </button>
          </div>
          <label htmlFor="code" className="sr-only">
            محرر الكود
          </label>
          <textarea
            id="code"
            name="code"
            dir="ltr"
            spellCheck={false}
            defaultValue={exercise.starterCode ?? ""}
            className="min-h-[420px] w-full resize-y bg-secondary p-6 font-mono text-sm leading-7 text-secondary-foreground outline-none"
          />
        </form>
        {state.message ? <p className="px-5 py-3 text-sm font-bold">{state.message}</p> : null}
        <div className="border-t border-border p-5">
          <h3 className="font-extrabold">آخر المحاولات</h3>
          <div className="mt-3 space-y-2">
            {submissions.length === 0 ? (
              <p className="text-sm text-muted-foreground">لا توجد محاولات بعد.</p>
            ) : (
              submissions.map((submission) => (
                <div key={submission.id} className="rounded-lg bg-muted p-3 text-sm">
                  <span className="font-bold">{submission.status}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    · {new Date(submission.submittedAt).toLocaleString("ar-DZ")}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
