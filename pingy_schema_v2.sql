-- =====================================================================
-- Pingy — Database Schema V2 (Production-Ready)
-- PostgreSQL + Supabase
--
-- Builds on the V1 schema you shared. Goals of this revision:
--   1. Normalize taxonomies that will grow (levels, semesters, resource
--      types, report reasons, universities) into editable lookup tables
--      instead of ENUMs, since ENUM values are painful to add/remove
--      later in Postgres.
--   2. Keep ENUMs only for true state machines that the application
--      branches on in code (role, resource_status, report_status,
--      submission_status, moderation_action) — these benefit from
--      type-safety and are unlikely to change shape.
--   3. Add the features your design system (DESIGN_pinggly.md) already
--      implies but V1 has no tables for: ratings, comments, favorites,
--      tags, reputation/gamification, badges, notifications,
--      moderation audit trail, content reports, exercise submissions.
--   4. Make counters (views/downloads/ratings/comments) race-safe via
--      SECURITY DEFINER functions + triggers instead of naive
--      "UPDATE ... SET views = views + 1" from the client.
--   5. Add soft deletes, full-text search, and indexes needed at scale.
--   6. Ship Row Level Security on every table, not just one.
--
-- This file is idempotent-ish for a fresh database. Run against a new
-- Supabase project (or wrap in a migration if applied to an existing one).
-- =====================================================================

-- =====================================================================
-- 0. EXTENSIONS
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;   -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pg_trgm;    -- fuzzy / partial text search

-- =====================================================================
-- 1. ENUMS
-- Only for fixed state machines the app branches on in code.
-- =====================================================================

CREATE TYPE user_role AS ENUM (
    'student',
    'moderator',   -- added: lets you scale moderation without granting full admin
    'admin'
);

CREATE TYPE resource_status AS ENUM (
    'pending',
    'approved',
    'rejected',
    'archived'
);

CREATE TYPE report_status AS ENUM (
    'pending',
    'reviewed',
    'resolved',
    'dismissed'
);

CREATE TYPE moderation_action AS ENUM (
    'approved',
    'rejected',
    'archived',
    'restored',
    'deleted'
);

CREATE TYPE submission_status AS ENUM (
    'queued',
    'running',
    'passed',
    'failed',
    'error'
);

-- =====================================================================
-- 2. LOOKUP TABLES (editable taxonomies — NOT enums)
-- Admins can add a new resource type, level, or report reason without
-- a schema migration. code is the stable machine key (what your app
-- code references); name_ar/name_en are for display.
-- =====================================================================

