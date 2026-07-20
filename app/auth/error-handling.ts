import type { AuthField, AuthFormState } from "@/app/auth/types";

export type AppErrorCode =
  | "INVALID_EMAIL"
  | "INVALID_PASSWORD"
  | "INVALID_FULL_NAME"
  | "PASSWORD_CONFIRMATION_REQUIRED"
  | "PASSWORD_MISMATCH"
  | "USER_ALREADY_EXISTS"
  | "EMAIL_NOT_CONFIRMED"
  | "INVALID_LOGIN_CREDENTIALS"
  | "INVALID_OTP"
  | "OTP_EXPIRED"
  | "RATE_LIMIT"
  | "DATABASE_ERROR"
  | "NETWORK_ERROR"
  | "UNAUTHENTICATED"
  | "INVALID_UNIVERSITY"
  | "INVALID_ACADEMIC_YEAR"
  | "VALIDATION_ERROR"
  | "UNKNOWN_ERROR";

export type AppErrorKind =
  | "validation"
  | "auth"
  | "database"
  | "network"
  | "rate-limit"
  | "unknown";

export type AppError = {
  readonly kind: AppErrorKind;
  readonly code: AppErrorCode;
  readonly message: string;
  readonly retryable: boolean;
  readonly cause?: unknown;
};

export type ValidationIssue = {
  readonly field: AuthField;
  readonly code: AppErrorCode;
};

export type SuccessCode = "OTP_SENT" | "OTP_RESENT";

const errorMessages: Record<AppErrorCode, string> = {
  INVALID_EMAIL: "يرجى إدخال بريد إلكتروني صحيح.",
  INVALID_PASSWORD: "كلمة المرور يجب أن تتكون من 8 أحرف على الأقل وتحتوي على أحرف وأرقام.",
  INVALID_FULL_NAME: "يرجى إدخال الاسم الكامل.",
  PASSWORD_CONFIRMATION_REQUIRED: "يرجى تأكيد كلمة المرور.",
  PASSWORD_MISMATCH: "كلمتا المرور غير متطابقتين.",
  USER_ALREADY_EXISTS: "هذا البريد الإلكتروني مستخدم بالفعل.",
  EMAIL_NOT_CONFIRMED: "يرجى تأكيد بريدك الإلكتروني أولا.",
  INVALID_LOGIN_CREDENTIALS: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
  INVALID_OTP: "رمز التحقق غير صحيح.",
  OTP_EXPIRED: "انتهت صلاحية رمز التحقق.",
  RATE_LIMIT: "تم تجاوز الحد المسموح لإرسال رسائل التحقق. يرجى الانتظار قليلا ثم إعادة المحاولة.",
  DATABASE_ERROR: "حدث خطأ أثناء حفظ البيانات. يرجى المحاولة مرة أخرى.",
  NETWORK_ERROR: "تعذر الاتصال بالخادم. تحقق من اتصال الإنترنت.",
  UNAUTHENTICATED: "يرجى تسجيل الدخول أولا.",
  INVALID_UNIVERSITY: "يرجى اختيار الجامعة.",
  INVALID_ACADEMIC_YEAR: "يرجى اختيار سنة دراسية صحيحة.",
  VALIDATION_ERROR: "تحقق من البيانات ثم حاول مرة أخرى.",
  UNKNOWN_ERROR: "حدث خطأ غير متوقع. يرجى إعادة المحاولة لاحقا.",
};

const successMessages: Record<SuccessCode, string> = {
  OTP_SENT: "تم إرسال رمز التحقق إلى بريدك الإلكتروني.",
  OTP_RESENT: "تم إرسال رمز تحقق جديد إلى بريدك الإلكتروني.",
};

const retryableCodes = new Set<AppErrorCode>([
  "RATE_LIMIT",
  "DATABASE_ERROR",
  "NETWORK_ERROR",
  "UNKNOWN_ERROR",
]);

export const getErrorMessage = (code: AppErrorCode) => errorMessages[code];

export const getSuccessMessage = (code: SuccessCode) => successMessages[code];

export const createAppError = (
  code: AppErrorCode,
  cause?: unknown,
  kind: AppErrorKind = inferErrorKind(code),
): AppError => ({
  kind,
  code,
  message: getErrorMessage(code),
  retryable: retryableCodes.has(code),
  cause,
});

export const createErrorState = (
  error: AppError,
  fieldErrors?: AuthFormState["fieldErrors"],
  values?: Pick<AuthFormState, "email" | "fullName">,
): AuthFormState => ({
  status: "error",
  message: error.message,
  fieldErrors,
  ...values,
});

