import Link from "next/link";
import { Code2 } from "lucide-react";

import type { ExerciseSummary } from "@/lib/student/types";
import { cn } from "@/lib/utils";

export function DifficultyDot({ difficulty }: { readonly difficulty: ExerciseSummary["difficulty"] }) {
  const classes = {
    easy: "bg-[color:var(--success)]",
    medium: "bg-primary",
    hard: "bg-[color:var(--error)]",
  } satisfies Record<ExerciseSummary["difficulty"], string>;

  return <span className={cn("size-3 rounded-full", classes[difficulty])} />;
}

export function ExerciseCard({ exercise }: { readonly exercise: ExerciseSummary }) {
  return (
    <article className="card-surface card-hover p-6">
      <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
        <DifficultyDot difficulty={exercise.difficulty} />
        {exercise.language}
      </div>
      <h2 className="mt-4 text-xl font-extrabold">
        <Link href={`/exercises/${exercise.id}`} className="hover:underline">
          {exercise.title}
        </Link>
      </h2>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
        {exercise.description ?? "تمرين برمجي جاهز للمحاولة."}
      </p>
      <Link
        href={`/exercises/${exercise.id}`}
        className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-5 py-3 font-bold text-primary-foreground"
      >
        <Code2 className="size-5" aria-hidden="true" />
        فتح التمرين
      </Link>
    </article>
  );
}
