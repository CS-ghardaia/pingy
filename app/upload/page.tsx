import { StudentLayoutShell } from "@/components/layout/student-nav";
import { PageHeader } from "@/components/student/states";
import { UploadForm } from "@/components/student/upload-form";
import {
  getModulesForLevel,
  getResourceTypes,
  getStudentContext,
} from "@/lib/student/queries";

export default async function UploadPage() {
  const { user, preference } = await getStudentContext();
  const [modules, resourceTypes] = await Promise.all([
    getModulesForLevel(preference.academicLevel),
    getResourceTypes(),
  ]);

  return (
    <StudentLayoutShell user={user} preference={preference} activePath="/upload">
      <PageHeader
        title="رفع مورد"
        description="سيتم حفظ المورد بحالة قيد المراجعة، ولن يظهر للعامة حتى تتم الموافقة عليه."
      />
      <UploadForm modules={modules} resourceTypes={resourceTypes} />
    </StudentLayoutShell>
  );
}