export const createValidationState = (
  issues: readonly ValidationIssue[],
  values?: Pick<AuthFormState, "email" | "fullName">,
): AuthFormState => {
  const fieldErrors = issues.reduce<AuthFormState["fieldErrors"]>(
    (errors, issue) => ({
      ...errors,
      [issue.field]: getErrorMessage(issue.code),
    }),
    {},
  );

  return createErrorState(createAppError("VALIDATION_ERROR"), fieldErrors, values);
};

export const createSuccessState = (
  code: SuccessCode,
  values?: Pick<AuthFormState, "email" | "fullName">,
): AuthFormState => ({
  status: "otp_sent",
  message: getSuccessMessage(code),
  ...values,
});

export const mapSupabaseError = (
  error: unknown,
  fallbackCode: AppErrorCode = "UNKNOWN_ERROR",
): AppError => {
  const status = getErrorStatus(error);
  const text = getErrorText(error);

  if (status === 429 || includesAny(text, ["rate limit", "too many", "over_email_send_rate_limit"])) {
    return createAppError("RATE_LIMIT", error, "rate-limit");
  }

  if (isNetworkError(error, text)) {
    return createAppError("NETWORK_ERROR", error, "network");
  }

  if (includesAny(text, ["invalid login credentials"])) {
    return createAppError("INVALID_LOGIN_CREDENTIALS", error, "auth");
  }

  if (includesAny(text, ["email not confirmed", "not confirmed"])) {
    return createAppError("EMAIL_NOT_CONFIRMED", error, "auth");
  }

  if (includesAny(text, ["already registered", "user already registered", "already exists"])) {
    return createAppError("USER_ALREADY_EXISTS", error, "auth");
  }

  if (includesAny(text, ["expired", "token has expired", "otp expired"])) {
    return createAppError("OTP_EXPIRED", error, "auth");
  }

  if (includesAny(text, ["invalid otp", "invalid token", "token is invalid", "otp"])) {
    return createAppError("INVALID_OTP", error, "auth");
  }

  if (status && status >= 500) {
    return createAppError("DATABASE_ERROR", error, "database");
  }

  return createAppError(fallbackCode, error);
};

export const logAppError = (context: string, error: AppError | unknown) => {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  console.error(`[${context}]`, error);
};

const inferErrorKind = (code: AppErrorCode): AppErrorKind => {
  if (
    code === "INVALID_EMAIL" ||
    code === "INVALID_PASSWORD" ||
    code === "INVALID_FULL_NAME" ||
    code === "PASSWORD_CONFIRMATION_REQUIRED" ||
    code === "PASSWORD_MISMATCH" ||
    code === "INVALID_UNIVERSITY" ||
    code === "INVALID_ACADEMIC_YEAR" ||
    code === "VALIDATION_ERROR"
  ) {
    return "validation";
  }

  if (code === "DATABASE_ERROR") {
    return "database";
  }

  if (code === "NETWORK_ERROR") {
    return "network";
  }

  if (code === "RATE_LIMIT") {
    return "rate-limit";
  }

  if (
    code === "USER_ALREADY_EXISTS" ||
    code === "EMAIL_NOT_CONFIRMED" ||
    code === "INVALID_LOGIN_CREDENTIALS" ||
    code === "INVALID_OTP" ||
    code === "OTP_EXPIRED" ||
    code === "UNAUTHENTICATED"
  ) {
    return "auth";
  }

  return "unknown";
};

const includesAny = (text: string, needles: readonly string[]) =>
  needles.some((needle) => text.includes(needle));

const getErrorText = (error: unknown): string => {
  if (!error || typeof error !== "object") {
    return "";
  }

  const parts = ["message", "code", "name", "statusText"]
    .map((key) => getStringProperty(error, key))
    .filter(Boolean);

  return parts.join(" ").toLowerCase();
};

const getErrorStatus = (error: unknown): number | undefined => {
  if (!error || typeof error !== "object") {
    return undefined;
  }

  const status = Reflect.get(error, "status");
  return typeof status === "number" ? status : undefined;
};

const getStringProperty = (value: object, key: string): string | undefined => {
  const property = Reflect.get(value, key);
  return typeof property === "string" ? property : undefined;
};

const isNetworkError = (error: unknown, text: string): boolean =>
  error instanceof TypeError ||
  includesAny(text, ["fetch failed", "failed to fetch", "network", "econnrefused", "enotfound", "timeout"]);
