"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getStudentContext } from "@/lib/student/queries";
import type { ActionState } from "@/lib/student/action-state";
import type { Difficulty } from "@/types/database";

const valueOf = (formData: FormData, key: string): string => {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
};

const success = (message: string): ActionState => ({ status: "success", message });
const failure = (message: string): ActionState => ({ status: "error", message });

export async function loginAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = valueOf(formData, "email");
  const password = valueOf(formData, "password");

  if (!email || !password) {
    return failure("أدخل البريد الإلكتروني وكلمة المرور.");
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return failure("بيانات الدخول غير صحيحة.");
  }

  redirect("/home");
}

export async function signupAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const fullName = valueOf(formData, "fullName");
  const email = valueOf(formData, "email");
  const password = valueOf(formData, "password");

  if (!fullName || !email || password.length < 8) {
    return failure("أكمل الاسم والبريد وكلمة مرور من 8 أحرف على الأقل.");
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) {
    return failure("تعذر إنشاء الحساب الآن. حاول مرة أخرى.");
  }

  if (data.session) {
    redirect("/onboarding");
  }

  return success("تم إنشاء الحساب. تحقق من بريدك الإلكتروني ثم سجل الدخول.");
}

export async function logoutAction(): Promise<void> {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function saveOnboardingAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { user } = await getStudentContext({ requireOnboarding: false });
  const universityId = valueOf(formData, "universityId");
  const academicLevel = valueOf(formData, "academicLevel");

  if (!universityId || !academicLevel) {
    return failure("اختر الجامعة والمستوى الدراسي.");
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("user_preferences").upsert(
    {
      user_id: user.id,
      university_id: universityId,
      academic_level: academicLevel,
    },
    { onConflict: "user_id" },
  );

  if (error) {
    return failure("تعذر حفظ الإعداد الأولي.");
  }

  redirect("/home");
}

export async function recordResourceViewAction(resourceId: string): Promise<ActionState> {
  const { user } = await getStudentContext();
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.rpc("record_resource_view", {
    p_resource_id: resourceId,
    p_user_id: user.id,
  });

  if (error) {
    return failure("تعذر تسجيل المشاهدة.");
  }

  return success("تم تسجيل المشاهدة.");
}

export async function downloadResourceAction(formData: FormData): Promise<void> {
  const resourceId = valueOf(formData, "resourceId");
  const fileUrl = valueOf(formData, "fileUrl");
  const { user } = await getStudentContext();

  if (!resourceId || !fileUrl) {
    redirect("/home");
  }

  const supabase = await createServerSupabaseClient();
  await supabase.rpc("record_resource_download", {
    p_resource_id: resourceId,
    p_user_id: user.id,
  });

  redirect(fileUrl);
}

export async function rateResourceAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { user } = await getStudentContext();
  const resourceId = valueOf(formData, "resourceId");
  const rating = Number(valueOf(formData, "rating"));

  if (!resourceId || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return failure("اختر تقييماً من 1 إلى 5.");
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("resource_ratings").upsert(
    { resource_id: resourceId, user_id: user.id, rating },
    { onConflict: "resource_id,user_id" },
  );

  if (error) {
    return failure("تعذر حفظ التقييم.");
  }

  revalidatePath(`/resources/${resourceId}`);
  return success("تم حفظ تقييمك.");
}

export async function toggleFavoriteAction(formData: FormData): Promise<void> {
  const { user } = await getStudentContext();
  const resourceId = valueOf(formData, "resourceId");
  const next = valueOf(formData, "next");
  const supabase = await createServerSupabaseClient();

  if (next === "add") {
    await supabase
      .from("resource_favorites")
      .upsert({ resource_id: resourceId, user_id: user.id });
  } else {
    await supabase
      .from("resource_favorites")
      .delete()
      .eq("resource_id", resourceId)
      .eq("user_id", user.id);
  }

  revalidatePath(`/resources/${resourceId}`);
}

export async function addCommentAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { user } = await getStudentContext();
  const resourceId = valueOf(formData, "resourceId");
  const parentCommentId = valueOf(formData, "parentCommentId");
  const content = valueOf(formData, "content");

  if (!resourceId || content.length < 2) {
    return failure("اكتب تعليقاً واضحاً أولاً.");
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("resource_comments").insert({
    resource_id: resourceId,
    user_id: user.id,
    parent_comment_id: parentCommentId || null,
    content,
  });

  if (error) {
    return failure("تعذر نشر التعليق.");
  }

  revalidatePath(`/resources/${resourceId}`);
  return success("تم نشر التعليق.");
}

export async function updateCommentAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const commentId = valueOf(formData, "commentId");
  const resourceId = valueOf(formData, "resourceId");
  const content = valueOf(formData, "content");

  if (!commentId || content.length < 2) {
    return failure("اكتب نص التعليق قبل الحفظ.");
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("resource_comments")
    .update({ content, is_edited: true })
    .eq("id", commentId);

  if (error) {
    return failure("تعذر تعديل التعليق.");
  }

  revalidatePath(`/resources/${resourceId}`);
  return success("تم تعديل التعليق.");
}

export async function deleteCommentAction(formData: FormData): Promise<void> {
  const commentId = valueOf(formData, "commentId");
  const resourceId = valueOf(formData, "resourceId");
  const supabase = await createServerSupabaseClient();

  await supabase
    .from("resource_comments")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", commentId);

  revalidatePath(`/resources/${resourceId}`);
}

export async function reportResourceAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { user } = await getStudentContext();
  const resourceId = valueOf(formData, "resourceId");
  const reason = valueOf(formData, "reason");
  const description = valueOf(formData, "description");

  if (!resourceId || !reason) {
    return failure("اختر سبب البلاغ.");
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("resource_reports").insert({
    resource_id: resourceId,
    reporter_id: user.id,
    reason,
    description: description || null,
  });

  if (error?.code === "23505") {
    return failure("لقد أبلغت مسبقاً عن هذا المورد.");
  }

  if (error) {
    return failure("تعذر إرسال البلاغ.");
  }

  return success("تم إرسال البلاغ للمراجعة.");
}

const parseDifficulty = (value: string): Difficulty => {
  if (value === "easy" || value === "medium" || value === "hard") {
    return value;
  }

  return "easy";
};

export async function uploadResourceAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { user } = await getStudentContext();
  const title = valueOf(formData, "title");
  const description = valueOf(formData, "description");
  const moduleId = valueOf(formData, "moduleId");
  const resourceType = valueOf(formData, "resourceType");
  const fileUrl = valueOf(formData, "fileUrl");
  const fileId = valueOf(formData, "fileId") || fileUrl;
  const mimeType = valueOf(formData, "mimeType") || null;
  const tagText = valueOf(formData, "tags");

  if (!title || !moduleId || !resourceType || !fileUrl) {
    return failure("أكمل العنوان والوحدة والنوع ورابط الملف.");
  }

  const supabase = await createServerSupabaseClient();
  const { data: resource, error } = await supabase
    .from("resources")
    .insert({
      title,
      description: description || null,
      module_id: moduleId,
      resource_type: resourceType,
      file_url: fileUrl,
      file_id: fileId,
      mime_type: mimeType,
      uploaded_by: user.id,
      status: "pending",
    })
    .select("id")
    .single<{ readonly id: string }>();

  if (error || !resource) {
    return failure("تعذر رفع المورد.");
  }

  if (resourceType === "exercise") {
    const language = valueOf(formData, "language") || "python";
    const starterCode = valueOf(formData, "starterCode");
    const testCases = valueOf(formData, "testCases") || "[]";
    const difficulty = parseDifficulty(valueOf(formData, "difficulty"));

    const { error: exerciseError } = await supabase.from("exercise_details").insert({
      resource_id: resource.id,
      difficulty,
      language,
      starter_code: starterCode || null,
      test_cases: testCases,
    });

    if (exerciseError) {
      return failure("تم إنشاء المورد لكن تعذر حفظ تفاصيل التمرين.");
    }
  }

  const tags = tagText
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 8);

  for (const tag of tags) {
    const slug = tag.toLowerCase().replace(/\s+/g, "-");
    const { data: savedTag } = await supabase
      .from("tags")
      .upsert({ name: tag, slug }, { onConflict: "slug" })
      .select("id")
      .single<{ readonly id: string }>();

    if (savedTag) {
      await supabase
        .from("resource_tags")
        .insert({ resource_id: resource.id, tag_id: savedTag.id });
    }
  }

  revalidatePath("/profile");
  return success("تم رفع المورد وهو الآن قيد المراجعة ولن يظهر للعامة حتى الموافقة.");
}

export async function submitExerciseAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { user } = await getStudentContext();
  const resourceId = valueOf(formData, "resourceId");
  const code = valueOf(formData, "code");

  if (!resourceId || !code) {
    return failure("اكتب الكود قبل التشغيل.");
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("exercise_submissions").insert({
    resource_id: resourceId,
    user_id: user.id,
    code,
    status: "queued",
  });

  if (error) {
    return failure("تعذر إرسال المحاولة.");
  }

  await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/api/exercises/run`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ resourceId }),
  }).catch(() => undefined);

  revalidatePath(`/exercises/${resourceId}`);
  return success("تم إرسال المحاولة إلى قائمة التنفيذ.");
}

export async function markNotificationReadAction(formData: FormData): Promise<void> {
  const { user } = await getStudentContext();
  const notificationId = valueOf(formData, "notificationId");
  const supabase = await createServerSupabaseClient();

  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .eq("user_id", user.id);

  revalidatePath("/notifications");
}
