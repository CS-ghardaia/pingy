"use client";

import { FriendlyError } from "@/components/dashboard/student-common";

export default function ProfileError({ reset }: { readonly reset: () => void }) {
  return <FriendlyError reset={reset} />;
}
