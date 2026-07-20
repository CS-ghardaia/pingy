"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export type AuthField =
  | "fullName"
  | "email"
  | "password"
  | "confirmPassword"
  | "otp"
  | "university"
  | "academicYear";

export type AuthFormState = {
  readonly status: "idle" | "error" | "success" | "otp_sent";
  readonly message: string;
  readonly fieldErrors?: Partial<Record<AuthField, string>>;
  readonly email?: string;
  readonly fullName?: string;
};

export type StudentPreferences = {
  readonly university_id: string | null;
  readonly academic_level: string | null;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const academicYears = new Set([
  "الأولى ليسانس",
  "الثانية ليسانس",
  "الثالثة ليسانس",
  "ماستر 1",
  "ماستر 2",
]);

const academicYearMap: Record<string, "L1" | "L2" | "L3" | "M1" | "M2"> = {
  "الأولى ليسانس": "L1",
  "الثانية ليسانس": "L2",
  "الثالثة ليسانس": "L3",
  "ماستر 1": "M1",
  "ماستر 2": "M2",
};

const getFormValue = (formData: FormData, field: AuthField): string => {
  const value = formData.get(field);
  return typeof value === "string" ? value.trim() : "";
};

const errorState = (
  message: string,
  fieldErrors?: AuthFormState["fieldErrors"],
  values?: Pick<AuthFormState, "email" | "fullName">,
): AuthFormState => ({
  status: "error",
  message,
  fieldErrors,
  ...values,
});

const otpSentState = (
  message: string,
  values: Pick<AuthFormState, "email" | "fullName">,
): AuthFormState => ({
  status: "otp_sent",
  message,
  ...values,
});

const validateEmail = (email: string): string | undefined => {
  if (!email) {
    return "يرجى إدخال البريد الإلكتروني.";
  }

  if (!emailPattern.test(email)) {
    return "يرجى إدخال بريد إلكتروني صحيح.";
  }

  return undefined;
};

const validatePassword = (password: string): string | undefined => {
  if (!password) {
    return "يرجى إدخال كلمة المرور.";
  }

  if (password.length < 8) {
    return "كلمة المرور قصيرة جدا. يجب أن تتكون من 8 أحرف على الأقل.";
  }

  if (!/[A-Za-z\u0600-\u06FF]/.test(password) || !/\d/.test(password)) {
    return "كلمة المرور يجب أن تحتوي على أحرف وأرقام.";
  }

  return undefined;
};

const getAuthRedirectUrl = async (): Promise<string | undefined> => {
  const origin = (await headers()).get("origin");
  return origin ? `${origin}/auth/callback` : undefined;
};

const getStudentPreferences = async (
  userId: string,
): Promise<StudentPreferences | null> => {
  const supabase = createClient(await cookies());
  const { data } = await supabase
    .from("user_preferences")
    .select("university_id,academic_level")
    .eq("user_id", userId)
    .maybeSingle<StudentPreferences>();

  return data;
};

const areStudentPreferencesComplete = (
  preferences: StudentPreferences | null,
): boolean => Boolean(preferences?.university_id && preferences.academic_level);

export async function login(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = getFormValue(formData, "email");
  const password = getFormValue(formData, "password");
  const fieldErrors: Partial<Record<AuthField, string>> = {};

  const emailError = validateEmail(email);
  const passwordError = password ? undefined : "يرجى إدخال كلمة المرور.";

  if (emailError) {
    fieldErrors.email = emailError;
  }

  if (passwordError) {
    fieldErrors.password = passwordError;
  }

  if (Object.keys(fieldErrors).length > 0) {
    return errorState("تحقق من البيانات ثم حاول مرة أخرى.", fieldErrors);
  }

  const supabase = createClient(await cookies());
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return errorState("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
  }

  const preferences = await getStudentPreferences(data.user.id);

  if (!areStudentPreferencesComplete(preferences)) {
    redirect("/auth/complete");
  }

  redirect("/home");
}

export async function register(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const fullName = getFormValue(formData, "fullName");
  const email = getFormValue(formData, "email");
  const password = getFormValue(formData, "password");
  const confirmPassword = getFormValue(formData, "confirmPassword");
  const fieldErrors: Partial<Record<AuthField, string>> = {};

  if (!fullName) {
    fieldErrors.fullName = "يرجى إدخال الاسم الكامل.";
  }

  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);

  if (emailError) {
    fieldErrors.email = emailError;
  }

  if (passwordError) {
    fieldErrors.password = passwordError;
  }

  if (!confirmPassword) {
    fieldErrors.confirmPassword = "يرجى تأكيد كلمة المرور.";
  } else if (password !== confirmPassword) {
    fieldErrors.confirmPassword = "كلمتا المرور غير متطابقتين.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return errorState("تحقق من البيانات ثم حاول مرة أخرى.", fieldErrors, {
      email,
      fullName,
    });
  }

  const supabase = createClient(await cookies());
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: await getAuthRedirectUrl(),
    },
  });

  if (error) {
  console.error("Supabase SignUp Error:", error);

  return errorState(
    error.message,
    undefined,
    {
      email,
      fullName,
    },
  );
  }

  if (data.session) {
    redirect("/auth/complete");
  }

  return otpSentState("تم إرسال رمز التحقق إلى بريدك الإلكتروني.", {
    email,
    fullName,
  });
}

