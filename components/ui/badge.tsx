import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center gap-1 rounded-full border px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.02em] w-fit whitespace-nowrap shrink-0 transition-colors",
  {
    variants: {
      variant: {
        category:
          "border-transparent bg-[color:var(--neutral-100)] text-[color:var(--primary-black)] hover:bg-[color:var(--primary)]",
        outline:
          "border-[color:var(--outline)] bg-transparent text-[color:var(--neutral-400)]",
        dark: "border-transparent bg-[color:var(--primary-black)] text-[color:var(--primary)]",
      },
    },
    defaultVariants: {
      variant: "category",
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, className }))}
      {...props}
    />
  );
}

export { Badge, badgeVariants };