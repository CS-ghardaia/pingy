import { notFound } from "next/navigation";

import { CodeEditorPanel } from "@/components/exercise/code-editor-panel";
import { StudentLayoutShell } from "@/components/layout/student-nav";
import { PageHeader } from "@/components/student/states";
import { getExerciseDetail, getStudentContext } from "@/lib/student/queries";

export default async function ExercisePage({
  params,
}: {
  readonly params: Promise<{ resourceId: string }>;
}) {
  const { resourceId } = await params;
  const { user, preference } = await getStudentContext();
  const { exercise, submissions } = await getExerciseDetail(resourceId, user.id);

  if (!exercise) {
    notFound();
  }

  return (
    <StudentLayoutShell user={user} preference={preference} activePath="/modules">
      <PageHeader title={exercise.title} description={`${exercise.language} · ${exercise.difficulty}`} />
      <CodeEditorPanel exercise={exercise} submissions={submissions} />
    </StudentLayoutShell>
  );
}
