"use client";

import { FriendlyError } from "@/components/dashboard/student-common";

export default function SettingsError({ reset }: { readonly reset: () => void }) {
  return <FriendlyError reset={reset} />;
}
