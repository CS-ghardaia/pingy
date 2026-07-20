import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  BadgeSummary,
  CommentSummary,
  ExerciseDetail,
  ExerciseSummary,
  ModuleSummary,
  NotificationSummary,
  ReputationEventSummary,
  ResourceDetail,
  ResourceSummary,
  ResourceTypeOption,
  StudentPreference,
  StudentUser,
  SubmissionSummary,
  TagSummary,
  UniversityOption,
} from "@/lib/student/types";
import type { Difficulty, Json, ResourceStatus, SubmissionStatus } from "@/types/database";

type UserRow = {
  readonly id: string;
  readonly username: string | null;
  readonly full_name: string;
  readonly avatar_url: string | null;
  readonly bio: string | null;
  readonly role: string;
  readonly reputation_score: number;
};

type PreferenceRow = {
  readonly university_id: string | null;
  readonly academic_level: string | null;
  readonly universities: { readonly name: string; readonly name_ar: string | null } | null;
};

type ModuleRow = {
  readonly id: string;
  readonly name: string;
  readonly description: string | null;
  readonly level: string;
  readonly semester: string;
  readonly order_index: number;
};

type ResourceRow = {
  readonly id: string;
  readonly title: string;
  readonly description: string | null;
  readonly module_id: string;
  readonly resource_type: string;
  readonly file_url: string;
  readonly mime_type: string | null;
  readonly thumbnail_url: string | null;
  readonly uploaded_by: string | null;
  readonly status: ResourceStatus;
  readonly is_featured: boolean;
  readonly views: number;
  readonly downloads: number;
  readonly average_rating: number;
  readonly rating_count: number;
  readonly comment_count: number;
  readonly created_at: string;
  readonly modules: ModuleRow | null;
  readonly resource_types: {
    readonly code: string;
    readonly name_ar: string;
    readonly icon: string | null;
  } | null;
  readonly users: Pick<UserRow, "full_name"> | null;
};

type ResourceDetailRow = ResourceRow & {
  readonly storage_provider: string;
  readonly file_id: string;
  readonly file_size_bytes: number | null;
};

type ResourceTagRow = {
  readonly tags: TagSummary | null;
};

type CommentRow = {
  readonly id: string;
  readonly resource_id: string;
  readonly user_id: string;
  readonly parent_comment_id: string | null;
  readonly content: string;
  readonly is_edited: boolean;
  readonly created_at: string;
  readonly users: {
    readonly full_name: string;
    readonly avatar_url: string | null;
  } | null;
};

type ExerciseRow = {
  readonly resource_id: string;
  readonly difficulty: Difficulty;
  readonly language: string;
  readonly starter_code: string | null;
  readonly test_cases: Json;
  readonly time_limit_ms: number;
  readonly resources: ResourceRow | null;
};

type SubmissionRow = {
  readonly id: string;
  readonly resource_id: string;
  readonly code: string;
  readonly status: SubmissionStatus;
  readonly score: number | null;
  readonly runtime_ms: number | null;
  readonly error_message: string | null;
  readonly submitted_at: string;
};

const resourceSelect = `
  id,title,description,module_id,resource_type,file_url,mime_type,thumbnail_url,
  uploaded_by,status,is_featured,views,downloads,average_rating,rating_count,
  comment_count,created_at,
  modules(id,name,description,level,semester,order_index),
  resource_types(code,name_ar,icon),
  users(full_name)
`;

const resourceDetailSelect = `
  id,title,description,module_id,resource_type,storage_provider,file_url,file_id,
  file_size_bytes,mime_type,thumbnail_url,uploaded_by,status,is_featured,views,
  downloads,average_rating,rating_count,comment_count,created_at,
  modules(id,name,description,level,semester,order_index),
  resource_types(code,name_ar,icon),
  users(full_name)
`;

const toStudentUser = (
  authUser: { readonly id: string; readonly email?: string },
  row: UserRow,
): StudentUser => ({
  id: authUser.id,
  email: authUser.email ?? "",
  username: row.username,
  fullName: row.full_name,
  avatarUrl: row.avatar_url,
  bio: row.bio,
  reputationScore: row.reputation_score,
});

const toPreference = (row: PreferenceRow | null): StudentPreference => ({
  universityId: row?.university_id ?? null,
  universityName: row?.universities?.name_ar ?? row?.universities?.name ?? null,
  academicLevel: row?.academic_level ?? null,
});

