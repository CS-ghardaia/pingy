import { StudentLayoutShell } from "@/components/layout/student-nav";
import { ResourceCard } from "@/components/resource/resource-card";
import { EmptyState, PageHeader } from "@/components/student/states";
import {
  getAllTags,
  getOnboardingLookups,
  getResourceTypes,
  getStudentContext,
  searchResources,
} from "@/lib/student/queries";

export default async function SearchPage({
  searchParams,
}: {
  readonly searchParams: Promise<{
    q?: string;
    level?: string;
    semester?: string;
    type?: string;
    tag?: string;
  }>;
}) {
  const params = await searchParams;
  const { user, preference } = await getStudentContext();
  const [resources, lookups, types, tags] = await Promise.all([
    searchResources(params),
    getOnboardingLookups(),
    getResourceTypes(),
    getAllTags(),
  ]);

  return (
    <StudentLayoutShell user={user} preference={preference} activePath="/search">
      <PageHeader title="البحث" description="ابحث في الموارد المعتمدة وضيّق النتائج بالمستوى أو السداسي أو النوع أو الوسم." />
      <form className="card-surface grid gap-4 p-5 lg:grid-cols-[minmax(240px,1fr)_repeat(4,180px)_auto]">
        <input
          name="q"
          defaultValue={params.q}
          className="h-12 rounded-lg border border-input bg-background px-4"
          placeholder="كلمات البحث"
        />
        <select name="level" defaultValue={params.level} className="h-12 rounded-lg border border-input bg-background px-4">
          <option value="">كل المستويات</option>
          {lookups.levels.map((level) => (
            <option key={level.code} value={level.code}>{level.nameAr}</option>
          ))}
        </select>
        <select name="semester" defaultValue={params.semester} className="h-12 rounded-lg border border-input bg-background px-4">
          <option value="">كل السداسيات</option>
          <option value="S1">S1</option>
          <option value="S2">S2</option>
        </select>
        <select name="type" defaultValue={params.type} className="h-12 rounded-lg border border-input bg-background px-4">
          <option value="">كل الأنواع</option>
          {types.map((type) => (
            <option key={type.code} value={type.code}>{type.nameAr}</option>
          ))}
        </select>
        <select name="tag" defaultValue={params.tag} className="h-12 rounded-lg border border-input bg-background px-4">
          <option value="">كل الوسوم</option>
          {tags.map((tag) => (
            <option key={tag.id} value={tag.slug}>{tag.name}</option>
          ))}
        </select>
        <button className="min-h-11 rounded-lg bg-primary px-6 py-3 font-bold text-primary-foreground">
          بحث
        </button>
      </form>
      {resources.length === 0 ? (
        <EmptyState title="لا توجد نتائج" description="جرّب كلمات مختلفة أو أزل بعض الفلاتر." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}
    </StudentLayoutShell>
  );
}
