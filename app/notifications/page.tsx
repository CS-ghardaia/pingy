import { Bell } from "lucide-react";

import { StudentLayoutShell } from "@/components/layout/student-nav";
import { EmptyState, PageHeader } from "@/components/student/states";
import { markNotificationReadAction } from "@/lib/student/actions";
import { getNotifications, getStudentContext } from "@/lib/student/queries";
import { cn } from "@/lib/utils";

export default async function NotificationsPage() {
  const { user, preference } = await getStudentContext();
  const notifications = await getNotifications(user.id);

  return (
    <StudentLayoutShell user={user} preference={preference} activePath="/notifications">
      <PageHeader title="الإشعارات" description="آخر التحديثات الخاصة بحسابك ومواردك." />
      {notifications.length === 0 ? (
        <EmptyState title="لا توجد إشعارات" description="ستظهر هنا إشعارات الموافقة والتعليقات والشارات." icon={<Bell className="size-6" aria-hidden="true" />} />
      ) : (
        <section className="space-y-3">
          {notifications.map((notification) => (
            <form
              key={notification.id}
              action={markNotificationReadAction}
              className={cn(
                "card-surface p-5",
                !notification.isRead && "border-r-4 border-r-primary",
              )}
            >
              <input type="hidden" name="notificationId" value={notification.id} />
              <button type="submit" className="block w-full text-right">
                <h2 className="font-extrabold">{notification.title}</h2>
                {notification.body ? (
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{notification.body}</p>
                ) : null}
                <p className="mt-3 text-xs font-bold text-muted-foreground">
                  {new Date(notification.createdAt).toLocaleString("ar-DZ")}
                </p>
              </button>
            </form>
          ))}
        </section>
      )}
    </StudentLayoutShell>
  );
}
