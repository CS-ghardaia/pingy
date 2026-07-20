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
  readonly university: string | null;
  readonly academic_level: string | null;
};