export const isPreferenceComplete = (preference: StudentPreference): boolean =>
  Boolean(preference.universityId && preference.academicLevel);

const toModule = (row: ModuleRow, resourceCount = 0): ModuleSummary => ({
  id: row.id,
  name: row.name,
  description: row.description,
  level: row.level,
  semester: row.semester,
  orderIndex: row.order_index,
  resourceCount,
});

const toResource = (row: ResourceRow): ResourceSummary => ({
  id: row.id,
  title: row.title,
  description: row.description,
  moduleId: row.module_id,
  moduleName: row.modules?.name ?? "وحدة غير محددة",
  moduleLevel: row.modules?.level ?? "",
  moduleSemester: row.modules?.semester ?? "",
  resourceType: row.resource_type,
  resourceTypeName: row.resource_types?.name_ar ?? row.resource_type,
  fileUrl: row.file_url,
  mimeType: row.mime_type,
  thumbnailUrl: row.thumbnail_url,
  uploadedBy: row.uploaded_by,
  authorName: row.users?.full_name ?? "طالب في Pingy",
  status: row.status,
  isFeatured: row.is_featured,
  views: row.views,
  downloads: row.downloads,
  averageRating: Number(row.average_rating),
  ratingCount: row.rating_count,
  commentCount: row.comment_count,
  createdAt: row.created_at,
});

const toComment = (row: CommentRow): CommentSummary => ({
  id: row.id,
  resourceId: row.resource_id,
  userId: row.user_id,
  parentCommentId: row.parent_comment_id,
  content: row.content,
  isEdited: row.is_edited,
  createdAt: row.created_at,
  authorName: row.users?.full_name ?? "طالب",
  authorAvatarUrl: row.users?.avatar_url ?? null,
});

const stringifyJson = (value: Json): string => {
  if (typeof value === "string") {
    return value;
  }

  return JSON.stringify(value, null, 2);
};

export async function getStudentContext(options?: {
  readonly requireOnboarding?: boolean;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login");
  }

  const [{ data: userRow, error: userError }, { data: preferenceRow, error: preferenceError }] =
    await Promise.all([
      supabase
        .from("users")
        .select("id,username,full_name,avatar_url,bio,role,reputation_score")
        .eq("id", authUser.id)
        .maybeSingle<UserRow>(),
      supabase
        .from("user_preferences")
        .select("university_id,academic_level,universities(name,name_ar)")
        .eq("user_id", authUser.id)
        .maybeSingle<PreferenceRow>(),
    ]);

  if (userError || !userRow) {
    return {
      user: {
        id: authUser.id,
        email: authUser.email ?? "",
        username: null,
        fullName: authUser.email ?? "طالب",
        avatarUrl: null,
        bio: null,
        reputationScore: 0,
      },
      preference: {
        universityId: null,
        universityName: null,
        academicLevel: null,
      },
    };
  }

  if (preferenceError) {
    return {
      user: toStudentUser(authUser, userRow),
      preference: {
        universityId: null,
        universityName: null,
        academicLevel: null,
      },
    };
  }

  if (userRow.role !== "student") {
    redirect("/");
  }

  const preference = toPreference(preferenceRow);

  if (options?.requireOnboarding !== false && !isPreferenceComplete(preference)) {
    redirect("/onboarding");
  }

  return {
    user: toStudentUser(authUser, userRow),
    preference,
  };
}

export async function getOnboardingLookups() {
  const supabase = await createServerSupabaseClient();
  const [{ data: universities }, { data: levels }] = await Promise.all([
    supabase
      .from("universities")
      .select("id,name,name_ar,city")
      .order("name", { ascending: true })
      .returns<UniversityOption[]>(),
    supabase
      .from("academic_levels")
      .select("code,name_ar,name_en,order_index")
      .eq("is_active", true)
      .order("order_index", { ascending: true })
      .returns<
        {
          readonly code: string;
          readonly name_ar: string;
          readonly name_en: string;
          readonly order_index: number;
        }[]
      >(),
  ]);

  return {
    universities: universities ?? [],
    levels: (levels ?? []).map((level) => ({
      code: level.code,
      nameAr: level.name_ar,
      nameEn: level.name_en,
      orderIndex: level.order_index,
    })),
  };
}

