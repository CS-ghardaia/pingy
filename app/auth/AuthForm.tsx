"use client";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  GraduationCap,
  Loader2,
  Lock,
  LogIn,
  Mail,
  RotateCcw,
  ShieldCheck,
  User,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useMemo, useState } from "react";

import type { AuthFormState } from "@/app/auth/actions";
import {
  resendRegistrationOtp,
  verifyRegistrationOtp,
} from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AuthMode = "login" | "register" | "complete";

type AuthFormProps = {
  readonly mode: AuthMode;
  readonly action: (
    previousState: AuthFormState,
    formData: FormData,
  ) => Promise<AuthFormState>;
  readonly defaultFullName?: string;
  readonly defaultEmail?: string;
};

const initialState: AuthFormState = {
  status: "idle",
  message: "",
};

const inputClasses =
  "h-12 w-full rounded-lg border border-input bg-background px-4 text-base text-foreground transition placeholder:text-muted-foreground/65 focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/20";
const selectClasses =
  "h-12 w-full rounded-lg border border-input bg-background px-4 text-base font-semibold text-foreground transition focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/20";
const errorInputClasses = "border-destructive focus:border-destructive focus:ring-destructive/20";

const copyByMode = {
  login: {
    eyebrow: "مرحبا بعودتك",
    title: "تسجيل الدخول",
    description: "ادخل إلى حسابك لمتابعة مواردك ومشاركاتك داخل مجتمع Pingy.",
    submit: "تسجيل الدخول",
    pending: "جار تسجيل الدخول...",
    switchLabel: "ليس لديك حساب؟",
    switchHref: "/auth/register",
    switchText: "أنشئ حسابا جديدا",
  },
  register: {
    eyebrow: "انضم إلى Pingy",
    title: "إنشاء حساب جديد",
    description: "أنشئ حسابك أولا، ثم تحقق من بريدك وأكمل بياناتك الدراسية.",
    submit: "إرسال رمز التحقق",
    pending: "جار إنشاء الحساب...",
    switchLabel: "لديك حساب بالفعل؟",
    switchHref: "/auth/login",
    switchText: "سجل الدخول",
  },
  complete: {
    eyebrow: "خطوة أخيرة",
    title: "إكمال بيانات الحساب",
    description: "اختر جامعتك وسنتك الدراسية حتى نجهز تجربتك داخل المنصة.",
    submit: "إكمال التسجيل",
    pending: "جار حفظ البيانات...",
    switchLabel: "",
    switchHref: "",
    switchText: "",
  },
} satisfies Record<AuthMode, Record<string, string>>;

const academicYears = [
  "الأولى ليسانس",
  "الثانية ليسانس",
  "الثالثة ليسانس",
  "ماستر 1",
  "ماستر 2",
];

function FieldError({ message }: { readonly message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-destructive">
      <AlertCircle size={16} aria-hidden="true" />
      {message}
    </p>
  );
}

function StatusMessage({ state }: { readonly state: AuthFormState }) {
  if (!state.message) {
    return null;
  }

  const isPositive = state.status === "success" || state.status === "otp_sent";

  return (
    <div
      role={state.status === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4 text-sm font-semibold leading-6",
        isPositive
          ? "border-emerald-200 bg-emerald-50 text-emerald-900"
          : "border-red-200 bg-red-50 text-red-900",
      )}
    >
      {isPositive ? (
        <CheckCircle2 size={18} aria-hidden="true" />
      ) : (
        <AlertCircle size={18} aria-hidden="true" />
      )}
      <span>{state.message}</span>
    </div>
  );
}

function SubmitContent({
  pending,
  pendingText,
  children,
  icon,
}: {
  readonly pending: boolean;
  readonly pendingText: string;
  readonly children: React.ReactNode;
  readonly icon: React.ReactNode;
}) {
  return (
    <>
      {pending ? (
        <Loader2 className="size-5 animate-spin" aria-hidden="true" />
      ) : (
        icon
      )}
      <span>{pending ? pendingText : children}</span>
    </>
  );
}

