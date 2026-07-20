import { AlertTriangle, Inbox } from "lucide-react";

import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  action,
}: {
  readonly title: string;
  readonly description?: string;
  readonly action?: React.ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-3xl font-extrabold leading-tight text-foreground md:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

export function EmptyState({
  title,
  description,
  icon,
}: {
  readonly title: string;
  readonly description: string;
  readonly icon?: React.ReactNode;
}) {
  return (
    <section className="card-surface border-dashed p-8 text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        {icon ?? <Inbox className="size-6" aria-hidden="true" />}
      </div>
      <h2 className="mt-5 text-xl font-extrabold">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </section>
  );
}

export function ErrorState({
  title = "حدث خطأ",
  description = "تعذر تحميل البيانات الآن. حاول تحديث الصفحة.",
  reset,
}: {
  readonly title?: string;
  readonly description?: string;
  readonly reset?: () => void;
}) {
  return (
    <section className="card-surface p-8 text-center" role="alert">
      <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-[color:var(--error-container)] text-[color:var(--on-error-container)]">
        <AlertTriangle className="size-6" aria-hidden="true" />
      </div>
      <h1 className="mt-5 text-2xl font-extrabold">{title}</h1>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      {reset ? (
        <button
          type="button"
          onClick={reset}
          className="mt-5 min-h-11 rounded-lg bg-primary px-6 py-3 font-bold text-primary-foreground"
        >
          إعادة المحاولة
        </button>
      ) : null}
    </section>
  );
}

export function SkeletonBlock({ className }: { readonly className?: string }) {
  return <div className={cn("skeleton rounded-lg", className)} />;
}

export function PageSkeleton() {
  return (
    <main className="space-y-6 p-6">
      <SkeletonBlock className="h-12 w-64" />
      <div className="grid gap-4 md:grid-cols-3">
        <SkeletonBlock className="h-40" />
        <SkeletonBlock className="h-40" />
        <SkeletonBlock className="h-40" />
      </div>
      <SkeletonBlock className="h-72" />
    </main>
  );
}
