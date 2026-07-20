"use client";

import { AlertCircle, CheckCircle2, Loader2, Save } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type {
  AcademicLevel,
  DashboardUser,
  UserPreferences,
} from "@/lib/home-types";
import { levelLabels } from "@/lib/home-types";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

type ProfileFormProps = {
  readonly user: DashboardUser;
  readonly preferences: UserPreferences;
};

type FormStatus =
  | { readonly type: "idle"; readonly message: "" }
  | { readonly type: "success"; readonly message: string }
  | { readonly type: "error"; readonly message: string };

const academicLevels: readonly AcademicLevel[] = ["L1", "L2", "L3", "M1", "M2"];
const inputClasses =
  "h-12 w-full rounded-lg border border-input bg-background px-4 text-base text-foreground transition placeholder:text-muted-foreground/65 focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/20";

const isValidUrl = (value: string) => {
  if (!value) {
    return true;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export function ProfileForm({ user, preferences }: ProfileFormProps) {
  const [fullName, setFullName] = useState(user.fullName);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl ?? "");
  const [university, setUniversity] = useState(preferences.university ?? "");
  const [academicLevel, setAcademicLevel] = useState<AcademicLevel | "">(
    preferences.academicLevel ?? "",
  );
  const [status, setStatus] = useState<FormStatus>({
    type: "idle",
    message: "",
  });
  const [pending, setPending] = useState(false);

  const profileIncomplete = !preferences.university || !preferences.academicLevel;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextFullName = fullName.trim();
    const nextAvatarUrl = avatarUrl.trim();
    const nextUniversity = university.trim();

    if (!nextFullName || !nextUniversity || !academicLevel) {
      setStatus({
        type: "error",
        message: "Full name, university, and academic level are required.",
      });
      return;
    }

    if (!isValidUrl(nextAvatarUrl)) {
      setStatus({
        type: "error",
        message: "Avatar must be a valid http or https URL.",
      });
      return;
    }

    setPending(true);
    setStatus({ type: "idle", message: "" });

    const supabase = createClient();
    const { error: userError } = await supabase
      .from("users")
      .update({
        full_name: nextFullName,
        avatar_url: nextAvatarUrl || null,
      })
      .eq("id", user.id);

    if (userError) {
      setPending(false);
      setStatus({
        type: "error",
        message: "Could not update your profile. Try again in a moment.",
      });
      return;
    }

    const { error: preferencesError } = await supabase
      .from("user_preferences")
      .upsert(
        {
          user_id: user.id,
          university: nextUniversity,
          academic_level: academicLevel,
        },
        { onConflict: "user_id" },
      );

    setPending(false);

    if (preferencesError) {
      setStatus({
        type: "error",
        message: "Profile saved, but academic preferences could not be updated.",
      });
      return;
    }

    setStatus({
      type: "success",
      message: "Profile updated successfully.",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-background p-5 shadow-sm sm:p-6"
      noValidate
    >
      {profileIncomplete ? (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-900">
          Complete this profile to unlock the dashboard.
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <label
            htmlFor="fullName"
            className="mb-2 block text-sm font-bold text-muted-foreground"
          >
            Full name
          </label>
          <input
            id="fullName"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className={inputClasses}
            required
            autoComplete="name"
          />
        </div>

        <div>
          <label
            htmlFor="avatarUrl"
            className="mb-2 block text-sm font-bold text-muted-foreground"
          >
            Avatar URL
          </label>
          <input
            id="avatarUrl"
            value={avatarUrl}
            onChange={(event) => setAvatarUrl(event.target.value)}
            className={inputClasses}
            placeholder="https://..."
            inputMode="url"
            dir="ltr"
          />
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            TODO: connect this to the backend avatar upload flow when storage is
            exposed.
          </p>
        </div>

        <div>
          <label
            htmlFor="university"
            className="mb-2 block text-sm font-bold text-muted-foreground"
          >
            University
          </label>
          <input
            id="university"
            value={university}
            onChange={(event) => setUniversity(event.target.value)}
            className={inputClasses}
            required
            placeholder="University of Ghardaia"
          />
        </div>

        <div>
          <label
            htmlFor="academicLevel"
            className="mb-2 block text-sm font-bold text-muted-foreground"
          >
            Academic level
          </label>
          <select
            id="academicLevel"
            value={academicLevel}
            onChange={(event) =>
              setAcademicLevel(event.target.value as AcademicLevel | "")
            }
            className={inputClasses}
            required
          >
            <option value="">Choose a level</option>
            {academicLevels.map((level) => (
              <option key={level} value={level}>
                {levelLabels[level]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {status.message ? (
        <div
          role={status.type === "error" ? "alert" : "status"}
          className={cn(
            "mt-5 flex items-start gap-3 rounded-lg border p-4 text-sm font-semibold leading-6",
            status.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-red-200 bg-red-50 text-red-900",
          )}
        >
          {status.type === "success" ? (
            <CheckCircle2 className="size-5" aria-hidden="true" />
          ) : (
            <AlertCircle className="size-5" aria-hidden="true" />
          )}
          {status.message}
        </div>
      ) : null}

      <div className="mt-6 flex justify-end">
        <Button type="submit" disabled={pending} className="h-11 gap-2 px-5">
          {pending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Save className="size-4" aria-hidden="true" />
          )}
          {pending ? "Saving..." : "Save profile"}
        </Button>
      </div>
    </form>
  );
}
