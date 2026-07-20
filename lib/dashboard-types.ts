export type AcademicLevel = "L1" | "L2" | "L3" | "M1" | "M2";
export type SemesterType = "S1" | "S2";
export type ResourceType =
  | "course"
  | "td"
  | "tp"
  | "exam"
  | "summary"
  | "solution"
  | "project"
  | "other";
export type ResourceStatus = "pending" | "approved" | "rejected" | "archived";

export type DashboardUser = {
  readonly id: string;
  readonly email: string;
  readonly fullName: string;
  readonly avatarUrl: string | null;
};

export type UserPreferences = {
  readonly university: string | null;
  readonly academicLevel: AcademicLevel | null;
};

export type ModuleSummary = {
  readonly id: string;
  readonly name: string;
  readonly description: string | null;
  readonly level: AcademicLevel;
  readonly semester: SemesterType;
};

export type ResourceSummary = {
  readonly id: string;
  readonly title: string;
  readonly description: string | null;
  readonly moduleId: string;
  readonly moduleName: string;
  readonly moduleLevel: AcademicLevel;
  readonly moduleSemester: SemesterType;
  readonly resourceType: ResourceType;
  readonly driveUrl: string;
  readonly status: ResourceStatus;
  readonly createdAt: string;
  readonly authorName: string;
};

export const levelLabels: Record<AcademicLevel, string> = {
  L1: "الأولى ليسانس",
  L2: "الثانية ليسانس",
  L3: "الثالثة ليسانس",
  M1: "ماستر 1",
  M2: "ماستر 2",
};

export const resourceTypeLabels: Record<ResourceType, string> = {
  course: "محاضرة",
  td: "TD",
  tp: "TP",
  exam: "امتحان",
  summary: "ملخص",
  solution: "حل",
  project: "مشروع",
  other: "أخرى",
};

export const statusLabels: Record<ResourceStatus, string> = {
  pending: "قيد المراجعة",
  approved: "مقبول",
  rejected: "مرفوض",
  archived: "مؤرشف",
};