export async function getResourceTypes(): Promise<readonly ResourceTypeOption[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("resource_types")
    .select("code,name_ar,name_en,icon,order_index")
    .eq("is_active", true)
    .order("order_index", { ascending: true })
    .returns<
      {
        readonly code: string;
        readonly name_ar: string;
        readonly name_en: string;
        readonly icon: string | null;
        readonly order_index: number;
      }[]
    >();

  if (error) {
    return [];
  }

  return (data ?? []).map((type) => ({
    code: type.code,
    nameAr: type.name_ar,
    nameEn: type.name_en,
    icon: type.icon,
    orderIndex: type.order_index,
  }));
}

export async function getReportReasons() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("report_reasons")
    .select("code,name_ar,name_en")
    .order("code", { ascending: true })
    .returns<{ readonly code: string; readonly name_ar: string; readonly name_en: string }[]>();

  if (error) {
    return [];
  }

  return (data ?? []).map((reason) => ({
    code: reason.code,
    nameAr: reason.name_ar,
    nameEn: reason.name_en,
    orderIndex: 0,
  }));
}

export async function getModulesForLevel(level: string | null): Promise<readonly ModuleSummary[]> {
  if (!level) {
    return [];
  }

  const supabase = await createServerSupabaseClient();
  try {
    const [{ data: modules, error }, { data: resources }] = await Promise.all([
      supabase
        .from("modules")
        .select("id,name,description,level,semester,order_index")
        .eq("level", level)
        .eq("is_active", true)
        .order("semester", { ascending: true })
        .order("order_index", { ascending: true })
        .returns<ModuleRow[]>(),
      supabase
        .from("resources")
        .select("module_id")
        .eq("status", "approved")
        .is("deleted_at", null)
        .returns<{ readonly module_id: string }[]>(),
    ]);

    if (error) {
      return [];
    }

    const countByModule = new Map<string, number>();
    (resources ?? []).forEach((resource) => {
      countByModule.set(resource.module_id, (countByModule.get(resource.module_id) ?? 0) + 1);
    });

    return (modules ?? []).map((module) => toModule(module, countByModule.get(module.id) ?? 0));
  } catch {
    return [];
  }
}

export async function getApprovedResources(options?: {
  readonly featured?: boolean;
  readonly limit?: number;
  readonly moduleId?: string;
  readonly resourceType?: string;
}): Promise<readonly ResourceSummary[]> {
  const supabase = await createServerSupabaseClient();
  try {
    let query = supabase
      .from("resources")
      .select(resourceSelect)
      .eq("status", "approved")
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (options?.featured) {
      query = query.eq("is_featured", true);
    }

    if (options?.moduleId) {
      query = query.eq("module_id", options.moduleId);
    }

    if (options?.resourceType) {
      query = query.eq("resource_type", options.resourceType);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query.returns<ResourceRow[]>();

    if (error) {
      return [];
    }

    return (data ?? []).map(toResource);
  } catch {
    return [];
  }
}

export async function getModuleById(moduleId: string): Promise<ModuleSummary | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("modules")
    .select("id,name,description,level,semester,order_index")
    .eq("id", moduleId)
    .eq("is_active", true)
    .maybeSingle<ModuleRow>();

  if (error) {
    return null;
  }

  return data ? toModule(data) : null;
}

export async function getModuleResources(moduleId: string, userId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("resources")
    .select(resourceSelect)
    .eq("module_id", moduleId)
    .is("deleted_at", null)
    .or(`status.eq.approved,and(uploaded_by.eq.${userId},status.eq.pending)`)
    .order("created_at", { ascending: false })
    .returns<ResourceRow[]>();

  if (error) {
    return [];
  }

  return (data ?? []).map(toResource);
}

export async function getResourceDetail(resourceId: string, userId: string): Promise<ResourceDetail | null> {
  const supabase = await createServerSupabaseClient();
  const [
    { data: resource, error: resourceError },
    { data: tagRows },
    { data: commentRows },
    { data: rating },
    { data: favorite },
  ] = await Promise.all([
    supabase
      .from("resources")
      .select(resourceDetailSelect)
      .eq("id", resourceId)
      .is("deleted_at", null)
      .maybeSingle<ResourceDetailRow>(),
    supabase
      .from("resource_tags")
      .select("tags(id,name,slug)")
      .eq("resource_id", resourceId)
      .returns<ResourceTagRow[]>(),
    supabase
      .from("resource_comments")
      .select("id,resource_id,user_id,parent_comment_id,content,is_edited,created_at,users(full_name,avatar_url)")
      .eq("resource_id", resourceId)
      .is("deleted_at", null)
      .order("created_at", { ascending: true })
      .returns<CommentRow[]>(),
    supabase
      .from("resource_ratings")
      .select("rating")
      .eq("resource_id", resourceId)
      .eq("user_id", userId)
      .maybeSingle<{ readonly rating: number }>(),
    supabase
      .from("resource_favorites")
      .select("resource_id")
      .eq("resource_id", resourceId)
      .eq("user_id", userId)
      .maybeSingle<{ readonly resource_id: string }>(),
  ]);

  if (resourceError || !resource) {
    return null;
  }

  return {
    ...toResource(resource),
    storageProvider: resource.storage_provider,
    fileId: resource.file_id,
    fileSizeBytes: resource.file_size_bytes,
    tags: (tagRows ?? []).flatMap((row) => (row.tags ? [row.tags] : [])),
    comments: (commentRows ?? []).map(toComment),
    myRating: rating?.rating ?? null,
    isFavorite: Boolean(favorite),
  };
}

