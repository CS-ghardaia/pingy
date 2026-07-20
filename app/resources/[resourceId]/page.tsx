import { notFound } from "next/navigation";
import { Download, ZoomIn, ZoomOut } from "lucide-react";

import { StudentLayoutShell } from "@/components/layout/student-nav";
import {
  CommentThread,
  FavoriteButton,
  RatingStars,
  ReportDialog,
  ResourceViewRecorder,
} from "@/components/resource/resource-interactions";
import { Badge } from "@/components/ui/badge";
import { downloadResourceAction } from "@/lib/student/actions";
import {
  getReportReasons,
  getResourceDetail,
  getStudentContext,
} from "@/lib/student/queries";

export default async function ResourcePage({
  params,
}: {
  readonly params: Promise<{ resourceId: string }>;
}) {
  const { resourceId } = await params;
  const { user, preference } = await getStudentContext();
  const [resource, reasons] = await Promise.all([
    getResourceDetail(resourceId, user.id),
    getReportReasons(),
  ]);

  if (!resource) {
    notFound();
  }

  return (
    <StudentLayoutShell user={user} preference={preference} activePath="/modules">
      <ResourceViewRecorder resourceId={resource.id} />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="card-surface overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
            <h1 className="text-2xl font-extrabold">{resource.title}</h1>
            <div className="flex gap-2">
              <button className="flex size-11 items-center justify-center rounded-lg hover:bg-muted" aria-label="تصغير">
                <ZoomOut className="size-5" aria-hidden="true" />
              </button>
              <button className="flex size-11 items-center justify-center rounded-lg hover:bg-muted" aria-label="تكبير">
                <ZoomIn className="size-5" aria-hidden="true" />
              </button>
              <form action={downloadResourceAction}>
                <input type="hidden" name="resourceId" value={resource.id} />
                <input type="hidden" name="fileUrl" value={resource.fileUrl} />
                <button className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-5 py-3 font-bold text-primary-foreground">
                  <Download className="size-5" aria-hidden="true" />
                  تحميل
                </button>
              </form>
            </div>
          </div>
          {resource.mimeType?.includes("pdf") ? (
            <iframe
              title={resource.title}
              src={resource.fileUrl}
              className="h-[72vh] w-full bg-background"
            />
          ) : (
            <div className="grid min-h-[60vh] place-items-center p-8 text-center">
              <div>
                <p className="text-xl font-extrabold">معاينة مباشرة غير متاحة لهذا النوع.</p>
                <a
                  href={resource.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-primary px-6 py-3 font-bold text-primary-foreground"
                >
                  فتح الملف
                </a>
              </div>
            </div>
          )}
        </section>
        <aside className="space-y-4">
          <section className="card-surface p-5">
            <p className="text-sm font-bold text-muted-foreground">{resource.resourceTypeName}</p>
            <p className="mt-2 leading-7">{resource.description ?? "لا يوجد وصف."}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {resource.tags.map((tag) => (
                <Badge key={tag.id} asChild>
                  <a href={`/search?tag=${tag.slug}`}>{tag.name}</a>
                </Badge>
              ))}
            </div>
          </section>
          <RatingStars resourceId={resource.id} value={resource.myRating} />
          <div className="card-surface flex flex-wrap gap-2 p-5">
            <FavoriteButton resourceId={resource.id} isFavorite={resource.isFavorite} />
            <ReportDialog resourceId={resource.id} reasons={reasons} />
          </div>
        </aside>
      </div>
      <CommentThread
        resourceId={resource.id}
        comments={resource.comments}
        currentUserId={user.id}
      />
    </StudentLayoutShell>
  );
}
