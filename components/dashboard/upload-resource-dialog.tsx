"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Plus, X } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { UploadForm } from "@/components/dashboard/upload-form";
import type { DashboardUser, ModuleSummary } from "@/lib/home-types";

type UploadResourceDialogProps = {
  readonly user: DashboardUser;
  readonly modules: readonly ModuleSummary[];
  readonly triggerLabel?: string;
  readonly triggerChildren?: ReactNode;
  readonly triggerClassName?: string;
};

export function UploadResourceDialog({
  user,
  modules,
  triggerLabel = "رفع ملف",
  triggerChildren,
  triggerClassName,
}: UploadResourceDialogProps) {
  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger asChild>
        <Button className={triggerClassName}>
          {triggerChildren ?? (
            <>
              <Plus className="size-4" aria-hidden="true" />
              {triggerLabel}
            </>
          )}
        </Button>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-[#111111]/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
        <DialogPrimitive.Content
          className="fixed left-1/2 top-1/2 z-50 max-h-[88vh] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-background p-5 shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 sm:p-6"
          dir="rtl"
          aria-describedby="upload-resource-description"
        >
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <DialogPrimitive.Title className="text-2xl font-extrabold text-foreground">
                رفع ملف جديد
              </DialogPrimitive.Title>
              <DialogPrimitive.Description
                id="upload-resource-description"
                className="mt-2 text-sm leading-6 text-muted-foreground"
              >
                أضف رابط Google Drive خارجي فقط. لا يوجد رفع ملفات أو تخزين داخل
                المنصة.
              </DialogPrimitive.Description>
            </div>
            <DialogPrimitive.Close asChild>
              <button
                type="button"
                className="flex size-10 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground focus:outline-none focus:ring-[3px] focus:ring-primary/25"
                aria-label="إغلاق نافذة رفع ملف"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </DialogPrimitive.Close>
          </div>

          <UploadForm user={user} modules={modules} compact />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
