"use client";

import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import type {
  DashboardUser,
  ModuleSummary,
  ResourceType,
} from "@/lib/home-types";
import { resourceTypeLabels } from "@/lib/home-types";
import { cn } from "@/lib/utils";

type UploadFormProps = {
  readonly user: DashboardUser;
  readonly modules: readonly ModuleSummary[];
  readonly compact?: boolean;
};

const initialState = {
  status: "idle" as const,
  message: "",
};

const resourceTypes: readonly ResourceType[] = [
  "course",
  "td",
  "tp",
  "exam",
  "summary",
  "solution",
  "project",
  "other",
];

const inputClasses =
  "h-12 w-full rounded-lg border border-input bg-background px-4 text-base text-foreground transition placeholder:text-muted-foreground/65 focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/20";
const textareaClasses =
  "min-h-32 w-full rounded-lg border border-input bg-background px-4 py-3 text-base text-foreground transition placeholder:text-muted-foreground/65 focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/20";

export function UploadForm({ user, modules, compact = false }: UploadFormProps) {
  const [state, formAction, pending] = useActionState(submitResource, initialState);
  const statusMessage =
    state.status === "success" || state.status === "error" ? state.message : "";

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set("userId", user.id);
    formAction(formData);
  };

  return (
    <form
      action={formAction}
      onSubmit={submit}
      className={cn(
        compact
          ? "space-y-0"
          : "rounded-xl border border-border bg-background p-5 shadow-sm sm:p-6",
      )}
      noValidate
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-bold text-muted-foreground"
          >
            العنوان
          </label>
          <input
            id="title"
            name="title"
            className={inputClasses}
            required
            placeholder="مثال: ملخص الخوارزميات"
          />
        </div>

        <div className="lg:col-span-2">
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-bold text-muted-foreground"
          >
            الوصف
          </label>
          <textarea
            id="description"
            name="description"
            className={textareaClasses}
            required
            placeholder="اكتب وصفا قصيرا يساعد الطلبة على فهم محتوى الملف"
          />
        </div>

        <div>
          <label
            htmlFor="moduleId"
            className="mb-2 block text-sm font-bold text-muted-foreground"
          >
            المقرر
          </label>
          <select id="moduleId" name="moduleId" className={inputClasses} required>
            <option value="">اختر المقرر</option>
            {modules.map((module) => (
              <option key={module.id} value={module.id}>
                {module.name} - {module.level} {module.semester}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="resourceType"
            className="mb-2 block text-sm font-bold text-muted-foreground"
          >
            نوع الملف
          </label>
          <select
            id="resourceType"
            name="resourceType"
            className={inputClasses}
            required
          >
            <option value="">اختر النوع</option>
            {resourceTypes.map((type) => (
              <option key={type} value={type}>
                {resourceTypeLabels[type]}
              </option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-2">
          <label
            htmlFor="driveUrl"
            className="mb-2 block text-sm font-bold text-muted-foreground"
          >
            رابط Google Drive
          </label>
          <input
            id="driveUrl"
            name="driveUrl"
            className={inputClasses}
            required
            type="url"
            dir="ltr"
            placeholder="https://drive.google.com/..."
          />
        </div>
      </div>

      {statusMessage ? (
        <div
          role={state.status === "error" ? "alert" : "status"}
          className={cn(
            "mt-5 flex items-start gap-3 rounded-lg border p-4 text-sm font-semibold leading-6",
            state.status === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-red-200 bg-red-50 text-red-900",
          )}
        >
          {state.status === "success" ? (
            <CheckCircle2 className="size-5" aria-hidden="true" />
          ) : (
            <AlertCircle className="size-5" aria-hidden="true" />
          )}
          {statusMessage}
        </div>
      ) : null}

      <div className="mt-6 flex justify-end">
        <Button
          type="submit"
          disabled={pending || modules.length === 0}
          className="h-11 gap-2 px-5"
        >
          {pending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="size-4" aria-hidden="true" />
          )}
          {pending ? "جار الإرسال..." : "إرسال للمراجعة"}
        </Button>
      </div>
    </form>
  );
}
