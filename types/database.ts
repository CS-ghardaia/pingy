export type Json =
  | string
  | number
  | boolean
  | null
  | { readonly [key: string]: Json | undefined }
  | readonly Json[];

export type UserRole = "student" | "moderator" | "admin";
export type ResourceStatus = "pending" | "approved" | "rejected" | "archived";
export type ReportStatus = "pending" | "reviewed" | "resolved" | "dismissed";
export type SubmissionStatus = "queued" | "running" | "passed" | "failed" | "error";
export type Difficulty = "easy" | "medium" | "hard";

export type Database = {
  public: {
    Tables: {
      academic_levels: {
        Row: {
          code: string;
          name_ar: string;
          name_en: string;
          order_index: number;
          is_active: boolean;
        };
        Insert: Partial<Database["public"]["Tables"]["academic_levels"]["Row"]> & {
          code: string;
          name_ar: string;
          name_en: string;
        };
        Update: Partial<Database["public"]["Tables"]["academic_levels"]["Row"]>;
      };
      semesters: {
        Row: {
          code: string;
          name_ar: string;
          name_en: string;
          order_index: number;
        };
        Insert: Partial<Database["public"]["Tables"]["semesters"]["Row"]> & {
          code: string;
          name_ar: string;
          name_en: string;
        };
        Update: Partial<Database["public"]["Tables"]["semesters"]["Row"]>;
      };
      resource_types: {
        Row: {
          code: string;
          name_ar: string;
          name_en: string;
          icon: string | null;
          order_index: number;
          is_active: boolean;
        };
        Insert: Partial<Database["public"]["Tables"]["resource_types"]["Row"]> & {
          code: string;
          name_ar: string;
          name_en: string;
        };
        Update: Partial<Database["public"]["Tables"]["resource_types"]["Row"]>;
      };
      report_reasons: {
        Row: {
          code: string;
          name_ar: string;
          name_en: string;
        };
        Insert: Database["public"]["Tables"]["report_reasons"]["Row"];
        Update: Partial<Database["public"]["Tables"]["report_reasons"]["Row"]>;
      };
      universities: {
        Row: {
          id: string;
          name: string;
          name_ar: string | null;
          city: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["universities"]["Row"]> & {
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["universities"]["Row"]>;
      };
      users: {
        Row: {
          id: string;
          username: string | null;
          full_name: string;
          avatar_url: string | null;
          bio: string | null;
          role: UserRole;
          reputation_score: number;
          is_banned: boolean;
          banned_reason: string | null;
          last_seen_at: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["users"]["Row"]> & {
          id: string;
          full_name: string;
        };
        Update: Partial<Database["public"]["Tables"]["users"]["Row"]>;
      };
      user_preferences: {
        Row: {
          user_id: string;
          university_id: string | null;
          academic_level: string | null;
          notification_settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["user_preferences"]["Row"]> & {
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_preferences"]["Row"]>;
      };
      modules: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          level: string;
          semester: string;
          order_index: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["modules"]["Row"]> & {
          name: string;
          level: string;
          semester: string;
        };
        Update: Partial<Database["public"]["Tables"]["modules"]["Row"]>;
      };
      resources: {
        Row: {
          id: string;
          title: string;
          slug: string | null;
          description: string | null;
          module_id: string;
          resource_type: string;
          storage_provider: string;
          file_url: string;
          file_id: string;
          file_size_bytes: number | null;
          mime_type: string | null;
          thumbnail_url: string | null;
          uploaded_by: string | null;
          status: ResourceStatus;
          is_featured: boolean;
          views: number;
          downloads: number;
          average_rating: number;
          rating_count: number;
          comment_count: number;
          report_count: number;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["resources"]["Row"]> & {
          title: string;
          module_id: string;
          resource_type: string;
          file_url: string;
          file_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["resources"]["Row"]>;
      };
      tags: {
        Row: { id: string; name: string; slug: string; created_at: string };
        Insert: Partial<Database["public"]["Tables"]["tags"]["Row"]> & {
          name: string;
          slug: string;
        };
        Update: Partial<Database["public"]["Tables"]["tags"]["Row"]>;
      };
      resource_tags: {
        Row: { resource_id: string; tag_id: string };
        Insert: Database["public"]["Tables"]["resource_tags"]["Row"];
        Update: Partial<Database["public"]["Tables"]["resource_tags"]["Row"]>;
      };
      resource_ratings: {
        Row: {
          resource_id: string;
          user_id: string;
          rating: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["resource_ratings"]["Row"]> & {
          resource_id: string;
          user_id: string;
          rating: number;
        };
        Update: Partial<Database["public"]["Tables"]["resource_ratings"]["Row"]>;
      };
      resource_comments: {
        Row: {
          id: string;
          resource_id: string;
          user_id: string;
          parent_comment_id: string | null;
          content: string;
          is_edited: boolean;
          deleted_at: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["resource_comments"]["Row"]> & {
          resource_id: string;
          user_id: string;
          content: string;
        };
        Update: Partial<Database["public"]["Tables"]["resource_comments"]["Row"]>;
      };
      resource_favorites: {
        Row: { user_id: string; resource_id: string; created_at: string };
        Insert: Partial<Database["public"]["Tables"]["resource_favorites"]["Row"]> & {
          user_id: string;
          resource_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["resource_favorites"]["Row"]>;
      };
      resource_reports: {
        Row: {
          id: string;
          resource_id: string;
          reporter_id: string;
          reason: string;
          description: string | null;
          status: ReportStatus;
          reviewed_by: string | null;
          reviewed_at: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["resource_reports"]["Row"]> & {
          resource_id: string;
          reporter_id: string;
          reason: string;
        };
        Update: Partial<Database["public"]["Tables"]["resource_reports"]["Row"]>;
      };
      exercise_details: {
        Row: {
          resource_id: string;
          difficulty: Difficulty;
          language: string;
          starter_code: string | null;
          solution_code: string | null;
          test_cases: Json;
          time_limit_ms: number;
        };
        Insert: Partial<Database["public"]["Tables"]["exercise_details"]["Row"]> & {
          resource_id: string;
          difficulty: Difficulty;
          language: string;
        };
        Update: Partial<Database["public"]["Tables"]["exercise_details"]["Row"]>;
      };
      exercise_submissions: {
        Row: {
          id: string;
          resource_id: string;
          user_id: string;
          code: string;
          status: SubmissionStatus;
          score: number | null;
          runtime_ms: number | null;
          error_message: string | null;
          submitted_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["exercise_submissions"]["Row"]> & {
          resource_id: string;
          user_id: string;
          code: string;
        };
        Update: Partial<Database["public"]["Tables"]["exercise_submissions"]["Row"]>;
      };
      reputation_events: {
        Row: {
          id: number;
          user_id: string;
          event_type: string;
          points: number;
          related_resource_id: string | null;
          related_comment_id: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["reputation_events"]["Row"]> & {
          user_id: string;
          event_type: string;
          points: number;
        };
        Update: Partial<Database["public"]["Tables"]["reputation_events"]["Row"]>;
      };
      badges: {
        Row: {
          id: string;
          code: string;
          name_ar: string;
          name_en: string;
          description: string | null;
          icon: string | null;
          criteria: Json;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["badges"]["Row"]> & {
          code: string;
          name_ar: string;
          name_en: string;
        };
        Update: Partial<Database["public"]["Tables"]["badges"]["Row"]>;
      };
      user_badges: {
        Row: { user_id: string; badge_id: string; unlocked_at: string };
        Insert: Database["public"]["Tables"]["user_badges"]["Row"];
        Update: Partial<Database["public"]["Tables"]["user_badges"]["Row"]>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          body: string | null;
          data: Json;
          is_read: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["notifications"]["Row"]> & {
          user_id: string;
          type: string;
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Row"]>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      record_resource_view: {
        Args: { p_resource_id: string; p_user_id?: string | null };
        Returns: void;
      };
      record_resource_download: {
        Args: { p_resource_id: string; p_user_id?: string | null };
        Returns: void;
      };
    };
    Enums: {
      user_role: UserRole;
      resource_status: ResourceStatus;
      report_status: ReportStatus;
      submission_status: SubmissionStatus;
    };
  };
};
