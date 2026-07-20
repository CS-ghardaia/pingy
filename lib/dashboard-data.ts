import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type {
  AcademicLevel,
  DashboardUser,
  ModuleSummary,
  ResourceStatus,
  ResourceSummary,
  ResourceType,
  SemesterType,
  UserPreferences,
} from "@/lib/home-types";
import { createClient } from "@/utils/supabase/server";

type UserRow = {
  readonly id: string;
  readonly full_name: string;
  readonly avatar_url: string | null;
};

type PreferencesRow = {
  readonly university: string | null;
  readonly academic_level: AcademicLevel | null;
};

type ModuleRow = {
  readonly id: string;
  readonly name: string;
  readonly description: string | null;
  readonly level: AcademicLevel;
  readonly semester: SemesterType;
};

type ResourceRow = {
  readonly id: string;
  readonly title: string;
  readonly description: string | null;
  readonly module_id: string;
  readonly resource_type: ResourceType;
  readonly drive_url: string;
  readonly status: ResourceStatus;
  readonly created_at: string;
  readonly modules: ModuleRow | null;
  readonly users: Pick<UserRow, "full_name"> | null;
};

const resourceSelect =
  "id,title,description,module_id,resource_type,drive_url,status,created_at,modules(id,name,description,level,semester),users(full_name)";

const toDashboardUser = (
  authUser: { readonly id: string; readonly email?: string },
  userRow: UserRow | null,
): DashboardUser => ({
  id: authUser.id,
  email: authUser.email ?? "",
  fullName: userRow?.full_name ?? authUser.email?.split("@")[0] ?? "طالب",
  avatarUrl: userRow?.avatar_url ?? null,
});

const toModuleSummary = (row: ModuleRow): ModuleSummary => ({
  id: row.id,
  name: row.name,
  description: row.description,
  level: row.level,
  semester: row.semester,
});

const toResourceSummary = (row: ResourceRow): ResourceSummary => ({
  id: row.id,
  title: row.title,
  description: row.description,
  moduleId: row.module_id,
  moduleName: row.modules?.name ?? "مقرر غير محدد",
  moduleLevel: row.modules?.level ?? "L1",
  moduleSemester: row.modules?.semester ?? "S1",
  resourceType: row.resource_type,
  driveUrl: row.drive_url,
  status: row.status,
  createdAt: row.created_at,
  authorName: row.users?.full_name ?? "طالب في Pinggly",
});

export async function getDashboardContext() {
  const supabase = createClient(await cookies());
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/auth/login");
  }

  const [{ data: userRow }, { data: preferencesRow }] = await Promise.all([
    supabase
      .from("users")
      .select("id,full_name,avatar_url")
      .eq("id", authUser.id)
      .maybeSingle<UserRow>(),
    supabase
      .from("user_preferences")
      .select("university,academic_level")
      .eq("user_id", authUser.id)
      .maybeSingle<PreferencesRow>(),
  ]);

  const preferences: UserPreferences = {
    university: preferencesRow?.university ?? null,
    academicLevel: preferencesRow?.academic_level ?? null,
  };

  return {
    user: toDashboardUser(authUser, userRow),
    preferences,
    complete: Boolean(preferences.university && preferences.academicLevel),
  };
}

export async function getModules(): Promise<readonly ModuleSummary[]> {
  const supabase = createClient(await cookies());
  const { data } = await supabase
    .from("modules")
    .select("id,name,description,level,semester")
    .order("level", { ascending: true })
    .order("semester", { ascending: true })
    .order("name", { ascending: true })
    .returns<ModuleRow[]>();

  return (data ?? []).map(toModuleSummary);
}

export async function getApprovedResources(): Promise<readonly ResourceSummary[]> {
  const supabase = createClient(await cookies());
  const { data } = await supabase
    .from("resources")
    .select(resourceSelect)
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .returns<ResourceRow[]>();

  return (data ?? []).map(toResourceSummary);
}

export async function getResourceById(
  id: string,
): Promise<ResourceSummary | null> {
  const supabase = createClient(await cookies());
  const { data } = await supabase
    .from("resources")
    .select(resourceSelect)
    .eq("id", id)
    .maybeSingle<ResourceRow>();

  return data ? toResourceSummary(data) : null;
}

export async function getMyResources(
  userId: string,
): Promise<readonly ResourceSummary[]> {
  const supabase = createClient(await cookies());
  const { data } = await supabase
    .from("resources")
    .select(resourceSelect)
    .eq("uploaded_by", userId)
    .order("created_at", { ascending: false })
    .returns<ResourceRow[]>();

  return (data ?? []).map(toResourceSummary);
}