export async function getExercises(): Promise<readonly ExerciseSummary[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("exercise_details")
    .select(`resource_id,difficulty,language,resources(${resourceSelect})`)
    .eq("resources.status", "approved")
    .returns<ExerciseRow[]>();

  if (error) {
    return [];
  }

  return (data ?? []).flatMap((row) =>
    row.resources
      ? [
          {
            ...toResource(row.resources),
            difficulty: row.difficulty,
            language: row.language,
          },
        ]
      : [],
  );
}

export async function getExerciseDetail(resourceId: string, userId: string): Promise<{
  readonly exercise: ExerciseDetail | null;
  readonly submissions: readonly SubmissionSummary[];
}> {
  const supabase = await createServerSupabaseClient();
  const [{ data: exerciseRow, error }, { data: submissions }] = await Promise.all([
    supabase
      .from("exercise_details")
      .select(`resource_id,difficulty,language,starter_code,test_cases,time_limit_ms,resources(${resourceDetailSelect})`)
      .eq("resource_id", resourceId)
      .maybeSingle<ExerciseRow>(),
    supabase
      .from("exercise_submissions")
      .select("id,resource_id,code,status,score,runtime_ms,error_message,submitted_at")
      .eq("resource_id", resourceId)
      .eq("user_id", userId)
      .order("submitted_at", { ascending: false })
      .limit(8)
      .returns<SubmissionRow[]>(),
  ]);

  if (error) {
    return { exercise: null, submissions: [] };
  }

  if (!exerciseRow?.resources) {
    return { exercise: null, submissions: [] };
  }

  const base = await getResourceDetail(resourceId, userId);

  return {
    exercise: base
      ? {
          ...base,
          difficulty: exerciseRow.difficulty,
          language: exerciseRow.language,
          starterCode: exerciseRow.starter_code,
          testCases: stringifyJson(exerciseRow.test_cases),
          timeLimitMs: exerciseRow.time_limit_ms,
        }
      : null,
    submissions: (submissions ?? []).map((submission) => ({
      id: submission.id,
      resourceId: submission.resource_id,
      code: submission.code,
      status: submission.status,
      score: submission.score,
      runtimeMs: submission.runtime_ms,
      errorMessage: submission.error_message,
      submittedAt: submission.submitted_at,
    })),
  };
}

export async function searchResources(params: {
  readonly query?: string;
  readonly level?: string;
  readonly semester?: string;
  readonly type?: string;
  readonly tag?: string;
}) {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from("resources")
    .select(resourceSelect)
    .eq("status", "approved")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (params.query) {
    query = query.textSearch("search_vector", params.query, {
      type: "websearch",
      config: "simple",
    });
  }

  if (params.type) {
    query = query.eq("resource_type", params.type);
  }

  const { data, error } = await query.returns<ResourceRow[]>();

  if (error) {
    return [];
  }

  let resources = (data ?? []).map(toResource);

  if (params.level) {
    resources = resources.filter((resource) => resource.moduleLevel === params.level);
  }

  if (params.semester) {
    resources = resources.filter((resource) => resource.moduleSemester === params.semester);
  }

  if (params.tag) {
    const { data: tagged } = await supabase
      .from("resource_tags")
      .select("resource_id,tags(slug)")
      .eq("tags.slug", params.tag)
      .returns<{ readonly resource_id: string; readonly tags: { readonly slug: string } | null }[]>();
    const ids = new Set((tagged ?? []).map((row) => row.resource_id));
    resources = resources.filter((resource) => ids.has(resource.id));
  }

  return resources;
}