export function AuthForm({
  mode,
  action,
  defaultFullName = "",
  defaultEmail = "",
}: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [otpState, otpAction, otpPending] = useActionState(
    verifyRegistrationOtp,
    initialState,
  );
  const [resendState, resendAction, resendPending] = useActionState(
    resendRegistrationOtp,
    initialState,
  );
  const [resendSeconds, setResendSeconds] = useState(60);

  const copy = copyByMode[mode];
  const isRegister = mode === "register";
  const isLogin = mode === "login";
  const isComplete = mode === "complete";
  const hasOtpStep = isRegister && state.status === "otp_sent";
  const emailForOtp = state.email ?? resendState.email ?? "";
  const fullNameForOtp = state.fullName ?? resendState.fullName ?? "";
  const SubmitIcon = isRegister ? UserPlus : isComplete ? GraduationCap : LogIn;

  const visibleState = useMemo(() => {
    if (otpState.message) {
      return otpState;
    }

    if (resendState.message) {
      return resendState;
    }

    return state;
  }, [otpState, resendState, state]);

  useEffect(() => {
    if (!hasOtpStep || resendSeconds <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setResendSeconds((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [hasOtpStep, resendSeconds]);

  return (
    <main className="min-h-screen bg-muted/40">
      <div className="mx-auto grid min-h-screen w-full max-w-[1180px] items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-12">
        <section className="order-2 hidden lg:block">
          <div className="relative overflow-hidden rounded-xl border border-border bg-secondary p-8 text-secondary-foreground shadow-sm">
            <div className="absolute left-8 top-8 h-24 w-24 rounded-full border-[18px] border-primary/85" />
            <div className="relative z-10 flex min-h-130 flex-col justify-between">
              <Link
                href="/"
                className="font-latin w-fit text-2xl font-extrabold text-primary"
              >
                Pingy
              </Link>

              <div className="space-y-8">
                <div className="rounded-lg border border-white/10 bg-white/10 p-6 backdrop-blur">
                  <p className="text-sm font-bold text-primary">
                    مساحة طلبة علوم الحاسوب
                  </p>
                  <h2 className="mt-4 text-4xl font-extrabold leading-tight">
                    حساب آمن، تجربة عربية، ومجتمع دراسي أقرب لك.
                  </h2>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  {["تحقق", "بيانات", "دخول"].map((item) => (
                    <div
                      key={item}
                      className="rounded-lg border border-white/10 bg-background px-3 py-4 text-sm font-bold text-foreground"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <p className="max-w-md text-base leading-7 text-secondary-foreground/75">
                يحافظ Pingy على جلسة دخول واضحة، ويمنع الوصول إلى الصفحات غير المناسبة حسب حالة حسابك.
              </p>
            </div>
          </div>
        </section>

        <section className="order-1 mx-auto w-full max-w-[540px]">
          <Link
            href="/"
            className="mb-8 inline-flex min-h-11 items-center gap-2 rounded-lg px-1 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={18} aria-hidden="true" />
            العودة للرئيسية
          </Link>

          <div className="rounded-xl border border-border bg-background p-6 shadow-sm sm:p-8">
            <div className="mb-8">
              <p className="text-sm font-bold text-primary">{copy.eyebrow}</p>
              <h1 className="mt-3 text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">
                {hasOtpStep ? "تأكيد البريد الإلكتروني" : copy.title}
              </h1>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                {hasOtpStep
                  ? `أدخل الرمز المكون من 6 أرقام الذي أرسلناه إلى ${emailForOtp}.`
                  : copy.description}
              </p>
            </div>

            {hasOtpStep ? (
              <form action={otpAction} className="space-y-5" noValidate>
                <input type="hidden" name="email" value={emailForOtp} />
                <input type="hidden" name="fullName" value={fullNameForOtp} />

                <div>
                  <label
                    htmlFor="otp"
                    className="mb-2 block text-sm font-bold text-muted-foreground"
                  >
                    رمز التحقق
                  </label>
                  <div className="relative">
                    <ShieldCheck
                      size={20}
                      aria-hidden="true"
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      required
                      className={cn(
                        inputClasses,
                        "pr-12 text-center text-xl font-extrabold tracking-[0.35em]",
                        otpState.fieldErrors?.otp && errorInputClasses,
                      )}
                      dir="ltr"
                      placeholder="000000"
                      aria-invalid={Boolean(otpState.fieldErrors?.otp)}
                      aria-describedby={
                        otpState.fieldErrors?.otp ? "otp-error" : undefined
                      }
                    />
                  </div>
                  <div id="otp-error">
                    <FieldError message={otpState.fieldErrors?.otp} />
                  </div>
                </div>

                <StatusMessage state={visibleState} />

                <Button type="submit" disabled={otpPending} className="h-12 w-full gap-2">
                  <SubmitContent
                    pending={otpPending}
                    pendingText="جار التحقق..."
                    icon={<ShieldCheck className="size-5" aria-hidden="true" />}
                  >
                    تأكيد
                  </SubmitContent>
                </Button>

                <div className="rounded-lg border border-border bg-muted/50 p-4">
                  <p className="text-sm font-semibold text-muted-foreground">
                    يمكنك طلب رمز جديد بعد {resendSeconds} ثانية.
                  </p>
                  <button
                    type="submit"
                    formAction={resendAction}
                    onClick={() => setResendSeconds(60)}
                    disabled={resendPending || resendSeconds > 0}
                    className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-bold text-foreground transition hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
                  >
                    {resendPending ? (
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <RotateCcw className="size-4" aria-hidden="true" />
                    )}
                    إعادة إرسال الرمز
                  </button>
                </div>
              </form>
            ) : (
              <form action={formAction} className="space-y-5" noValidate>
                {isRegister ? (
                  <div>
                    <label
                      htmlFor="fullName"
                      className="mb-2 block text-sm font-bold text-muted-foreground"
                    >
                      الاسم الكامل
                    </label>
                    <div className="relative">
                      <User
                        size={20}
                        aria-hidden="true"
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        autoComplete="name"
                        required
                        className={cn(
                          inputClasses,
                          "pr-12",
                          state.fieldErrors?.fullName && errorInputClasses,
                        )}
                        placeholder="اكتب اسمك الكامل"
                        defaultValue={state.fullName}
                        aria-invalid={Boolean(state.fieldErrors?.fullName)}
                        aria-describedby={
                          state.fieldErrors?.fullName
                            ? "full-name-error"
                            : undefined
                        }
                      />
                    </div>
                    <div id="full-name-error">
                      <FieldError message={state.fieldErrors?.fullName} />
                    </div>
                  </div>
                ) : null}

                {isLogin || isRegister ? (
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-bold text-muted-foreground"
                    >
                      البريد الإلكتروني
                    </label>
                    <div className="relative">
                      <Mail
                        size={20}
                        aria-hidden="true"
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className={cn(
                          inputClasses,
                          "pr-12 text-left",
                          state.fieldErrors?.email && errorInputClasses,
                        )}
                        dir="ltr"
                        placeholder="name@example.com"
                        defaultValue={state.email}
                        aria-invalid={Boolean(state.fieldErrors?.email)}
                        aria-describedby={
                          state.fieldErrors?.email ? "email-error" : undefined
                        }
                      />
                    </div>
                    <div id="email-error">
                      <FieldError message={state.fieldErrors?.email} />
                    </div>
                  </div>
                ) : null}

                {isLogin || isRegister ? (
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block text-sm font-bold text-muted-foreground"
                    >
                      كلمة المرور
                    </label>
                    <div className="relative">
                      <Lock
                        size={20}
                        aria-hidden="true"
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete={isRegister ? "new-password" : "current-password"}
                        required
                        minLength={isRegister ? 8 : undefined}
                        className={cn(
                          inputClasses,
                          "pr-12 text-left",
                          state.fieldErrors?.password && errorInputClasses,
                        )}
                        dir="ltr"
                        placeholder="••••••••"
                        aria-invalid={Boolean(state.fieldErrors?.password)}
                        aria-describedby={
                          state.fieldErrors?.password
                            ? "password-error"
                            : undefined
                        }
                      />
                    </div>
                    <div id="password-error">
                      <FieldError message={state.fieldErrors?.password} />
                    </div>
                  </div>
                ) : null}

                {isRegister ? (
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="mb-2 block text-sm font-bold text-muted-foreground"
                    >
                      تأكيد كلمة المرور
                    </label>
                    <div className="relative">
                      <Lock
                        size={20}
                        aria-hidden="true"
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        required
                        minLength={8}
                        className={cn(
                          inputClasses,
                          "pr-12 text-left",
                          state.fieldErrors?.confirmPassword && errorInputClasses,
                        )}
                        dir="ltr"
                        placeholder="••••••••"
                        aria-invalid={Boolean(state.fieldErrors?.confirmPassword)}
                        aria-describedby={
                          state.fieldErrors?.confirmPassword
                            ? "confirm-password-error"
                            : undefined
                        }
                      />
                    </div>
                    <div id="confirm-password-error">
                      <FieldError message={state.fieldErrors?.confirmPassword} />
                    </div>
                  </div>
                ) : null}

                {isComplete ? (
                  <>
                    <div className="rounded-lg border border-border bg-muted/50 p-4">
                      <p className="text-sm font-bold text-foreground">
                        {defaultFullName || "حسابك"}
                      </p>
                      {defaultEmail ? (
                        <p className="mt-1 text-sm text-muted-foreground" dir="ltr">
                          {defaultEmail}
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <label
                        htmlFor="university"
                        className="mb-2 block text-sm font-bold text-muted-foreground"
                      >
                        الجامعة
                      </label>
                      <select
                        id="university"
                        name="university"
                        required
                        defaultValue="جامعة غرداية"
                        className={cn(
                          selectClasses,
                          state.fieldErrors?.university && errorInputClasses,
                        )}
                        aria-invalid={Boolean(state.fieldErrors?.university)}
                      >
                        <option value="جامعة غرداية">جامعة غرداية</option>
                      </select>
                      <FieldError message={state.fieldErrors?.university} />
                    </div>

                    <div>
                      <label
                        htmlFor="academicYear"
                        className="mb-2 block text-sm font-bold text-muted-foreground"
                      >
                        السنة الدراسية
                      </label>
                      <select
                        id="academicYear"
                        name="academicYear"
                        required
                        defaultValue=""
                        className={cn(
                          selectClasses,
                          state.fieldErrors?.academicYear && errorInputClasses,
                        )}
                        aria-invalid={Boolean(state.fieldErrors?.academicYear)}
                      >
                        <option value="" disabled>
                          اختر السنة الدراسية
                        </option>
                        {academicYears.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                      <FieldError message={state.fieldErrors?.academicYear} />
                    </div>
                  </>
                ) : null}

                <StatusMessage state={state} />

                <Button type="submit" disabled={pending} className="h-12 w-full gap-2">
                  <SubmitContent
                    pending={pending}
                    pendingText={copy.pending}
                    icon={<SubmitIcon className="size-5" aria-hidden="true" />}
                  >
                    {copy.submit}
                  </SubmitContent>
                </Button>
              </form>
            )}

            {!isComplete ? (
              <p className="mt-6 text-center text-sm font-semibold text-muted-foreground">
                {copy.switchLabel}{" "}
                <Link
                  href={copy.switchHref}
                  className="text-foreground underline decoration-primary decoration-2 underline-offset-4 transition-colors hover:text-muted-foreground"
                >
                  {copy.switchText}
                </Link>
              </p>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
