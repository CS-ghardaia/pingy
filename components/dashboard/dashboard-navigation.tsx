"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpenCheck,
  Compass,
  Files,
  LayoutDashboard,
  UserRound,
} from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/home", label: "نظرة عامة", icon: LayoutDashboard },
  { href: "/home/curriculum", label: "المقرر السنوي", icon: BookOpenCheck },
  { href: "/home/browse", label: "استكشف", icon: Compass },
  { href: "/home/my-uploads", label: "ملفاتي", icon: Files },
  { href: "/home/profile", label: "ملفي الشخصي", icon: UserRound },
] as const;

const isActivePath = (pathname: string, href: string) => {
  if (href === "/home") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
};

export function DesktopDashboardNavigation() {
  const pathname = usePathname();

  return (
    <nav className="mt-8 space-y-2" aria-label="تنقل لوحة الطالب">
      {navItems.map((item) => {
        const active = isActivePath(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group relative flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-extrabold transition-all",
              active
                ? "bg-primary/10 text-foreground shadow-sm ring-1 ring-primary/20"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <span
              className={cn(
                "flex size-9 items-center justify-center rounded-lg transition",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground group-hover:text-foreground",
              )}
            >
              <item.icon className="size-4" aria-hidden="true" />
            </span>
            <span>{item.label}</span>
            {active ? (
              <span className="absolute inset-y-2 left-2 w-1 rounded-full bg-primary" />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileDashboardNavigation() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-background/95 px-2 py-2 backdrop-blur lg:hidden"
      aria-label="تنقل لوحة الطالب على الهاتف"
    >
      {navItems.map((item) => {
        const active = isActivePath(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-extrabold transition",
              active
                ? "bg-primary/10 text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <item.icon
              className={cn("size-4", active ? "text-primary" : undefined)}
              aria-hidden="true"
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