export async function getProfileData(userId: string) {
  const supabase = await createServerSupabaseClient();
  const [
    { data: uploaded },
    { data: favorites },
    { data: badges },
    { data: events },
  ] = await Promise.all([
    supabase
      .from("resources")
      .select(resourceSelect)
      .eq("uploaded_by", userId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .returns<ResourceRow[]>(),
    supabase
      .from("resource_favorites")
      .select(`resources(${resourceSelect})`)
      .eq("user_id", userId)
      .returns<{ readonly resources: ResourceRow | null }[]>(),
    supabase
      .from("user_badges")
      .select("unlocked_at,badges(id,code,name_ar,description,icon)")
      .eq("user_id", userId)
      .returns<
        {
          readonly unlocked_at: string;
          readonly badges: {
            readonly id: string;
            readonly code: string;
            readonly name_ar: string;
            readonly description: string | null;
            readonly icon: string | null;
          } | null;
        }[]
      >(),
    supabase
      .from("reputation_events")
      .select("id,event_type,points,created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20)
      .returns<ReputationEventSummary[]>(),
  ]);

  return {
    uploaded: (uploaded ?? []).map(toResource),
    favorites: (favorites ?? []).flatMap((row) => (row.resources ? [toResource(row.resources)] : [])),
    badges: (badges ?? []).flatMap<BadgeSummary>((row) =>
      row.badges
        ? [
            {
              id: row.badges.id,
              code: row.badges.code,
              nameAr: row.badges.name_ar,
              description: row.badges.description,
              icon: row.badges.icon,
              unlockedAt: row.unlocked_at,
            },
          ]
        : [],
    ),
    events: events ?? [],
  };
}

export async function getPublicProfile(username: string) {
  const supabase = await createServerSupabaseClient();
  const { data: user, error } = await supabase
    .from("users")
    .select("id,username,full_name,avatar_url,bio,role,reputation_score")
    .eq("username", username)
    .maybeSingle<UserRow>();

  if (error) {
    return null;
  }

  if (!user) {
    return null;
  }

  const [{ data: resources }, { data: badges }] = await Promise.all([
    supabase
      .from("resources")
      .select(resourceSelect)
      .eq("uploaded_by", user.id)
      .eq("status", "approved")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .returns<ResourceRow[]>(),
    supabase
      .from("user_badges")
      .select("unlocked_at,badges(id,code,name_ar,description,icon)")
      .eq("user_id", user.id)
      .returns<
        {
          readonly unlocked_at: string;
          readonly badges: {
            readonly id: string;
            readonly code: string;
            readonly name_ar: string;
            readonly description: string | null;
            readonly icon: string | null;
          } | null;
        }[]
      >(),
  ]);

  return {
    user: {
      id: user.id,
      username: user.username,
      fullName: user.full_name,
      avatarUrl: user.avatar_url,
      bio: user.bio,
      reputationScore: user.reputation_score,
    },
    resources: (resources ?? []).map(toResource),
    badges: (badges ?? []).flatMap<BadgeSummary>((row) =>
      row.badges
        ? [
            {
              id: row.badges.id,
              code: row.badges.code,
              nameAr: row.badges.name_ar,
              description: row.badges.description,
              icon: row.badges.icon,
              unlockedAt: row.unlocked_at,
            },
          ]
        : [],
    ),
  };
}

export async function getLeaderboard() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("users")
    .select("id,username,full_name,avatar_url,bio,role,reputation_score")
    .eq("role", "student")
    .order("reputation_score", { ascending: false })
    .limit(50)
    .returns<UserRow[]>();

  if (error) {
    return [];
  }

  return data ?? [];
}

export async function getNotifications(userId: string): Promise<readonly NotificationSummary[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("id,type,title,body,is_read,created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .returns<
      {
        readonly id: string;
        readonly type: string;
        readonly title: string;
        readonly body: string | null;
        readonly is_read: boolean;
        readonly created_at: string;
      }[]
    >();

  if (error) {
    return [];
  }

  return (data ?? []).map((notification) => ({
    id: notification.id,
    type: notification.type,
    title: notification.title,
    body: notification.body,
    isRead: notification.is_read,
    createdAt: notification.created_at,
  }));
}

export async function getAllTags(): Promise<readonly TagSummary[]> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("tags")
    .select("id,name,slug")
    .order("name", { ascending: true })
    .returns<TagSummary[]>();

  return data ?? [];
}