CREATE TABLE public.academic_levels (
    code        TEXT PRIMARY KEY,              -- 'L1','L2','L3','M1','M2'
    name_ar     TEXT NOT NULL,
    name_en     TEXT NOT NULL,
    order_index SMALLINT NOT NULL DEFAULT 0,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE public.semesters (
    code        TEXT PRIMARY KEY,              -- 'S1','S2'
    name_ar     TEXT NOT NULL,
    name_en     TEXT NOT NULL,
    order_index SMALLINT NOT NULL DEFAULT 0
);

CREATE TABLE public.resource_types (
    code        TEXT PRIMARY KEY,              -- 'course','td','tp','exam','summary','solution','project','exercise','other'
    name_ar     TEXT NOT NULL,
    name_en     TEXT NOT NULL,
    icon        TEXT,
    order_index SMALLINT NOT NULL DEFAULT 0,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE public.report_reasons (
    code    TEXT PRIMARY KEY,                  -- 'spam','copyright','duplicate','inappropriate','wrong_module','other'
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL
);

CREATE TABLE public.universities (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       TEXT NOT NULL,
    name_ar    TEXT,
    city       TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- 3. USERS & PREFERENCES
-- =====================================================================

CREATE TABLE public.users (
    id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username          TEXT UNIQUE,
    full_name         TEXT NOT NULL,
    avatar_url        TEXT,
    bio               TEXT,
    role              user_role NOT NULL DEFAULT 'student',
    reputation_score  INTEGER NOT NULL DEFAULT 0,
    is_banned         BOOLEAN NOT NULL DEFAULT FALSE,
    banned_reason     TEXT,
    last_seen_at      TIMESTAMPTZ,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT username_format CHECK (username IS NULL OR username ~ '^[a-z0-9_]{3,20}$')
);

CREATE TABLE public.user_preferences (
    user_id                UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    university_id          UUID REFERENCES public.universities(id) ON DELETE SET NULL,
    academic_level         TEXT REFERENCES public.academic_levels(code) ON DELETE SET NULL,
    notification_settings  JSONB NOT NULL DEFAULT '{"email": true, "push": true}'::jsonb,
    created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- 4. ACADEMIC STRUCTURE
-- =====================================================================

CREATE TABLE public.modules (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    level       TEXT NOT NULL REFERENCES public.academic_levels(code),
    semester    TEXT NOT NULL REFERENCES public.semesters(code),
    order_index SMALLINT NOT NULL DEFAULT 0,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_module UNIQUE (level, semester, name)
);

-- =====================================================================
-- 5. RESOURCES
-- =====================================================================

CREATE TABLE public.resources (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title             VARCHAR(255) NOT NULL,
    slug              TEXT,
    description       TEXT,
    module_id         UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    resource_type     TEXT NOT NULL REFERENCES public.resource_types(code),

    -- storage is abstracted so you are not locked into Google Drive
    storage_provider  TEXT NOT NULL DEFAULT 'google_drive',   -- 'google_drive' | 'supabase_storage' | 's3' | ...
    file_url          TEXT NOT NULL,
    file_id           TEXT NOT NULL,
    file_size_bytes   BIGINT,
    mime_type         TEXT,
    thumbnail_url     TEXT,

    uploaded_by       UUID REFERENCES public.users(id) ON DELETE SET NULL,
    status            resource_status NOT NULL DEFAULT 'pending',
    is_featured       BOOLEAN NOT NULL DEFAULT FALSE,

    -- denormalized counters kept in sync by triggers/functions below
    views             INTEGER NOT NULL DEFAULT 0,
    downloads         INTEGER NOT NULL DEFAULT 0,
    average_rating    NUMERIC(2,1) NOT NULL DEFAULT 0,
    rating_count      INTEGER NOT NULL DEFAULT 0,
    comment_count     INTEGER NOT NULL DEFAULT 0,
    report_count      INTEGER NOT NULL DEFAULT 0,

    search_vector     TSVECTOR GENERATED ALWAYS AS (
        setweight(to_tsvector('simple', coalesce(title, '')), 'A') ||
        setweight(to_tsvector('simple', coalesce(description, '')), 'B')
    ) STORED,

    deleted_at        TIMESTAMPTZ,     -- soft delete: never hard-delete user-generated content
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT unique_resource UNIQUE (module_id, resource_type, title)
);

-- Tags: free-form many-to-many labeling, independent from resource_type
CREATE TABLE public.tags (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       TEXT NOT NULL UNIQUE,
    slug       TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.resource_tags (
    resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
    tag_id      UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (resource_id, tag_id)
);

CREATE TABLE public.resource_ratings (
    resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (resource_id, user_id)
);

CREATE TABLE public.resource_comments (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id        UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
    user_id            UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    parent_comment_id  UUID REFERENCES public.resource_comments(id) ON DELETE CASCADE,
    content            TEXT NOT NULL,
    is_edited          BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at         TIMESTAMPTZ,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.resource_favorites (
    user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, resource_id)
);

-- Event logs (not just counters) so you can build real analytics later
-- and can de-duplicate "1 view per user per day" if you want to.
CREATE TABLE public.resource_views (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
    user_id     UUID REFERENCES public.users(id) ON DELETE SET NULL,
    viewed_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.resource_downloads (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
    user_id     UUID REFERENCES public.users(id) ON DELETE SET NULL,
    downloaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.resource_reports (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id  UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
    reporter_id  UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    reason       TEXT NOT NULL REFERENCES public.report_reasons(code),
    description  TEXT,
    status       report_status NOT NULL DEFAULT 'pending',
    reviewed_by  UUID REFERENCES public.users(id) ON DELETE SET NULL,
    reviewed_at  TIMESTAMPTZ,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_report_per_user UNIQUE (resource_id, reporter_id)
);

-- Full audit trail of every moderation action taken on a resource.
CREATE TABLE public.moderation_logs (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id   UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
    moderator_id  UUID REFERENCES public.users(id) ON DELETE SET NULL,
    action        moderation_action NOT NULL,
    reason        TEXT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- 6. EXERCISES (1-1 extension of resources where resource_type = 'exercise')
-- =====================================================================

CREATE TABLE public.exercise_details (
    resource_id     UUID PRIMARY KEY REFERENCES public.resources(id) ON DELETE CASCADE,
    difficulty      TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    language        TEXT NOT NULL,             -- 'python','c','java',...
    starter_code    TEXT,
    solution_code   TEXT,
    test_cases      JSONB NOT NULL DEFAULT '[]'::jsonb,
    time_limit_ms   INTEGER NOT NULL DEFAULT 5000
);

CREATE TABLE public.exercise_submissions (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id   UUID NOT NULL REFERENCES public.exercise_details(resource_id) ON DELETE CASCADE,
    user_id       UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    code          TEXT NOT NULL,
    status        submission_status NOT NULL DEFAULT 'queued',
    score         SMALLINT,
    runtime_ms    INTEGER,
    error_message TEXT,
    submitted_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- 7. GAMIFICATION
-- =====================================================================

-- Every reputation change is an explicit, auditable event. users.reputation_score
-- is a cache kept current by the trigger in section 9 — never write to it directly.
CREATE TABLE public.reputation_events (
    id                   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id              UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    event_type           TEXT NOT NULL,   -- 'resource_approved','resource_downloaded','comment_upvoted','badge_unlocked',...
    points               INTEGER NOT NULL,
    related_resource_id  UUID REFERENCES public.resources(id) ON DELETE SET NULL,
    related_comment_id   UUID REFERENCES public.resource_comments(id) ON DELETE SET NULL,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.badges (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code        TEXT NOT NULL UNIQUE,
    name_ar     TEXT NOT NULL,
    name_en     TEXT NOT NULL,
    description TEXT,
    icon        TEXT,
    criteria    JSONB NOT NULL DEFAULT '{}'::jsonb,   -- evaluated in app/edge function, not in SQL
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.user_badges (
    user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    badge_id    UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, badge_id)
);

-- =====================================================================
-- 8. NOTIFICATIONS
-- =====================================================================

CREATE TABLE public.notifications (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type       TEXT NOT NULL,      -- 'resource_approved','new_comment','badge_unlocked','report_resolved',...
    title      TEXT NOT NULL,
    body       TEXT,
    data       JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_read    BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- 9. FUNCTIONS & TRIGGERS
-- =====================================================================

-- 9.1 Auto-create a profile row when a Supabase auth user signs up.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.users (id, full_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9.2 Generic updated_at toucher, reused across tables.
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_user_preferences_updated_at
BEFORE UPDATE ON public.user_preferences
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER trg_resources_updated_at
BEFORE UPDATE ON public.resources
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER trg_resource_ratings_updated_at
BEFORE UPDATE ON public.resource_ratings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 9.3 Atomic, race-safe view/download counters. Call these from the
-- client/edge function instead of "UPDATE resources SET views = views+1".
CREATE OR REPLACE FUNCTION public.record_resource_view(p_resource_id UUID, p_user_id UUID DEFAULT NULL)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.resource_views (resource_id, user_id) VALUES (p_resource_id, p_user_id);
    UPDATE public.resources SET views = views + 1 WHERE id = p_resource_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.record_resource_download(p_resource_id UUID, p_user_id UUID DEFAULT NULL)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.resource_downloads (resource_id, user_id) VALUES (p_resource_id, p_user_id);
    UPDATE public.resources SET downloads = downloads + 1 WHERE id = p_resource_id;
END;
$$;

-- 9.4 Keep resources.average_rating / rating_count in sync.
CREATE OR REPLACE FUNCTION public.sync_resource_rating_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_resource_id UUID := COALESCE(NEW.resource_id, OLD.resource_id);
BEGIN
    UPDATE public.resources r
    SET average_rating = COALESCE((SELECT ROUND(AVG(rating), 1) FROM public.resource_ratings WHERE resource_id = v_resource_id), 0),
        rating_count    = (SELECT COUNT(*) FROM public.resource_ratings WHERE resource_id = v_resource_id)
    WHERE r.id = v_resource_id;
    RETURN NULL;
END;
$$;

CREATE TRIGGER trg_resource_ratings_stats
AFTER INSERT OR UPDATE OR DELETE ON public.resource_ratings
FOR EACH ROW EXECUTE FUNCTION public.sync_resource_rating_stats();

-- 9.5 Keep resources.comment_count in sync (soft-deleted comments excluded).
CREATE OR REPLACE FUNCTION public.sync_resource_comment_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_resource_id UUID := COALESCE(NEW.resource_id, OLD.resource_id);
BEGIN
    UPDATE public.resources r
    SET comment_count = (SELECT COUNT(*) FROM public.resource_comments WHERE resource_id = v_resource_id AND deleted_at IS NULL)
    WHERE r.id = v_resource_id;
    RETURN NULL;
END;
$$;

CREATE TRIGGER trg_resource_comments_count
AFTER INSERT OR UPDATE OF deleted_at OR DELETE ON public.resource_comments
FOR EACH ROW EXECUTE FUNCTION public.sync_resource_comment_count();

-- 9.6 Keep resources.report_count in sync.
CREATE OR REPLACE FUNCTION public.sync_resource_report_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE public.resources SET report_count = report_count + 1 WHERE id = NEW.resource_id;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_resource_reports_count
AFTER INSERT ON public.resource_reports
FOR EACH ROW EXECUTE FUNCTION public.sync_resource_report_count();

-- 9.7 Centralized reputation ledger -> keep users.reputation_score in sync.
-- The app/edge functions only ever INSERT into reputation_events; this
-- trigger is the single place the cached score is written.
CREATE OR REPLACE FUNCTION public.sync_user_reputation_score()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE public.users SET reputation_score = reputation_score + NEW.points WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_reputation_events_apply
AFTER INSERT ON public.reputation_events
FOR EACH ROW EXECUTE FUNCTION public.sync_user_reputation_score();

-- 9.8 Award reputation automatically when a resource gets approved,
-- logged through moderation_logs (also doubles as the audit trail).
CREATE OR REPLACE FUNCTION public.log_moderation_and_reward()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_uploader UUID;
BEGIN
    IF NEW.status IS DISTINCT FROM OLD.status THEN
        INSERT INTO public.moderation_logs (resource_id, moderator_id, action)
        VALUES (
            NEW.id,
            auth.uid(),
            CASE NEW.status
                WHEN 'approved' THEN 'approved'::moderation_action
                WHEN 'rejected' THEN 'rejected'::moderation_action
                WHEN 'archived' THEN 'archived'::moderation_action
                ELSE 'restored'::moderation_action
            END
        );

        IF NEW.status = 'approved' THEN
            SELECT uploaded_by INTO v_uploader FROM public.resources WHERE id = NEW.id;
            IF v_uploader IS NOT NULL THEN
                INSERT INTO public.reputation_events (user_id, event_type, points, related_resource_id)
                VALUES (v_uploader, 'resource_approved', 10, NEW.id);
            END IF;
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_resources_moderation
AFTER UPDATE OF status ON public.resources
FOR EACH ROW EXECUTE FUNCTION public.log_moderation_and_reward();

-- =====================================================================
-- 10. INDEXES
-- =====================================================================

CREATE INDEX idx_modules_level ON public.modules(level);
CREATE INDEX idx_modules_semester ON public.modules(semester);

CREATE INDEX idx_resources_module ON public.resources(module_id);
CREATE INDEX idx_resources_type ON public.resources(resource_type);
CREATE INDEX idx_resources_status ON public.resources(status);
CREATE INDEX idx_resources_uploaded_by ON public.resources(uploaded_by);
CREATE INDEX idx_resources_created_at ON public.resources(created_at);
CREATE INDEX idx_resources_not_deleted ON public.resources(id) WHERE deleted_at IS NULL;
CREATE INDEX idx_resources_search ON public.resources USING GIN(search_vector);
CREATE INDEX idx_resources_title_trgm ON public.resources USING GIN(title gin_trgm_ops);

CREATE INDEX idx_resource_tags_tag ON public.resource_tags(tag_id);
CREATE INDEX idx_resource_ratings_resource ON public.resource_ratings(resource_id);
CREATE INDEX idx_resource_comments_resource ON public.resource_comments(resource_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_resource_comments_parent ON public.resource_comments(parent_comment_id);
CREATE INDEX idx_resource_favorites_resource ON public.resource_favorites(resource_id);
CREATE INDEX idx_resource_views_resource ON public.resource_views(resource_id);
CREATE INDEX idx_resource_downloads_resource ON public.resource_downloads(resource_id);
CREATE INDEX idx_resource_reports_status ON public.resource_reports(status);
CREATE INDEX idx_moderation_logs_resource ON public.moderation_logs(resource_id);

CREATE INDEX idx_exercise_submissions_resource ON public.exercise_submissions(resource_id);
CREATE INDEX idx_exercise_submissions_user ON public.exercise_submissions(user_id);

CREATE INDEX idx_reputation_events_user ON public.reputation_events(user_id);
CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id) WHERE is_read = FALSE;

CREATE INDEX idx_user_preferences_university ON public.user_preferences(university_id);
CREATE INDEX idx_user_preferences_level ON public.user_preferences(academic_level);
CREATE UNIQUE INDEX idx_users_username ON public.users(username) WHERE username IS NOT NULL;

-- =====================================================================
-- 11. ROW LEVEL SECURITY
-- =====================================================================

-- Helper: read the caller's role without recursive RLS on public.users.
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT role FROM public.users WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT public.current_user_role() IN ('moderator', 'admin');
$$;

-- ---- lookup tables: public read, staff write ----
ALTER TABLE public.academic_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_reasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read academic_levels" ON public.academic_levels FOR SELECT USING (TRUE);
CREATE POLICY "staff write academic_levels" ON public.academic_levels FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY "public read semesters" ON public.semesters FOR SELECT USING (TRUE);
CREATE POLICY "staff write semesters" ON public.semesters FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY "public read resource_types" ON public.resource_types FOR SELECT USING (TRUE);
CREATE POLICY "staff write resource_types" ON public.resource_types FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY "public read report_reasons" ON public.report_reasons FOR SELECT USING (TRUE);
CREATE POLICY "staff write report_reasons" ON public.report_reasons FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY "public read universities" ON public.universities FOR SELECT USING (TRUE);
CREATE POLICY "staff write universities" ON public.universities FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff());

-- ---- users ----
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read profiles" ON public.users FOR SELECT USING (TRUE);
CREATE POLICY "users update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.users WHERE id = auth.uid())); -- users cannot self-promote role
CREATE POLICY "staff update any profile" ON public.users FOR UPDATE USING (public.is_staff()) WITH CHECK (public.is_staff());

-- ---- user_preferences: private to the owner ----
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read own preferences" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "insert own preferences" ON public.user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update own preferences" ON public.user_preferences FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ---- modules: public read, staff write ----
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read active modules" ON public.modules FOR SELECT USING (is_active OR public.is_staff());
CREATE POLICY "staff write modules" ON public.modules FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff());

-- ---- resources ----
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read approved resources" ON public.resources
    FOR SELECT USING (
        deleted_at IS NULL
        AND (status = 'approved' OR uploaded_by = auth.uid() OR public.is_staff())
    );
CREATE POLICY "authenticated users upload resources" ON public.resources
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND uploaded_by = auth.uid());
CREATE POLICY "owner or staff update resources" ON public.resources
    FOR UPDATE USING (uploaded_by = auth.uid() OR public.is_staff())
    WITH CHECK (uploaded_by = auth.uid() OR public.is_staff());
CREATE POLICY "staff delete resources" ON public.resources FOR DELETE USING (public.is_staff());

-- ---- tags ----
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read tags" ON public.tags FOR SELECT USING (TRUE);
CREATE POLICY "authenticated create tags" ON public.tags FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "staff manage tags" ON public.tags FOR UPDATE USING (public.is_staff());
CREATE POLICY "staff delete tags" ON public.tags FOR DELETE USING (public.is_staff());

ALTER TABLE public.resource_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read resource_tags" ON public.resource_tags FOR SELECT USING (TRUE);
CREATE POLICY "owner or staff tag resources" ON public.resource_tags
    FOR INSERT WITH CHECK (
        public.is_staff() OR
        EXISTS (SELECT 1 FROM public.resources WHERE id = resource_id AND uploaded_by = auth.uid())
    );
CREATE POLICY "owner or staff untag resources" ON public.resource_tags
    FOR DELETE USING (
        public.is_staff() OR
        EXISTS (SELECT 1 FROM public.resources WHERE id = resource_id AND uploaded_by = auth.uid())
    );

-- ---- ratings ----
ALTER TABLE public.resource_ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read ratings" ON public.resource_ratings FOR SELECT USING (TRUE);
CREATE POLICY "users rate resources" ON public.resource_ratings
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users update own rating" ON public.resource_ratings
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users delete own rating" ON public.resource_ratings
    FOR DELETE USING (auth.uid() = user_id OR public.is_staff());

-- ---- comments ----
ALTER TABLE public.resource_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read comments" ON public.resource_comments FOR SELECT USING (deleted_at IS NULL OR public.is_staff());
CREATE POLICY "users write comments" ON public.resource_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users edit own comments" ON public.resource_comments
    FOR UPDATE USING (auth.uid() = user_id OR public.is_staff())
    WITH CHECK (auth.uid() = user_id OR public.is_staff());

-- ---- favorites: strictly private ----
ALTER TABLE public.resource_favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "manage own favorites" ON public.resource_favorites
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ---- views/downloads: insert-only by the acting user; aggregates read via resources ----
ALTER TABLE public.resource_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "insert own view events" ON public.resource_views
    FOR INSERT WITH CHECK (user_id IS NULL OR auth.uid() = user_id);
CREATE POLICY "staff read view events" ON public.resource_views FOR SELECT USING (public.is_staff());

ALTER TABLE public.resource_downloads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "insert own download events" ON public.resource_downloads
    FOR INSERT WITH CHECK (user_id IS NULL OR auth.uid() = user_id);
CREATE POLICY "staff read download events" ON public.resource_downloads FOR SELECT USING (public.is_staff());

-- ---- reports ----
ALTER TABLE public.resource_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users file reports" ON public.resource_reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "reporter or staff read reports" ON public.resource_reports
    FOR SELECT USING (auth.uid() = reporter_id OR public.is_staff());
CREATE POLICY "staff resolve reports" ON public.resource_reports
    FOR UPDATE USING (public.is_staff()) WITH CHECK (public.is_staff());

-- ---- moderation logs: staff only ----
ALTER TABLE public.moderation_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff read moderation logs" ON public.moderation_logs FOR SELECT USING (public.is_staff());
CREATE POLICY "staff write moderation logs" ON public.moderation_logs FOR INSERT WITH CHECK (public.is_staff());

-- ---- exercises ----
ALTER TABLE public.exercise_details ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read exercise_details" ON public.exercise_details FOR SELECT USING (TRUE);
CREATE POLICY "owner or staff write exercise_details" ON public.exercise_details
    FOR ALL USING (
        public.is_staff() OR
        EXISTS (SELECT 1 FROM public.resources WHERE id = resource_id AND uploaded_by = auth.uid())
    );

ALTER TABLE public.exercise_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own submissions" ON public.exercise_submissions
    FOR SELECT USING (auth.uid() = user_id OR public.is_staff());
CREATE POLICY "users create own submissions" ON public.exercise_submissions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ---- gamification ----
ALTER TABLE public.reputation_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own reputation events" ON public.reputation_events
    FOR SELECT USING (auth.uid() = user_id OR public.is_staff());
-- inserts happen only via SECURITY DEFINER functions/triggers or staff, never directly by clients
CREATE POLICY "staff insert reputation events" ON public.reputation_events
    FOR INSERT WITH CHECK (public.is_staff());

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read badges" ON public.badges FOR SELECT USING (TRUE);
CREATE POLICY "staff manage badges" ON public.badges FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff());

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read user_badges" ON public.user_badges FOR SELECT USING (TRUE);
CREATE POLICY "staff award badges" ON public.user_badges FOR INSERT WITH CHECK (public.is_staff());

-- ---- notifications: strictly private ----
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "update own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "system inserts notifications" ON public.notifications
    FOR INSERT WITH CHECK (public.is_staff());

-- =====================================================================
-- 12. SEED DATA (safe defaults so the app boots with real dropdown values)
-- =====================================================================

INSERT INTO public.academic_levels (code, name_ar, name_en, order_index) VALUES
    ('L1', 'السنة الأولى ليسانس', 'L1', 1),
    ('L2', 'السنة الثانية ليسانس', 'L2', 2),
    ('L3', 'السنة الثالثة ليسانس', 'L3', 3),
    ('M1', 'السنة الأولى ماستر', 'M1', 4),
    ('M2', 'السنة الثانية ماستر', 'M2', 5);

INSERT INTO public.semesters (code, name_ar, name_en, order_index) VALUES
    ('S1', 'السداسي الأول', 'Semester 1', 1),
    ('S2', 'السداسي الثاني', 'Semester 2', 2);

INSERT INTO public.resource_types (code, name_ar, name_en, order_index) VALUES
    ('course',   'محاضرة',      'Course',    1),
    ('td',       'أعمال موجهة', 'TD',        2),
    ('tp',       'أعمال تطبيقية','TP',       3),
    ('exam',     'امتحان',      'Exam',      4),
    ('summary',  'ملخص',        'Summary',   5),
    ('solution', 'حل',          'Solution',  6),
    ('project',  'مشروع',       'Project',   7),
    ('exercise', 'تمرين برمجي', 'Exercise',  8),
    ('other',    'أخرى',        'Other',     9);

INSERT INTO public.report_reasons (code, name_ar, name_en) VALUES
    ('spam',          'محتوى مزعج',        'Spam'),
    ('copyright',     'انتهاك حقوق الملكية', 'Copyright violation'),
    ('duplicate',     'محتوى مكرر',         'Duplicate content'),
    ('inappropriate', 'محتوى غير لائق',      'Inappropriate content'),
    ('wrong_module',  'وحدة خاطئة',         'Wrong module'),
    ('other',         'سبب آخر',            'Other');