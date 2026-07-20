"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import Link from "next/link";
import {
  Bell,
  BookOpenCheck,
  Compass,
  FolderOpen,
  LayoutDashboard,
  Menu,
  Settings,
  UserRound,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/home", label: "نظرة عامة", icon: LayoutDashboard },
  { href: "/modules", label: "المقرر السنوي", icon: BookOpenCheck },
  { href: "/explore", label: "استكشف", icon: Compass },
  { href: "/my-files", label: "ملفاتي", icon: FolderOpen },
  { href: "/profile", label: "ملفي الشخصي", icon: UserRound },
  { href: "/notifications", label: "الإشعارات", icon: Bell },
  { href: "/settings", label: "الإعدادات", icon: Settings },
] as const;

export function StudentMobileDrawer({
  activeHref,
}: {
  readonly activeHref: string;
}) {
  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger asChild>
        <Button variant="outline" className="h-11 gap-2 rounded-xl lg:hidden">
          <Menu className="size-4" aria-hidden="true" />
          القائمة
        </Button>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-[#111111]/45 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
        <DialogPrimitive.Content
          className="fixed bottom-0 right-0 top-0 z-50 w-[min(86vw,21rem)] border-l border-border bg-background p-5 shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right"
          dir="rtl"
        >
          <div className="mb-6 flex items-center justify-between">
            <DialogPrimitive.Title className="text-xl font-extrabold">
              Pingy
            </DialogPrimitive.Title>
            <DialogPrimitive.Close asChild>
              <button
                type="button"
                className="flex size-10 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label="إغلاق القائمة"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </DialogPrimitive.Close>
          </div>
          <nav className="space-y-2" aria-label="قائمة لوحة الطالب">
            {links.map((item) => (
              <DialogPrimitive.Close asChild key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-bold transition",
                    item.href === activeHref
                      ? "bg-[#111111] text-white"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <item.icon className="size-4" aria-hidden="true" />
                  {item.label}
                </Link>
              </DialogPrimitive.Close>
            ))}
          </nav>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