export async function verifyRegistrationOtp(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = getFormValue(formData, "email");
  const fullName = getFormValue(formData, "fullName");
  const otp = getFormValue(formData, "otp");
  const fieldErrors: Partial<Record<AuthField, string>> = {};

  const emailError = validateEmail(email);

  if (emailError) {
    fieldErrors.email = emailError;
  }

  if (!otp) {
    fieldErrors.otp = "يرجى إدخال رمز التحقق.";
  } else if (!/^\d{6}$/.test(otp)) {
    fieldErrors.otp = "رمز التحقق يجب أن يتكون من 6 أرقام.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return errorState("تحقق من رمز التحقق ثم حاول مرة أخرى.", fieldErrors, {
      email,
      fullName,
    });
  }

  const supabase = createClient(await cookies());
  const { error } = await supabase.auth.verifyOtp({
    email,
    token: otp,
    type: "signup",
  });

  if (error) {
    return errorState(
      "رمز التحقق غير صحيح أو انتهت صلاحيته. حاول مرة أخرى.",
      undefined,
      { email, fullName },
    );
  }

  redirect("/auth/complete");
}

export async function resendRegistrationOtp(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = getFormValue(formData, "email");
  const fullName = getFormValue(formData, "fullName");
  const emailError = validateEmail(email);

  if (emailError) {
    return errorState(emailError, { email: emailError }, { email, fullName });
  }

  const supabase = createClient(await cookies());
  const { error } = await supabase.auth.resend({
    email,
    type: "signup",
    options: {
      emailRedirectTo: await getAuthRedirectUrl(),
    },
  });

  if (error) {
    return errorState(
      "تعذر إعادة إرسال الرمز الآن. انتظر قليلا ثم حاول مرة أخرى.",
      undefined,
      { email, fullName },
    );
  }

  return otpSentState("تم إرسال رمز تحقق جديد إلى بريدك الإلكتروني.", {
    email,
    fullName,
  });
}

export async function completeProfile(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const university = getFormValue(formData, "university");
  const academicYear = getFormValue(formData, "academicYear");
  const fieldErrors: Partial<Record<AuthField, string>> = {};

  if (!university) {
    fieldErrors.university = "يرجى اختيار الجامعة.";
  }

  if (!academicYear) {
    fieldErrors.academicYear = "يرجى اختيار السنة الدراسية.";
  } else if (!academicYears.has(academicYear)) {
    fieldErrors.academicYear = "يرجى اختيار سنة دراسية صحيحة.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return errorState("أكمل البيانات المطلوبة ثم حاول مرة أخرى.", fieldErrors);
  }

  const supabase = createClient(await cookies());
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/auth/login");
  }

  const academicLevelEnum = academicYearMap[academicYear];

  const { error } = await supabase.from("user_preferences").upsert(
    {
      user_id: user.id,
      university,
      academic_level: academicLevelEnum,
    },
    {
      onConflict: "user_id",
    },
  );

  if (error) {
    console.error("user_preferences upsert error:", error);
    return errorState("تعذر حفظ البيانات الآن. حاول مرة أخرى بعد قليل.");
  }

  redirect("/home");
}

export async function logout(): Promise<void> {
  const supabase = createClient(await cookies());
  await supabase.auth.signOut();

  redirect("/");
}

export async function getCurrentUserProfile() {
  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      user: null,
      preferences: null,
      complete: false,
    };
  }

  const preferences = await getStudentPreferences(user.id);

  return {
    user,
    preferences,
    complete: areStudentPreferencesComplete(preferences),
  };
}
