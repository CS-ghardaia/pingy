"use client";

import { FriendlyError } from "@/components/dashboard/student-common";

export default function ExploreError({ reset }: { readonly reset: () => void }) {
  return <FriendlyError reset={reset} />;
}
