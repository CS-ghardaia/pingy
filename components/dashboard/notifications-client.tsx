"use client";

import { useMemo, useState } from "react";
import { Bell, CheckCircle2, Users } from "lucide-react";

import { SectionCard } from "@/components/dashboard/student-common";
import type { DemoNotification } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const filters = [
  { value: "all", label: "الكل" },
  { value: "unread", label: "غير المقروءة" },
  { value: "system", label: "النظام" },
  { value: "resources", label: "الموارد" },
  { value: "community", label: "المجتمع" },
] as const;

export function NotificationsClient({
  notifications,
}: {
  readonly notifications: readonly DemoNotification[];
}) {
  const [filter, setFilter] = useState<(typeof filters)[number]["value"]>("all");

  const visible = useMemo(() => {
    if (filter === "all") {
      return notifications;
    }
    if (filter === "unread") {
      return notifications.filter((item) => item.unread);
    }
    return notifications.filter((item) => item.category === filter);
  }, [filter, notifications]);

  return (
    <div className="space-y-5">
      <SectionCard className="p-3">
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={cn(
                "h-10 rounded-xl px-4 text-sm font-extrabold transition",
                filter === item.value
                  ? "bg-[#111111] text-white"
                  : "bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </SectionCard>
      <div className="grid gap-3">
        {visible.map((notification) => (
          <NotificationCard key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  );
}

function NotificationCard({
  notification,
}: {
  readonly notification: DemoNotification;
}) {
  const Icon =
    notification.category === "resources"
      ? CheckCircle2
      : notification.category === "community"
        ? Users
        : Bell;

  return (
    <article
      className={cn(
        "rounded-2xl border p-5 shadow-[0_18px_60px_rgba(17,17,17,0.04)]",
        notification.unread
          ? "border-primary bg-[#fff8dd]"
          : "border-border bg-background",
      )}
    >
      <div className="flex gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-background text-foreground">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-extrabold text-foreground">{notification.title}</h2>
            {notification.unread ? (
              <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-extrabold text-[#111111]">
                جديد
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {notification.body}
          </p>
          <p className="mt-3 text-xs font-bold text-muted-foreground">
            {notification.time}
          </p>
        </div>
      </div>
    </article>
  );
}
