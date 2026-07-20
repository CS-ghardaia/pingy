import { redirect } from "next/navigation";

import { OnboardingForm } from "@/components/student/onboarding-form";
import { getOnboardingLookups, getStudentContext, isPreferenceComplete } from "@/lib/student/queries";

export default async function OnboardingPage() {
  const { preference } = await getStudentContext({ requireOnboarding: false });

  if (isPreferenceComplete(preference)) {
    redirect("/home");
  }

  const lookups = await getOnboardingLookups();

  return (
    <main className="grid min-h-screen place-items-center bg-[color:var(--surface-container-low)] p-4">
      <OnboardingForm universities={lookups.universities} levels={lookups.levels} />
    </main>
  );
}
