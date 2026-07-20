import type { Difficulty, ResourceStatus, SubmissionStatus } from "@/types/database";

export type StudentUser = {
  readonly id: string;
  readonly email: string;
  readonly username: string | null;
  readonly fullName: string;
  readonly avatarUrl: string | null;
  readonly bio: string | null;
  readonly reputationScore: number;
};

export type StudentPreference = {
  readonly universityId: string | null;
  readonly universityName: string | null;
  readonly academicLevel: string | null;
};

export type LookupOption = {
  readonly code: string;
  readonly nameAr: string;
  readonly nameEn: string;
  readonly orderIndex: number;
};

export type UniversityOption = {
  readonly id: string;
  readonly name: string;
  readonly nameAr: string | null;
  readonly city: string | null;
};

export type ModuleSummary = {
  readonly id: string;
  readonly name: string;
  readonly description: string | null;
  readonly level: string;
  readonly semester: string;
  readonly orderIndex: number;
  readonly resourceCount: number;
};

export type ResourceTypeOption = LookupOption & {
  readonly icon: string | null;
};

export type ResourceSummary = {
  readonly id: string;
  readonly title: string;
  readonly description: string | null;
  readonly moduleId: string;
  readonly moduleName: string;
  readonly moduleLevel: string;
  readonly moduleSemester: string;
  readonly resourceType: string;
  readonly resourceTypeName: string;
  readonly fileUrl: string;
  readonly mimeType: string | null;
  readonly thumbnailUrl: string | null;
  readonly uploadedBy: string | null;
  readonly authorName: string;
  readonly status: ResourceStatus;
  readonly isFeatured: boolean;
  readonly views: number;
  readonly downloads: number;
  readonly averageRating: number;
  readonly ratingCount: number;
  readonly commentCount: number;
  readonly createdAt: string;
};

export type TagSummary = {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
};

export type CommentSummary = {
  readonly id: string;
  readonly resourceId: string;
  readonly userId: string;
  readonly parentCommentId: string | null;
  readonly content: string;
  readonly isEdited: boolean;
  readonly createdAt: string;
  readonly authorName: string;
  readonly authorAvatarUrl: string | null;
};

export type ResourceDetail = ResourceSummary & {
  readonly storageProvider: string;
  readonly fileId: string;
  readonly fileSizeBytes: number | null;
  readonly tags: readonly TagSummary[];
  readonly comments: readonly CommentSummary[];
  readonly myRating: number | null;
  readonly isFavorite: boolean;
};

export type ExerciseSummary = ResourceSummary & {
  readonly difficulty: Difficulty;
  readonly language: string;
};

export type ExerciseDetail = ResourceDetail & {
  readonly difficulty: Difficulty;
  readonly language: string;
  readonly starterCode: string | null;
  readonly testCases: string;
  readonly timeLimitMs: number;
};

export type SubmissionSummary = {
  readonly id: string;
  readonly resourceId: string;
  readonly code: string;
  readonly status: SubmissionStatus;
  readonly score: number | null;
  readonly runtimeMs: number | null;
  readonly errorMessage: string | null;
  readonly submittedAt: string;
};

export type BadgeSummary = {
  readonly id: string;
  readonly code: string;
  readonly nameAr: string;
  readonly description: string | null;
  readonly icon: string | null;
  readonly unlockedAt: string | null;
};

export type ReputationEventSummary = {
  readonly id: number;
  readonly eventType: string;
  readonly points: number;
  readonly createdAt: string;
};

export type NotificationSummary = {
  readonly id: string;
  readonly type: string;
  readonly title: string;
  readonly body: string | null;
  readonly isRead: boolean;
  readonly createdAt: string;
};
