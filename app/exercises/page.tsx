import { StudentLayoutShell } from "@/components/layout/student-nav";
import { ExerciseCard } from "@/components/exercise/exercise-card";
import { EmptyState, PageHeader } from "@/components/student/states";
import { getExercises, getStudentContext } from "@/lib/student/queries";

export default async function ExercisesPage() {
  const { user, preference } = await getStudentContext();
  const exercises = await getExercises();

  return (
    <StudentLayoutShell user={user} preference={preference} activePath="/modules">
      <PageHeader
        title="التمارين البرمجية"
        description="تمارين مع محرر كود بسيط وإرسال محاولات إلى قائمة التنفيذ."
      />
      {exercises.length === 0 ? (
        <EmptyState title="لا توجد تمارين" description="ستظهر هنا التمارين المعتمدة عند إضافتها." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {exercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
      )}
    </StudentLayoutShell>
  );
}
