"use client";

import { FriendlyError } from "@/components/dashboard/student-common";

export default function ModulesError({ reset }: { readonly reset: () => void }) {
  return <FriendlyError reset={reset} />;
}
